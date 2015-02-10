define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var CommandManager = brackets.getModule("command/CommandManager")
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils")
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager")
    var DefaultDialogs = brackets.getModule("widgets/DefaultDialogs")
    var Dialogs = brackets.getModule("widgets/Dialogs")
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var S = require("strings")
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")
    var PanelView = require("src/utils/PanelView")
    require("src/thirdparty/Notify")

    // HTML Templates
    var SearchModelBarTemplate = require("text!../htmlContent/zotero-panel.html");
    var SearchResultListTemplate = require("text!../htmlContent/zotero-search-results.html");
    var ExistingCitationsTemplate = require("text!../htmlContent/zotero-existing-citations.html");

    // Resources
    var icon = require.toUrl("styles/icons/zotero.png")

    var $icon;


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
        // Show panel
        Panel.panel.show()
        // focus on query field on panel show
        $(C.UI_SEARCH_INPUT).focus()
        // Add `active` class to zotero icon
        $icon.addClass('active')
        // Toogle visibility flag
        Panel.visible = !Panel.visible
        // Triggering event that the panel is visible
        Channel.Extension.trigger(C.MSG_PANEL_SHOWN)
    }

    function _hide(Panel) {
        // hide panel
        Panel.panel.hide()
            // clear query field
        _clearSearchField()
            // clear result list
        _clearItems();
        // Remove `active` class to zotero icon
        $icon.removeClass('active')

        // DNBH
        // EditorManager.off("activeEditorChange")

        // Toogle visibility flag
        Panel.visible = !Panel.visible

        Channel.Extension.trigger(C.MSG_PANEL_HIDDEN)
    }

    function _handleSearchOnKeyUp() {
        var query = $(this).val().trim()
        if (!query) {
            _clearItems( {unselected: true} )
            return false
        }
        PanelView.setActivePanel(C.PANEL_VIEW_SEARCH)
        Channel.Zotero.command("search", query)
    }

    function _displaySearchResults(searchResults) {
        // clearing previous result list
        _clearItems();
        _append('div#' + C.PANEL_VIEW_SEARCH, SearchResultListTemplate, searchResults)
        PanelView.setActivePanel(C.PANEL_VIEW_SEARCH)
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

    function _handleExistingCitesDisplay(existingCites) {
        // clearing existing citations
        $('div#' + C.PANEL_VIEW_CITATION).children().remove()
        _append('div#' + C.PANEL_VIEW_CITATION, ExistingCitationsTemplate, existingCites)
        PanelView.setActivePanel(C.PANEL_VIEW_CITATION)
        notify('Citations found in this document!', "grey", true)
    }

    function _clearAll() {
        _clearSearchField()
        _clearItems()
    }

    function _handleListItemClick(e) {
        var $elem = $(e.target)
        if ($elem.is("input")) {
            var bibtexKey = $(e.target).attr("id")
            var checked = $(e.target).is(":checked")

            Channel.Extension.trigger("panel:item:selected", bibtexKey, checked)
        }
    }

    function _append(selectorString, template, data) {
        if (data) $(selectorString).append(Mustache.render(template, data))
        else $(selectorString).append(Mustache.render(template))
    }

    function _clearSearchField() {
        $(C.UI_SEARCH_INPUT).val("")
    }

    function _clearItems(options) {
        var removeUnselectedOnly = (options) ? options.unselected : false

        if (removeUnselectedOnly) {
            // Remove only unselected items from view
            $('div#' + C.PANEL_VIEW_SEARCH).children().find("tr:not(.selected)").remove()
        } else {
            // Remove all items from view
            $('div#' + C.PANEL_VIEW_SEARCH).children().remove()

            Channel.Extension.trigger('panel:list:cleared')
        }
    }

    function _isVisible() {
        return this.visible
    }

    function _init() {
//        console.log("initializing Panel...")

        ExtensionUtils.loadStyleSheet(module, C.CSS_ZOTERO);

        var renderedTemplate = $( Mustache.render( SearchModelBarTemplate, {S: S, icon: icon} ) )
        this.panel = WorkspaceManager.createBottomPanel("zoteroplugin.library.search", renderedTemplate, 300)

        // Displaying icon in the Project Panel and attach `click` handler
        $icon = $('<a id="zotero-toolbar-icon" href="#" title="' + S.UI_TOOLTIP + '"></a>')
                .appendTo($("#main-toolbar .buttons"))
                .on("click", function () { CommandManager.execute(C.CMD_ID_TOGGLE_PANEL) })

        var $panel = this.panel.$panel

        $panel
            .on('click', C.CLOSE_BTN,           function () { CommandManager.execute(C.CMD_ID_HIDE_PANEL) })
            .on('click', C.CLEAR_BTN,           function () { CommandManager.execute(C.CMD_ID_CLEAR_ALL) })
            .on('keyup', C.UI_SEARCH_INPUT,     _handleSearchOnKeyUp)
            .on('click', 'div#' + C.PANEL_VIEW_SEARCH,      _handleListItemClick)
            .on('click', C.INSERT_BTN,          function () { CommandManager.execute(C.CMD_ID_INSERT_CITE) })
            .on('click', C.INSERT_BIBLIO_BTN,   function () { CommandManager.execute(C.CMD_ID_INSERT_BIBLIO) })
            .on('click', C.GENERATE_BIBLIO_BTN, function () { CommandManager.execute(C.CMD_ID_GENERATE_BIBLIO) })

        Channel.UI.comply('display:results', _displaySearchResults)
        Channel.UI.comply('display:error', _displayErrorDialog)
        Channel.UI.comply('display:existing:cites', _handleExistingCitesDisplay)
        Channel.UI.reply(Events.REQUEST_PANEL_VISIBILITY_STATUS, _.bind(_isVisible, this))
        Channel.Extension.comply(C.CMD_ID_TOGGLE_PANEL, _.bind(_toggleZoteroPanel, this))
        Channel.Extension.comply(C.CMD_ID_HIDE_PANEL, _.bind(_toggleZoteroPanel, this, false))
        Channel.Extension.comply(C.CMD_ID_CLEAR_ALL, _clearAll);

        PanelView.createPanelView( C.PANEL_VIEW_SEARCH, $panel, {icon: 'octicon octicon-search'} )
        PanelView.createPanelView( C.PANEL_VIEW_CITATION, $panel, {icon: 'octicon octicon-mention'} )
        
//        console.log("initializing Panel...COMPLETE")
    }

    function Panel() {
        this.visible = false
        this.panel = null
        Channel.Extension.on(Events.EVENT_INIT, _.bind(_init, this))
    }

    module.exports = new Panel()

});