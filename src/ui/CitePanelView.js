/*jslint vars: true, nomen: true */
/*global define, $, notify */
define(function (require, exports, module) {
    "use strict";

    // Local modules
    var PanelView = require("src/utils/PanelView"),
        UiUtils   = require("src/ui/UiUtils"),
        Channel   = require("src/utils/Channel"),
        Events    = require("src/utils/Events"),
        C         = require("src/utils/Constants");

    // Templates and resources
    var ExistingCitesTemplate = require("text!../../htmlContent/zotero-existing-citations.html");

    function _handleExistingCitesDisplay(existingCites) {
        // clearing existing citations
        $("div#" + C.PANEL_VIEW_CITATION).children().remove();
        UiUtils.append("div#" + C.PANEL_VIEW_CITATION, ExistingCitesTemplate, existingCites);
        PanelView.setActivePanel(C.PANEL_VIEW_CITATION);
    }

    function _handleListItemClick(e) {
        var $target = $(e.target);
        if ($target.is("td")) {
            $target = $target.children();
        }
        Channel.Document.command(Events.CMD_HIGHLIGHT_CITES, $target.data("key"));
    }

    function _init($panel) {
        /*jshint validthis: true */
        var panelOptions = {icon: "octicon octicon-mention"};
        this.panelView = PanelView.createPanelView(C.PANEL_VIEW_CITATION, $panel, panelOptions);

        this.panelView.$panelView.on("click", "tbody", _handleListItemClick);

        Channel.UI.comply(Events.CMD_DISPLAY_CITES,    _handleExistingCitesDisplay);
    }

    function CitePanelView() {
        this.active = false;
        this.panelView = null;
        Channel.UI.comply(Events.CMD_CITE_PANELVIEW_INIT, _init, this);
    }

    module.exports = new CitePanelView();
});
