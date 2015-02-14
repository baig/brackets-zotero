define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var CommandManager = brackets.getModule("command/CommandManager")
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager")
    var DefaultDialogs = brackets.getModule("widgets/DefaultDialogs")
    var Dialogs = brackets.getModule("widgets/Dialogs")
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var S = require("strings")
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")

    // Tempates and Resources
    var PanelTemplate = require("text!../../htmlContent/zotero-panel.html");
    var icon = require.toUrl("styles/icons/zotero.png").replace(/ /g, '%20')

    function _toggleZoteroPanel(show) {
        switch (show) {
            case true: _show(this); return
            case false: _hide(this); return
            default:
                if (this.visible) _hide(this)
                else _show(this)
        }
    }

    function _show(Panel) {
        // show panel
        Panel.panel.show()
        // focus on query field on panel show
        $(C.UI_SEARCH_INPUT).focus()
        // add `active` class to zotero icon
        Channel.Extension.command( Events.COMMAND_TOGGLE_ICON_STATE )
        // toggle visibility flag
        Panel.visible = !Panel.visible
        // triggering event that the panel is now visible
        Channel.Extension.trigger( Events.EVENT_PANEL_SHOWN )
    }

    function _hide(Panel) {
        // hide panel
        Panel.panel.hide()
        // clear search field
        _clearSearchField()
        // clear search results list
        Channel.UI.command( Events.COMMAND_CLEAR_SEARCH_ITEMS )
        // remove `active` class to zotero icon
        Channel.Extension.command( Events.COMMAND_TOGGLE_ICON_STATE )
        // toggle visibility flag
        Panel.visible = !Panel.visible
        // triggering event that the panel has been hidden
        Channel.Extension.trigger( Events.EVENT_PANEL_HIDDEN )
    }

    function _handleSearchOnKeyUp() {
        var query = $(this).val().trim()
        if (!query) {
            Channel.UI.command( Events.COMMAND_CLEAR_SEARCH_ITEMS, {unselected: true} )
            return false
        }
        Channel.Zotero.command(Events.COMMAND_SEARCH, query)
    }

    function _displayErrorDialog() {
        Dialogs.showModalDialog(
            DefaultDialogs.DIALOG_ID_ERROR,
            'Unable to Search Zotero Library!',
            'Make sure either <strong>Firefox</strong> or <strong>Zotero standalone</strong> is running ' +
            'with <strong>Better Bib(La)TeX</strong> extension installed and configured.' +
            '<br><br>' +
            'See <strong>Install & Use</strong> section on <a href="http://baig.github.io/brackets-zotero/">this</a> page ' +
            'for more detailed setup instructions.'
        )
    }

    function _clearAll() {
        _clearSearchField()
        Channel.UI.command( Events.COMMAND_CLEAR_SEARCH_ITEMS )
    }

    function _clearSearchField () {
        $(C.UI_SEARCH_INPUT).val("")
    }

    function _isVisible() {
        return this.visible
    }

    function _init() {
//        console.log("initializing Panel...")

        var renderedTemplate = $( Mustache.render( PanelTemplate, {S: S, icon: icon} ) )
        this.panel = WorkspaceManager.createBottomPanel("zoteroplugin.library.search", renderedTemplate, 300)

        var $panel = this.panel.$panel

        $panel
            .on('click', C.CLOSE_BTN,           function () { CommandManager.execute(C.CMD_ID_HIDE_PANEL) })
            .on('click', C.CLEAR_BTN,           function () { CommandManager.execute(C.CMD_ID_CLEAR_ALL) })
            .on('keyup', C.UI_SEARCH_INPUT,     _handleSearchOnKeyUp)
            .on('click', C.INSERT_BTN,          function () { CommandManager.execute(C.CMD_ID_INSERT_CITE) })
            .on('click', C.INSERT_BIBLIO_BTN,   function () { CommandManager.execute(C.CMD_ID_INSERT_BIBLIO) })
            .on('click', C.GENERATE_BIBLIO_BTN, function () { CommandManager.execute(C.CMD_ID_GENERATE_BIBLIO) })
            .on('click', C.SETTINGS_BTN,        function () { CommandManager.execute(C.CMD_ID_SHOW_SETTINGS) })

        Channel.UI.comply(Events.COMMAND_DISPLAY_ERROR, _displayErrorDialog)
        Channel.UI.reply(Events.REQUEST_PANEL_VISIBILITY_STATUS, _.bind(_isVisible, this))
        Channel.Extension.comply(C.CMD_ID_TOGGLE_PANEL, _.bind(_toggleZoteroPanel, this))
        Channel.Extension.comply(C.CMD_ID_HIDE_PANEL, _.bind(_toggleZoteroPanel, this, false))
        Channel.Extension.comply(C.CMD_ID_CLEAR_ALL, _clearAll);

        Channel.UI.command( Events.COMMAND_SEARCH_PANELVIEW_INIT,   $panel )
        Channel.UI.command( Events.COMMAND_CITE_PANELVIEW_INIT,     $panel )

//        console.log("initializing Panel...COMPLETE")
    }

    function Panel() {
        this.visible = false
        this.panel = null
        Channel.Extension.on(Events.EVENT_INIT, _.bind(_init, this))
    }

    module.exports = new Panel()

});
