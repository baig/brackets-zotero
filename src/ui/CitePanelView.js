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
    require("src/thirdparty/Notify")

    // Templates
    var ExistingCitationsTemplate = require("text!../../htmlContent/zotero-existing-citations.html");

    function _handleExistingCitesDisplay(existingCites) {
        // clearing existing citations
        $('div#' + C.PANEL_VIEW_CITATION).children().remove()
        UiUtils.append( 'div#' + C.PANEL_VIEW_CITATION, ExistingCitationsTemplate, existingCites )
        PanelView.setActivePanel(C.PANEL_VIEW_CITATION)
        notify('Citations found in this document!', "grey", true)
    }

    function _init($panel) {
        Channel.UI.comply(Events.COMMAND_DISPLAY_CITES, _handleExistingCitesDisplay)
        PanelView.createPanelView( C.PANEL_VIEW_CITATION, $panel, {icon: 'octicon octicon-mention'} )
    }

    function CitePanelView() {
        this.active = false
        Channel.UI.comply( Events.COMMAND_CITE_PANELVIEW_INIT, _.bind(_init, this) )
    }

    module.exports = new CitePanelView()
});
