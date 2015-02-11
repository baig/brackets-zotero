/*
 * @fileoverview    Kicks everything into action.
 * @author          Wasif Hasan Baig <pr.wasif@gmail.com>
 * @copyright       Wasif Hasan Baig 2015
 * @version         0.1.3
 * @since           0.1.3
 * @license         MIT
 */
define(function (require, exports, module) {
    'use strict';

    // Brackets Modules
    var EditorManager = brackets.getModule("editor/EditorManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils")

    // Local modules
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")
    var Utils = require("src/utils/Utils")
    require('src/Zotero')
    require('src/Panel')
    require('src/Document')
    require('src/Bibliography')
    require('src/SettingsDialog')

    /**
     * Channeling `activeEditorChange` Brackets' Event to the
     * Extension's Radio Channel
     */
    EditorManager.on("activeEditorChange", function (e, newEd, oldEd) {
        Channel.Extension.trigger(Events.EVENT_EDITOR_CHANGE, newEd)
    })

    function _init() {
        // registering all commands to use Extension-wide Radio Channel
        Utils.registerCommandsAndKeyBindings()
        // loading octicons css
        ExtensionUtils.loadStyleSheet(module, '../styles/icons/octicons/octicons.css');
        // wake up everyone
        Channel.Extension.trigger(Events.EVENT_INIT)
    }

    module.exports = { init: _init }
});
