/*jslint vars: true, nomen: true */
/*global define, $*/
define(function (require, exports, module) {
    "use strict";

    // Local modules
    var PanelView = require("src/utils/PanelView"),
        UiUtils   = require("src/ui/UiUtils"),
        Channel   = require("src/utils/Channel"),
        Events    = require("src/utils/Events"),
        C         = require("src/utils/Constants");

    // Templates and resources
    var SearchResultListTemplate = require("text!../../htmlContent/zotero-search-results.html");

    function _clearItems(options) {
        UiUtils.clearView("div#" + C.PANEL_VIEW_SEARCH, options);
    }

    function _displaySearchResults(searchResults) {
        // clearing previous result list
        _clearItems();
        UiUtils.append("div#" + C.PANEL_VIEW_SEARCH, SearchResultListTemplate, searchResults);
        PanelView.setActivePanel(C.PANEL_VIEW_SEARCH);
    }

    function _handleListItemClick(e) {
        var $target = $(e.target);

        if ($target.is("input")) {
            var bibtexKey = $target.attr("id");
            var checked   = $target.is(":checked");

            Channel.Extension.trigger(Events.EVT_ITEM_SELECTED, bibtexKey, checked);
        }
    }

    function _init($panel) {
        /*jshint validthis: true */
        var panelOptions = {icon: "octicon octicon-search"};
        this.panelView = PanelView.createPanelView(C.PANEL_VIEW_SEARCH, $panel, panelOptions);

        this.panelView.$panelView.on("click", "tbody",   _handleListItemClick);

        Channel.UI.comply(Events.CMD_DISPLAY_RESULTS,    _displaySearchResults);
        Channel.UI.comply(Events.CMD_CLEAR_SEARCH_ITEMS, _clearItems);
    }

    function SearchPanelView() {
        this.active = false;
        this.panelView = null;
        Channel.UI.comply(Events.CMD_SEARCH_PANELVIEW_INIT, _init, this);
    }

    module.exports = new SearchPanelView();

});
