/*
 * @fileoverview    Kicks everything into action.
 * @author          Wasif Hasan Baig <pr.wasif@gmail.com>
 * @copyright       Wasif Hasan Baig 2015
 * @version         0.1.3
 * @since           0.1.3
 * @license         MIT
 */

/*jslint vars: true */
/*global define, brackets, $ */
define(function (require, exports, module) {
    "use strict";

    // Brackets Modules
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager");

    // Local modules
    var Channel         = require("src/utils/Channel"),
        Events          = require("src/utils/Events"),
        Utils           = require("src/utils/Utils"),
        S               = require("strings");

    // Local requires
    require("src/Zotero");
    require("src/ui/Panel");
    require("src/ui/SearchPanelView");
    require("src/ui/CitePanelView");
    require("src/Document");
    require("src/Bibliography");
    require("src/ui/SettingsDialog");

    // private variables
    var $icon = null;

    /**
     * Channeling `activeEditorChange` Brackets' Event to the
     * Extension's Radio Channel
     */
    EditorManager.on("activeEditorChange", function (e, newEd, oldEd) {
        Channel.Extension.trigger(Events.EVT_EDITOR_CHANGE, newEd);
    });

    function _handleZoteroIconClassToggle() {
        $icon.toggleClass("active");
    }

    function _handlePanelToggle() {
        CommandManager.execute(Events.CMD_TOGGLE_PANEL);
    }

    function init() {
        // registering all commands to use Extension-wide Radio Channel
        Utils.registerCommandsAndKeyBindings();
        // loading octicons css
        ExtensionUtils.loadStyleSheet(module, "../styles/main.less");
        // Displaying icon in the Project Panel and attach `click` handler
        $icon = $('<a id="zotero-toolbar-icon" href="#" title="' + S.UI_TOOLTIP + '"></a>')
                .appendTo($("#main-toolbar .buttons"))
                .on("click", _handlePanelToggle);
        // complying to toggle class on icon
        Channel.Extension.comply(Events.CMD_TOGGLE_ICON_STATE, _handleZoteroIconClassToggle);
        // wake up everyone
        Channel.Extension.trigger(Events.EVT_INIT);
    }

    module.exports = {
        init : init
    };

});
