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

    function _handleListItemClick(e) {
        var $target = $(e.target)
        if ($target.is('td')) {
            $target = $target.children()
        }
        Channel.Document.command( Events.COMMAND_HIGHLIGHT_CITES, $target.data('key') )
    }

    function _init($panel) {
        this.panelView = PanelView.createPanelView( C.PANEL_VIEW_CITATION, $panel, {icon: 'octicon octicon-mention'} )
        this.panelView.$panelView.on( 'click', _.bind(_handleListItemClick, this) )
        Channel.UI.comply(Events.COMMAND_DISPLAY_CITES, _handleExistingCitesDisplay)
    }

    function CitePanelView() {
        this.active = false
        this.panelView = null
        Channel.UI.comply( Events.COMMAND_CITE_PANELVIEW_INIT, _.bind(_init, this) )
    }

    module.exports = new CitePanelView()
});
