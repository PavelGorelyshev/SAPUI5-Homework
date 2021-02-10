sap.ui.define([
		"zjblesson02/Worklist/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblesson02.Worklist.controller.NotFound", {

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