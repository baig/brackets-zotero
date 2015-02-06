define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var ProjectManager = brackets.getModule("project/ProjectManager")
    var FileSystem = brackets.getModule("filesystem/FileSystem")
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var settings = JSON.parse(require('text!settings.json'));
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")


    function _writeBibFile(biblioString) {
        var bibFileFullPath = ProjectManager.getProjectRoot().fullPath + settings.bibFileName
        var bibFile = FileSystem.getFileForPath(bibFileFullPath)
        console.log('Writing Bibliography to file: "' + bibFileFullPath + '"')
        bibFile.write(biblioString)
    }

    /**
     * Handlers
     */
    function _handleGenerateBibliography() {
        var bibliographyPromise = Channel.Zotero.request(Events.REQUEST_BIBLIOGRAPHY)
        if (!bibliographyPromise) throw new Error("Error generating Bibliography file.")
        bibliographyPromise.then( function (data) {
            _writeBibFile(data.result)
        })
    }

    function _init() {
//        console.log("initializing Bibliography...")
        Channel.Extension.comply(C.CMD_ID_GENERATE_BIBLIO, _handleGenerateBibliography)
//        console.log("initializing Bibliography...COMPLETE")
    }

    function Bibliography() {
        Channel.Extension.on(Events.EVENT_INIT, _.bind(_init, this))
    }
    
    module.exports = new Bibliography()

});