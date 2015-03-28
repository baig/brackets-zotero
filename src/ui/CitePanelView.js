/*jslint vars: true, nomen: true */
/*global define, brackets, $, notify */
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
    var ExistingCitesTemplate = require("text!../../htmlContent/zotero-existing-citations.html");

    // Local requires
    require("src/thirdparty/Notify");

    function handleExistingCitesDisplay(existingCites) {
        // clearing existing citations
        $("div#" + C.PANEL_VIEW_CITATION).children().remove();
        UiUtils.append("div#" + C.PANEL_VIEW_CITATION, ExistingCitesTemplate, existingCites);
        PanelView.setActivePanel(C.PANEL_VIEW_CITATION);
        notify("Citations found in this document!", "grey", true);
    }

    function handleListItemClick(e) {
        var $target = $(e.target);
        if ($target.is("td")) {
            $target = $target.children();
        }
        Channel.Document.command(Events.CMD_HIGHLIGHT_CITES, $target.data("key"));
    }

    function init($panel) {
        /*jshint validthis: true */
        var panelOptions = {icon: "octicon octicon-mention"};
        this.panelView = PanelView.createPanelView(C.PANEL_VIEW_CITATION, $panel, panelOptions);
        this.panelView.$panelView.on("click", _.bind(handleListItemClick, this));
        Channel.UI.comply(Events.CMD_DISPLAY_CITES, handleExistingCitesDisplay);
    }

    function CitePanelView() {
        this.active = false;
        this.panelView = null;
        Channel.UI.comply(Events.CMD_CITE_PANELVIEW_INIT, _.bind(init, this));
    }

    module.exports = new CitePanelView();
});
