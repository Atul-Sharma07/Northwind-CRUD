/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"task1/task1/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
