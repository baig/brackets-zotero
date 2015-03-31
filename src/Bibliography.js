/*jslint vars: true, nomen: true, plusplus: true */
/*global define, brackets, console */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var ProjectManager  = brackets.getModule("project/ProjectManager");
    var FileSystem      = brackets.getModule("filesystem/FileSystem");
    var _               = brackets.getModule("thirdparty/lodash");

    // Local modules
    var settings        = JSON.parse(require("text!settings.json"));
    var Channel         = require("src/utils/Channel");
    var Events          = require("src/utils/Events");

    function writeBibFile(biblioString) {
        var bibFileFullPath = ProjectManager.getProjectRoot().fullPath + settings.bibFileName;
        var bibFile = FileSystem.getFileForPath(bibFileFullPath);
        console.log('Writing Bibliography to file: "' + bibFileFullPath + '"');
        bibFile.write(biblioString);
    }

    /**
     * Handlers
     */
    function handleGenerateBibliography() {
        var bibliographyPromise = Channel.Zotero.request(Events.RQT_BIBLIOGRAPHY);
        if (!bibliographyPromise) {
            throw new Error("Error generating Bibliography file.");
        }
        bibliographyPromise.then(function (data) {
            writeBibFile(data.result);
        });
    }

    function init() {
        Channel.Extension.comply(Events.CMD_GENERATE_BIBLIO, handleGenerateBibliography);
    }

    function Bibliography() {
        Channel.Extension.on(Events.EVT_INIT, _.bind(init, this));
    }

    module.exports = new Bibliography();

});
