/*global location*/
sap.ui.define([
		"zjblesson02/WorklistShoes/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zjblesson02/WorklistShoes/model/formatter",
		"sap/m/MessageToast",
		"sap/m/MessageBox"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter,
		MessageToast,
		MessageBox
	) {
		"use strict";

		return BaseController.extend("zjblesson02.WorklistShoes.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0,
						enableChange : false,
						selectedTab: "List"
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},
			
			
			onPressSubmitChanges: function(oEvent){
				var sPath = this.getView().getBindingContext().getPath() + "/";
				var sMaterialText = this.getView().byId("inpMaterialText").getValue();
				var iSubGroupID = this.getView().byId("SelectSubGroupText").getSelectedIndex() + 1;
				var iGroupID = this.getView().byId("SelectGroupText").getSelectedIndex() + 1;
				var sIntegrationID = this.getView().byId("inpIntegrationID").getValue();
				this.getModel().setProperty(sPath + "MaterialText", sMaterialText);
				this.getModel().setProperty(sPath + "SubGroupID", iSubGroupID.toString());
				this.getModel().setProperty(sPath + "GroupID", iGroupID.toString());
				this.getModel().setProperty(sPath + "IntegrationID", sIntegrationID);
				this.getModel().submitChanges();
				MessageToast.show("Item saved");
			},
			
			onPressResetChanges: function(oEvent){
				this.getModel().resetChanges();
				MessageToast.show("Changes reset");
			},
			
			onPressRefresh: function(oEvent){
				this.getModel().refresh();
				MessageToast.show("Item refreshed");
			},
			
			onChangeMessageToast: function(oEvent) {
				var oSmartField = oEvent.getSource();
				var oSmartFieldSelect = oSmartField.getValue();
				MessageToast.show(`${this.getModel("i18n").getResourceBundle().getText("tSelectedField")} ${oSmartFieldSelect}`);
			},
			
		onEditToggled: function(oEvent) {
			var bSubmitChanges = oEvent.getParameter("editable");
			var that=this;
			if (!bSubmitChanges) {
				MessageBox.confirm("Save or Cancel Changes", {
					title: "Save?",
					onClose: function(pressButton) {
						if(pressButton === MessageBox.Action.OK) {
							that.getModel().submitChanges();
							MessageToast.show(`${that.getModel("i18n").getResourceBundle().getText("tSaved")}`);
						} else 
							if(pressButton === MessageBox.Action.CANCEL) {
							that.getModel().resetChanges();
							MessageToast.show(`${that.getModel("i18n").getResourceBundle().getText("tCanceled")}`);
						}
					}
				})
				this.getModel("objectView").setProperty("/enableChange", false);
			} else {
				this.getModel("objectView").setProperty("/enableChange", true);
			}
		},
		
		onChangeMessageToast: function(oEvent) {
			var oSmartField = oEvent.getSource();
			var oSmartFieldSelect = oSmartField.getValue();
			
			MessageToast.show(`${this.getModel("i18n").getResourceBundle().getText("tSelectedField")} ${oSmartFieldSelect}`);
		},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

 
			/**
			 * Event handler  for navigating back.
			 * It there is a history entry we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the worklist route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("worklist", {}, true);
				}
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("zjblessons_base_Materials", {
						MaterialID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.MaterialID,
					sObjectName = oObject.MaterialText;

				oViewModel.setProperty("/busy", false);

				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			}

		});

	}
);