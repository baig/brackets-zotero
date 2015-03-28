/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    var PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        prefs = PreferencesManager.getExtensionPrefs("baig.brackets.zotero");

    // First, we define our preference so that Brackets knows about it.
    // Eventually there may be some automatic UI for this.
    // Name of preference, type and the default value are the main things to define.
    // This is actually going to create a preference called "myextensionname.enabled".
    prefs.definePreference("enabled", "boolean", true);
    prefs.definePreference("onlyShowItemsHavingBibtexKey", "boolean", true);
    prefs.definePreference("extraFieldPrefix", "string", "bibtex");
    prefs.definePreference("bibFileName", "string", "refs.bib");
    prefs.definePreference("docTypesToScanForCitationKeys", "array",  ["txt", "md"]);
    prefs.definePreference("scanRefreshInterval", "number", 10000);
    prefs.definePreference("bibFolderName", "string", "brackets-zotero-bibtex-DB");

    // Set up a listener that is called whenever the preference changes
    // You don't need to listen for changes if you can just look up the current value of
    // the pref when you're performing some operation.
    //    prefs.on("change", function () {
    //        // This gets the current value of "enabled" where current means for the
    //        // file being edited right now.
    //        doSomethingWith(prefs.get("enabled"));
    //    });

    // This will set the "enabled" pref in the same spot in which the user has set it.
    // Generally, this will be in the user's brackets.json file in their app info directory.

    //    prefs.set("enabled", false);

    // Then save the change
    prefs.save();
    //    prefs.savePreferences();
});
