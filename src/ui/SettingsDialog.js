/*jslint nomen: true */
/*global define, brackets, Mustache */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var Dialogs = brackets.getModule("widgets/Dialogs"),
        _       = brackets.getModule("thirdparty/lodash");

    // Local modules
    var Channel = require("src/utils/Channel"),
        Events  = require("src/utils/Events"),
        C       = require("src/utils/Constants"),
        S       = require("strings");

    // Templates and resources
    var SettingsDialogTemplate = require("text!../../htmlContent/zotero-settings-dialog.html");

    /**
     * Handlers
     */
    function handleShowSettingsDialog() {
        var compiledTemplate = Mustache.render(SettingsDialogTemplate, {S: S});
        Dialogs.showModalDialogUsingTemplate(compiledTemplate, true);
    }

    function init() {
        Channel.Extension.comply(C.CMD_ID_SHOW_SETTINGS, handleShowSettingsDialog);
    }

    function SettingsDialog() {
        Channel.Extension.on(Events.EVT_INIT, _.bind(init, this));
    }

    module.exports = new SettingsDialog();
});
