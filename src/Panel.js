define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var CommandManager = brackets.getModule("command/CommandManager")
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils")
    var WorkspaceManager = brackets.getModule("view/WorkspaceManager")
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var S = require("strings")
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")

    // HTML Templates
    var SearchModelBarTemplate = require("text!../htmlContent/zotero-panel.html");
    var SearchResultListTemplate = require("text!../htmlContent/zotero-search-results.html");

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
        Channel.Zotero.command("search", query)
    }

    function _displaySearchResults(searchResults) {
        // clearing previous result list
        _clearItems();
        // appending the result list
        _append(C.SEARCH_RESULTS, SearchResultListTemplate, searchResults)
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
            $(C.SEARCH_RESULTS).children().find("tr:not(.selected)").remove()
        } else {
            // Remove all items from view
            $(C.SEARCH_RESULTS).children().remove()

            Channel.Extension.trigger('panel:list:cleared')
        }
    }

    function _isVisible() {
        return this.visible
    }

    function _init() {
//        console.log("initializing Panel...")

        ExtensionUtils.loadStyleSheet(module, C.CSS_ZOTERO);

        var renderedTemplate = $( Mustache.render( SearchModelBarTemplate, {S: S} ) )
        this.panel = WorkspaceManager.createBottomPanel("zoteroplugin.library.search", renderedTemplate, 300)

        // Displaying icon in the Project Panel and attach `click` handler
        $icon = $("<a id='zotero-toolbar-icon' href='#'></a>").appendTo($("#main-toolbar .buttons"));
        $icon.on("click", function () { CommandManager.execute(C.CMD_ID_TOGGLE_PANEL) })

        var $panel = this.panel.$panel

        $panel
            .on('click', C.CLOSE_BTN,           function () { CommandManager.execute(C.CMD_ID_HIDE_PANEL) })
            .on('click', C.CLEAR_BTN,           function () { CommandManager.execute(C.CMD_ID_CLEAR_ALL) })
            .on('keyup', C.UI_SEARCH_INPUT,     _handleSearchOnKeyUp)
            .on('click', C.SEARCH_RESULTS,      _handleListItemClick)
            .on('click', C.INSERT_BTN,          function () { CommandManager.execute(C.CMD_ID_INSERT_CITE) })
            .on('click', C.INSERT_BIBLIO_BTN,   function () { CommandManager.execute(C.CMD_ID_INSERT_BIBLIO) })
            .on('click', C.GENERATE_BIBLIO_BTN, function () { CommandManager.execute(C.CMD_ID_GENERATE_BIBLIO) })

        Channel.UI.comply('display', _displaySearchResults)
        Channel.UI.reply(Events.REQUEST_PANEL_VISIBILITY_STATUS, _.bind(_isVisible, this))
        Channel.Extension.comply(C.CMD_ID_TOGGLE_PANEL, _.bind(_toggleZoteroPanel, this))
        Channel.Extension.comply(C.CMD_ID_HIDE_PANEL, _.bind(_toggleZoteroPanel, this, false))
        Channel.Extension.comply(C.CMD_ID_CLEAR_ALL, _clearAll);

//        console.log("initializing Panel...COMPLETE")
    }

    function Panel() {
        this.visible = false
        this.panel = null
        Channel.Extension.on(Events.EVENT_INIT, _.bind(_init, this))
    }

    module.exports = new Panel()

});