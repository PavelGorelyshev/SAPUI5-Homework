/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblesson02/Worklist/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblesson02/Worklist/test/integration/pages/Worklist",
	"zjblesson02/Worklist/test/integration/pages/Object",
	"zjblesson02/Worklist/test/integration/pages/NotFound",
	"zjblesson02/Worklist/test/integration/pages/Browser",
	"zjblesson02/Worklist/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblesson02.Worklist.view."
	});

	sap.ui.require([
		"zjblesson02/Worklist/test/integration/WorklistJourney",
		"zjblesson02/Worklist/test/integration/ObjectJourney",
		"zjblesson02/Worklist/test/integration/NavigationJourney",
		"zjblesson02/Worklist/test/integration/NotFoundJourney",
		"zjblesson02/Worklist/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});