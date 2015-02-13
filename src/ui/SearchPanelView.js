define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")
    var PanelView = require("src/utils/PanelView")
    var UiUtils = require("src/ui/UiUtils")

    // HTML Templates
    var SearchResultListTemplate = require("text!../../htmlContent/zotero-search-results.html");

    function _displaySearchResults(searchResults) {
        // clearing previous result list
        _clearItems();
        UiUtils.append( 'div#' + C.PANEL_VIEW_SEARCH, SearchResultListTemplate, searchResults )
        PanelView.setActivePanel(C.PANEL_VIEW_SEARCH)
    }

    function _handleListItemClick(e) {
        var $elem = $(e.target)
        if ($elem.is("input")) {
            var bibtexKey = $(e.target).attr("id")
            var checked = $(e.target).is(":checked")

            Channel.Extension.trigger(Events.EVENT_ITEM_SELECTED, bibtexKey, checked)
        }
    }

    function _clearItems(options) {
        UiUtils.clearView( 'div#'+C.PANEL_VIEW_SEARCH, options )
    }

    function _handleListItemClick(e) {
        var $elem = $(e.target)
        if ($elem.is("input")) {
            var bibtexKey = $(e.target).attr("id")
            var checked = $(e.target).is(":checked")
            // captured in Zotero.js
            Channel.Extension.trigger(Events.EVENT_ITEM_SELECTED, bibtexKey, checked)
        }
    }

    function _init($panel) {
        var panelView = PanelView.createPanelView   ( C.PANEL_VIEW_SEARCH, $panel, {icon: 'octicon octicon-search'} )
        this.$panelView = panelView.$panelView

        this.$panelView.on( 'click', _handleListItemClick )

        Channel.UI.comply           ( Events.COMMAND_DISPLAY_RESULTS,       _displaySearchResults )
        Channel.UI.comply           ( Events.COMMAND_CLEAR_SEARCH_ITEMS,    _clearItems           )
    }

    function SearchPanelView() {
        this.active = false
        this.$panelView = null
        Channel.UI.comply( Events.COMMAND_SEARCH_PANELVIEW_INIT, _.bind(_init, this) )
    }

    module.exports = new SearchPanelView()

});
