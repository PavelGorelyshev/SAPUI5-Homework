/*global location history */
sap.ui.define([
		"zjblesson02/WorklistShoes/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblesson02/WorklistShoes/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/Dialog",
		"sap/m/MessageToast"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Dialog, MessageToast) {
		"use strict";

		return BaseController.extend("zjblesson02.WorklistShoes.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");

				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// keeps the search state
				this._aTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");

				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			},
			
			


			onSearchSubGroupText: function(oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("SubGroupText", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},
			
			onSearchMaterialText: function(oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("MaterialText", FilterOperator.EQ, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("MaterialID")
				});
			},
			
		
			onPressCreate: function() {
				var that = this;
				var oDialog = new Dialog({
					title: "Create Item",
					contentWidth: "240px",
					type: "Message",
					content: [
						new sap.m.Label({
							text: "Enter Material Text",
							labelFor: "MaterialTextCreate"
						}),
						new sap.m.Input("MaterialTextCreate", {
							maxLength: 20,
							minLength: 1,
							liveChange: function(oEvent) {
							oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter('value').split(" ").join("").length > 0);
							}
						}),

						new sap.m.Label({
							text: "Enter Group ID",
							labelFor: "GroupID"
						}),
						new sap.m.Input("GroupIDCreate", {
							placeholder: "from 1 to 5",
							maxLength: 1,
							liveChange: function(oEvent) {
								oEvent.getSource().getParent().getBeginButton().setDisenabled(oEvent.getParameter('value').split(" ").join("").length > 0);
							}
						}),

						new sap.m.Label({
							text: "Enter SubGroup ID",
							labelFor: "SubGroupID"
						}),
						new sap.m.Input("SubGroupIDCreate", {
							placeholder: "from 1 to 6",
							maxLength: 1,
							liveChange: function(oEvent) {
								oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter('value').split(" ").join("").length > 0);
							}
						})
					],
					beginButton: new sap.m.Button({
						type: "Emphasized",
						text: "Create",
						enabled: false,
						
						press: function() {
							oDialog.close();
							var newItem = {
								MaterialID: "",
								MaterialText: oDialog.getContent()[1].getValue(),
								Language: "RU",
								GroupID: oDialog.getContent()[3].getValue(),
								SubGroupID: oDialog.getContent()[5].getValue(),
								Version: "A",
								proverka: function(){
									if(oDialog.getContent()[1].getValue() === 0){
										MessageToast.show("Choose item");
									}
								}
							};
							that.getModel().create("/zjblessons_base_Materials", newItem, {
								success: function(e) {
									MessageToast.show("New Material has been created");
								},
								error: function(e) {
									MessageToast.show("Error!");
								}
							});
						}
					}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function() {
							oDialog.close();
						}
					}),
					afterClose: function() {
						oDialog.destroy();
					}
				});
				oDialog.open();
			},
			
			onPressEdit  : function() {
				if (this.getView().byId("table").getSelectedItems().length === 0) {
					MessageToast.show("Choose item");
				} else {
					var that = this;
					var editedItem = this.getView().byId("table").getSelectedItems()[0].getBindingContext().getPath();
					var oDialog = new Dialog({
						title: "Edit Item",
						contentWidth: "240px",
						type: "Message",
						content: [
							new sap.m.Label({
								text: "Enter New Material Text",
								labelFor: "MaterialTextEdit"
							}),
							new sap.m.Input("MaterialTextEdit", {
								maxLength: 20,
								liveChange: function(oEvent) {
									oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter('value').split(" ").join("").length > 0);
								}
							}),
	
							new sap.m.Label({
								text: "Enter new Group ID",
								labelFor: "GroupIDEdit"
							}),
							new sap.m.Input("GroupIDEdit", {
								maxLength: 1,
								liveChange: function(oEvent) {
									oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter('value').split(" ").join("").length > 0);
								}
							}),
	
							new sap.m.Label({
								text: "Enter new SubGroup ID",
								labelFor: "SubGroupIDEdit"
							}),
							new sap.m.Input("SubGroupIDEdit", {
								maxLength: 1,
								liveChange: function(oEvent) {
									oEvent.getSource().getParent().getBeginButton().setEnabled(oEvent.getParameter('value').split(" ").join("").length > 0);
								}
							})
						],
						beginButton: new sap.m.Button({
							type: "Emphasized",
							text: "Edit",
							enabled: false,
							press: function() {
								oDialog.close();
								that.getModel().update(editedItem, {
									MaterialText: oDialog.getContent()[1].getValue(),
									GroupID: oDialog.getContent()[3].getValue(),
									SubGroupID: oDialog.getContent()[5].getValue()	
								}, 
								{
									success: function(e) {
										MessageToast.show("Material has been edited");
									},
									error: function(e) {
										MessageToast.show("Error!");
									}
								});
							}
						}),
						endButton: new sap.m.Button({
							text: "Cancel",
							press: function() {
								oDialog.close();
							}
						}),
						afterClose: function() {
							oDialog.destroy();
						}
					});
					oDialog.open();
				}
			},
			
			onPressDelete: function() {
				if (this.getView().byId("table").getSelectedItems().length === 0) {
					MessageToast.show("Choose item");
				} else {
					this.oApproveDialog = new Dialog({
						title: "Confirm delete action",
						type: "Message",
						content: new sap.m.Text({
							text: "Do you want to delete this item?"
						}),
						beginButton: new sap.m.Button({
							type: "Emphasized",
							text: "Delete",
							press: function() {
								this.getModel().remove(this.getView().byId("table").getSelectedItems()[0].getBindingContext().getPath());
								MessageToast.show("The item has been deleted");
								this.oApproveDialog.close();
							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: "Cancel",
							press: function() {
								this.oApproveDialog.close();
							}.bind(this)
						})
					});
					this.oApproveDialog.open();
				}
			},
			
			onPressRefresh: function(oEvent){
				this.getModel().refresh();
				MessageToast.show("Worklist has been refreshed");
			},
			
		

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
			 * @private
			 */
			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);