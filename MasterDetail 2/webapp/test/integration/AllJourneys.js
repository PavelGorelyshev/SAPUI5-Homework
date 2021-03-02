/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 MaterialID in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"jetCourses/MasterDetailApp/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"jetCourses/MasterDetailApp/test/integration/pages/App",
	"jetCourses/MasterDetailApp/test/integration/pages/Browser",
	"jetCourses/MasterDetailApp/test/integration/pages/Master",
	"jetCourses/MasterDetailApp/test/integration/pages/Detail",
	"jetCourses/MasterDetailApp/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "jetCourses.MasterDetailApp.view."
	});

	sap.ui.require([
		"jetCourses/MasterDetailApp/test/integration/MasterJourney",
		"jetCourses/MasterDetailApp/test/integration/NavigationJourney",
		"jetCourses/MasterDetailApp/test/integration/NotFoundJourney",
		"jetCourses/MasterDetailApp/test/integration/BusyJourney",
		"jetCourses/MasterDetailApp/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});