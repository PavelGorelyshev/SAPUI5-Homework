/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"jetCourses/MasterDetailApp/test/integration/NavigationJourneyPhone",
		"jetCourses/MasterDetailApp/test/integration/NotFoundJourneyPhone",
		"jetCourses/MasterDetailApp/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});