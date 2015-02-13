define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var Dialogs = brackets.getModule("widgets/Dialogs")
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var C = require("src/utils/Constants")
    var S = require("strings")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")

    // HTML Templates
    var SettingsDialogTemplate = require("text!../../htmlContent/zotero-settings-dialog.html")

    /**
     * Handlers
     */
    function _handleShowSettingsDialog() {
        var compiledTemplate = Mustache.render( SettingsDialogTemplate, {S: S} )
        Dialogs.showModalDialogUsingTemplate( compiledTemplate, true )
    }

    function _init() {
        Channel.Extension.comply(C.CMD_ID_SHOW_SETTINGS, _handleShowSettingsDialog)
    }

    function SettingsDialog() {
        Channel.Extension.on(Events.EVENT_INIT, _.bind(_init, this))
    }

    module.exports = new SettingsDialog()
});
