/*jslint vars: true, nomen: true */
/*global define, brackets, $, Mustache */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
        CommandManager   = brackets.getModule("command/CommandManager"),
        DefaultDialogs   = brackets.getModule("widgets/DefaultDialogs"),
        Dialogs          = brackets.getModule("widgets/Dialogs"),
        _                = brackets.getModule("thirdparty/lodash");

    // Local modules
    var Channel          = require("src/utils/Channel"),
        Events           = require("src/utils/Events"),
        S                = require("strings"),
        C                = require("src/utils/Constants");

    // Templates and resources
    var PanelTemplate    = require("text!../../htmlContent/zotero-panel.html"),
        icon             = require.toUrl("styles/icons/zotero.png").replace(/ /g, "%20");

    function show(Panel) {
        // show panel
        Panel.panel.show();
        // focus on query field on panel show
        $(C.UI_SEARCH_INPUT).focus();
        // add `active` class to zotero icon
        Channel.Extension.command(Events.CMD_TOGGLE_ICON_STATE);
        // toggle visibility flag
        Panel.visible = !Panel.visible;
        // triggering event that the panel is now visible
        Channel.Extension.trigger(Events.EVT_PANEL_SHOWN);
    }

    function clearSearchField() {
        $(C.UI_SEARCH_INPUT).val("");
    }

    function hide(Panel) {
        // hide panel
        Panel.panel.hide();
        // clear search field
        clearSearchField();
        // clear search results list
        Channel.UI.command(Events.CMD_CLEAR_SEARCH_ITEMS);
        // remove `active` class to zotero icon
        Channel.Extension.command(Events.CMD_TOGGLE_ICON_STATE);
        // toggle visibility flag
        Panel.visible = !Panel.visible;
        // triggering event that the panel has been hidden
        Channel.Extension.trigger(Events.EVT_PANEL_HIDDEN);
    }

    function toggleZoteroPanel(visibilityFlag) {
        /*jshint validthis: true */
        switch (visibilityFlag) {
        case true:
            show(this);
            break;
        case false:
            hide(this);
            break;
        default:
            if (this.visible) {
                hide(this);
            } else {
                show(this);
            }
        }
    }

    function _handleSearchOnKeyUp() {
        /*jshint validthis: true */
        var query = $(this).val().trim();
        if (!query) {
            Channel.UI.command(Events.CMD_CLEAR_SEARCH_ITEMS, {unselected: true});
            return false;
        }
        Channel.Zotero.command(Events.CMD_SEARCH, query);
        Channel.UI.complyOnce(Events.CMD_DISPLAY_ERROR, _displayErrorDialog);
    }

    function _displayErrorDialog() {
        var title = "Unable to Search Zotero Library!",
            msg = "";

        msg += "Make sure either <strong>Firefox</strong> or <strong>Zotero standalone</strong> ";
        msg += "is running with <strong>Better Bib(La)TeX</strong> extension installed and ";
        msg += "configured.";
        msg += "<br><br>";
        msg += 'See <strong>Install & Use</strong> section on <a href="http://baig.github.io';
        msg += '/brackets-zotero/">this</a> page for more detailed setup instructions.';

        clearSearchField();
        Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, title, msg);
    }

    function _clearAll() {
        clearSearchField();
        Channel.UI.command(Events.CMD_CLEAR_SEARCH_ITEMS);
    }

    function isVisible() {
        /*jshint validthis: true */
        return this.visible;
    }

    function _handlePanelEvent(e) {
        CommandManager.execute(e.data.cmd);
    }

    function init() {
        /*jshint validthis: true */
        var $renderedTemplate = $(Mustache.render(PanelTemplate, {S: S, icon: icon})),
            $panel;

        this.panel = WorkspaceManager.createBottomPanel(C.PANEL_BOTTOM, $renderedTemplate, 300);
        $panel = this.panel.$panel;

        $panel
            .on("keyup", C.UI_SEARCH_INPUT,  _handleSearchOnKeyUp)
            .on("click", C.CLOSE_BTN,        {cmd: Events.CMD_HIDE_PANEL},      _handlePanelEvent)
            .on("click", C.CLEAR_BTN,        {cmd: Events.CMD_CLEAR_ALL},       _handlePanelEvent)
            .on("click", C.INSERT_BTN,       {cmd: Events.CMD_INSERT_CITE},     _handlePanelEvent)
            .on("click", C.INSERT_BIB_BTN,   {cmd: Events.CMD_INSERT_BIBLIO},   _handlePanelEvent)
            .on("click", C.GENERATE_BIB_BTN, {cmd: Events.CMD_GENERATE_BIBLIO}, _handlePanelEvent)
            .on("click", C.SETTINGS_BTN,     {cmd: Events.CMD_SHOW_SETTINGS},   _handlePanelEvent);

        Channel.UI.comply(Events.CMD_DISPLAY_ERROR,             _displayErrorDialog);
        Channel.UI.reply(Events.RQT_PANEL_VISIBILITY_STATUS,    _.bind(isVisible, this));

        Channel.Extension.comply(Events.CMD_TOGGLE_PANEL, _.bind(toggleZoteroPanel, this));
        Channel.Extension.comply(Events.CMD_HIDE_PANEL,   _.bind(toggleZoteroPanel, this, false));
        Channel.Extension.comply(Events.CMD_CLEAR_ALL,    _clearAll);

        Channel.UI.command(Events.CMD_SEARCH_PANELVIEW_INIT,   $panel);
        Channel.UI.command(Events.CMD_CITE_PANELVIEW_INIT,     $panel);
    }

    function Panel() {
        this.visible = false;
        this.panel = null;
        Channel.Extension.on(Events.EVT_INIT, _.bind(init, this));
    }

    module.exports = new Panel();

});
