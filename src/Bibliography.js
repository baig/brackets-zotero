/*jslint vars: true, nomen: true, plusplus: true */
/*global define, brackets, console */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var ProjectManager  = brackets.getModule("project/ProjectManager");
    var FileSystem      = brackets.getModule("filesystem/FileSystem");

    // Local modules
    var settings        = JSON.parse(require("text!settings.json"));
    var Channel         = require("src/utils/Channel");
    var Events          = require("src/utils/Events");
    var Prefs            = require("src/Preferences");

    function writeBibFile(biblioString) {
        var bibFileFullPath = ProjectManager.getProjectRoot().fullPath + Prefs.get("bibFileName");
        var bibFile = FileSystem.getFileForPath(bibFileFullPath);
        console.log('Writing Bibliography to file: "' + bibFileFullPath + '"');
        bibFile.write(biblioString);
    }

    /**
     * Handlers
     */
    function _handleBiblioGeneration() {
        var bibliographyPromise = Channel.Zotero.request(Events.RQT_BIBLIOGRAPHY);
        if (!bibliographyPromise) {
            throw new Error("Error generating Bibliography file.");
        }
        bibliographyPromise.then(function (data) {
            writeBibFile(data.result);
        });
    }

    function _init() {
        Channel.Extension.comply(Events.CMD_GENERATE_BIBLIO, _handleBiblioGeneration);
    }

    function Bibliography() {
        Channel.Extension.on(Events.EVT_INIT, _init, this);
    }

    module.exports = new Bibliography();

});
