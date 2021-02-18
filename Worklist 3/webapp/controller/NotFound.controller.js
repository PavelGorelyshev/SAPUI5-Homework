sap.ui.define([
		"zjblesson02/WorklistShoes/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblesson02.WorklistShoes.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);