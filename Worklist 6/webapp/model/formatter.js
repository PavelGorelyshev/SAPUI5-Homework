sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		
		formatCreationInfo: function(User, Date) {
			var DateFormatPattern = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy.MM.dd"
			});
			var DateFormatRelative = sap.ui.core.format.DateFormat.getDateInstance({
				relative: "true",
				relativeRange: "[-60;6]"
			});
			var formatDate = DateFormatPattern.format(Date);
			var DateRelative = DateFormatRelative.format(Date);
			var CreationInfo = this.getModel("i18n").getResourceBundle().getText("labelCreatedBy") + " " + User 
			+ " " + this.getModel("i18n").getResourceBundle().getText("labelCreatedOn") + " " + formatDate + " (" + DateRelative + ")";
			return CreationInfo.split('LAB').join('');
		},
		
		formatModificationInfo: function(User, Date) {
			var DateFormatPattern = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy.MM.dd"
			});
			var DateFormatRelative = sap.ui.core.format.DateFormat.getDateInstance({
				relative: "true",
				relativeRange: "[-30;6]"
			});
			var newDate = DateFormatPattern.format(Date);
			var newDateRelative = DateFormatRelative.format(Date);
			var ModificationInfo = this.getModel("i18n").getResourceBundle().getText("labelModifiedBy") + " " + User 
			+ " " + this.getModel("i18n").getResourceBundle().getText("labelModifiedOn") + " " + newDate + " (" + newDateRelative + ")";
			return ModificationInfo.split('LAB').join('');
		}

	};

});