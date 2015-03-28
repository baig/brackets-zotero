/*jslint vars: true, nomen: true */
/*global define, brackets, $*/
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var _         = brackets.getModule("thirdparty/lodash");

    // Local modules
    var PanelView = require("src/utils/PanelView"),
        UiUtils   = require("src/ui/UiUtils"),
        Channel   = require("src/utils/Channel"),
        Events    = require("src/utils/Events"),
        C         = require("src/utils/Constants");

    // Templates and resources
    var SearchResultListTemplate = require("text!../../htmlContent/zotero-search-results.html");

    function clearItems(options) {
        UiUtils.clearView("div#" + C.PANEL_VIEW_SEARCH, options);
    }

    function displaySearchResults(searchResults) {
        // clearing previous result list
        clearItems();
        UiUtils.append("div#" + C.PANEL_VIEW_SEARCH, SearchResultListTemplate, searchResults);
        PanelView.setActivePanel(C.PANEL_VIEW_SEARCH);
    }

    function handleListItemClick(e) {
        var $elem = $(e.target),
            bibtexKey,
            checked;

        if ($elem.is("input")) {
            bibtexKey = $(e.target).attr("id");
            checked = $(e.target).is(":checked");

            Channel.Extension.trigger(Events.EVT_ITEM_SELECTED, bibtexKey, checked);
        }
    }

    function init($panel) {
        /*jshint validthis: true */
        var panelOptions = {icon: "octicon octicon-search"};
        this.panelView = PanelView.createPanelView(C.PANEL_VIEW_SEARCH, $panel, panelOptions);
        this.panelView.$panelView.on("click", _.bind(handleListItemClick, this));

        Channel.UI.comply(Events.CMD_DISPLAY_RESULTS,       displaySearchResults);
        Channel.UI.comply(Events.CMD_CLEAR_SEARCH_ITEMS,    clearItems);
    }

    function SearchPanelView() {
        this.active = false;
        this.panelView = null;
        Channel.UI.comply(Events.CMD_SEARCH_PANELVIEW_INIT, _.bind(init, this));
    }

    module.exports = new SearchPanelView();

});
