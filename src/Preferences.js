/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    var prefs              = PreferencesManager.getExtensionPrefs("baig.zoteroplugin");

    // Defining preferences
    prefs.definePreference("itemsWithBibtexKeyOnly", "boolean", true);
    prefs.definePreference("extraFieldPrefix",       "string",  "bibtex:");
    prefs.definePreference("docTypesToScan",         "string",  "md txt");
    prefs.definePreference("bibFolderName",          "string",  "brackets-zotero-bibtex-DB");
    prefs.definePreference("scanInterval",           "number",  10000);
    prefs.definePreference("bibFileName",            "string",  "refs.bib");

    // Saving preferences
    prefs.save();
    
    // Get preference
    function get(name) {
        return prefs.get(name);
    }
        
    // Set preference
    function set(name, value) {
        prefs.set(name, value);
    }
    
    module.exports = {
        get: get,
        set: set
    }

});
