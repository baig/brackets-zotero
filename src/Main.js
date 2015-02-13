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
    var CommandManager = brackets.getModule("command/CommandManager")

    // Local modules
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")
    var Utils = require("src/utils/Utils")
    var C = require("src/utils/Constants")
    var S = require("strings")
    require('src/Zotero')
    require('src/ui/Panel')
    require('src/ui/SearchPanelView')
    require('src/ui/CitePanelView')
    require('src/Document')
    require('src/Bibliography')
    require('src/ui/SettingsDialog')

    // private variables
    var $icon = null;

    /**
     * Channeling `activeEditorChange` Brackets' Event to the
     * Extension's Radio Channel
     */
    EditorManager.on("activeEditorChange", function (e, newEd, oldEd) {
        Channel.Extension.trigger(Events.EVENT_EDITOR_CHANGE, newEd)
    })

    function _handleZoteroIconClassToggle() {
        $icon.toggleClass('active')
    }

    function _init() {
        // registering all commands to use Extension-wide Radio Channel
        Utils.registerCommandsAndKeyBindings()
        // loading octicons css
        ExtensionUtils.loadStyleSheet(module, '../styles/main.less');
        // Displaying icon in the Project Panel and attach `click` handler
        $icon = $('<a id="zotero-toolbar-icon" href="#" title="' + S.UI_TOOLTIP + '"></a>')
                .appendTo($("#main-toolbar .buttons"))
                .on("click", function () { CommandManager.execute(C.CMD_ID_TOGGLE_PANEL) })
        // complying to toggle class on icon
        Channel.Extension.comply( Events.COMMAND_TOGGLE_ICON_STATE, _handleZoteroIconClassToggle )
        // wake up everyone
        Channel.Extension.trigger(Events.EVENT_INIT)
    }

    module.exports = { init: _init }
});
