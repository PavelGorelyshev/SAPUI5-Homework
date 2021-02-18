/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblesson02/WorklistShoes/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblesson02/WorklistShoes/test/integration/pages/Worklist",
	"zjblesson02/WorklistShoes/test/integration/pages/Object",
	"zjblesson02/WorklistShoes/test/integration/pages/NotFound",
	"zjblesson02/WorklistShoes/test/integration/pages/Browser",
	"zjblesson02/WorklistShoes/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblesson02.WorklistShoes.view."
	});

	sap.ui.require([
		"zjblesson02/WorklistShoes/test/integration/WorklistJourney",
		"zjblesson02/WorklistShoes/test/integration/ObjectJourney",
		"zjblesson02/WorklistShoes/test/integration/NavigationJourney",
		"zjblesson02/WorklistShoes/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});