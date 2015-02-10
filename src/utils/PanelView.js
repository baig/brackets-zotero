/*
 * @fileoverview    Creates and manages Panel Views inside the Panel.
 *                  Panel View can exist only inside a Panel. It has
 *                  a Header div and a Content div and. Only one
 *                  Content div is active (visible) at a time, the
 *                  rest are hidden. A Content div can be activated
 *                  by clicking the corresponsding pinned button housed
 *                  in the Header div.
 * @author          Wasif Hasan Baig <pr.wasif@gmail.com>
 * @copyright       Wasif Hasan Baig 2015
 * @version         0.0.1
 * @license         MIT
 */
define(function (require, exports, module) {
    'use strict';

    var AppInit = brackets.getModule("utils/AppInit");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils")
    var _ = brackets.getModule("thirdparty/lodash");

    var $panelView;
    var activePanel = '';
    var panelViews = [];

    /**
     * Enum for side of the Panel View
     * @readonly
     * @enum {string}
     */
    var SIDE = {
        /** @type {string} */
        LEFT: 'viewpanel.side.left',
        /** @type {string} */
        RIGHT: 'viewpanel.side.right',
        /** Not supported as yet
         * TOP:    'viewpanel.side.top',
         * BOTTOM: 'viewpanel.side.bottom',
         */
    };

    /**
     * Creates a new Panel View
     * @class PanelView Panel View
     * @private
     * @param {jQueryObject} $panelView jQuery object representing the panel view
     * @param {String}       id         Unique id for the panel in package-style naming
     */
    function PanelView($panelView, id) {
        $panelView = $panelView;
        this.$panelView = $panelView;
        this.id = id;
    }

     /**
     * @property {jQueryObject} Dom node holding the rendered panelView
     */
    PanelView.prototype.$panelView = null;

    /**
     * @function Returns true if this panelView instance is active at the moment.
     * @returns {Boolean} the visibility/active status of this panelView instance
     */
    PanelView.prototype.isActive = function () {
        return this.id == activePanel;
    }

    /**
     * Creates a PanelView inside an existing panel.
     * @param   {String}       id        Unique package-style id but dasherized, e.g. "myextension-feature-panelname"
     * @param   {jQueryObject} $panel    Existing panel to attach ViewPanel to. Must be provided.
     * @param   {Object}       opts      The options object
     * @param   {String}       opts.icon An icon name of the font icon e.g. "octicon octicon-eye"
     * @param   {SIDE}         opts      Any value from SIDE enum. Default is SIDE.LEFT
     * @param   {Number}       opts      Width of the Header in pixels. Default is 30
     * @returns {jQueryObject} The created ViewPanel or null.
     */
    function createPanelView(id, $panel, opts) {
        // `panelview.less` is required by this file
        ExtensionUtils.loadStyleSheet(module, '../../styles/panelview.less');

        if (_.contains(panelViews, id)) {
            console.error('PanelView with id "' + id + '" already exists')
            return false
        } else {
            panelViews.push(id)
        }

        if (!opts) opts = {}

        var icon = opts.icon || 'octicon octicon-eye'
        var side = opts.side || SIDE.LEFT
        var width = opts.width || 30

        var flexRowDirection = (side == SIDE.LEFT) ? 'row' : 'row-reverse';

        $panelView = $panel.find('.panel-view')

        if ($panelView.length == 0) {
            // No viewpanel exists in this panel. Creating a new one.
            $panel.append('<div class="panel-view" style="flex-direction: ' + flexRowDirection + '">' +
                '<div class="panel-view-header toolbar" style="min-width: ' + width + 'px; max-width: ' + width + 'px; "></div>' +
                '<div class="panel-view-content"></div>' +
                '</div>')
        }

        $panelView = $panel.find('.panel-view')

        if (!activePanel) {
            $panelView.find('.panel-view-header')
                .append('<a class="btn panel-view-btn-active ' + icon + '" data-panel-view-id="' + id + '" title="Search Panel View (displaying search results)"></a>')
                .off('click').on('click', 'a', handleButtonClick)

            $panelView.find('.panel-view-content')
                .append('<div id="' + id.replace(/\./g, '-') + '" class="table-container resizable-content"></div>')
            activePanel = id;
        } else {
            $panelView.find('.panel-view-header')
                .append('<a class="btn ' + icon + '" data-panel-view-id="' + id + '" title="Citation Panel View (displaying citations in the document)"></a>')
                .off('click').on('click', 'a', handleButtonClick)

            $panelView.find('.panel-view-content')
                .append('<div id="' + id.replace(/\./g, '-') + '" class="hide table-container resizable-content"></div>')
        }

        return new PanelView($panelView, id)
    }

    function handleButtonClick(e) {
        var $button = $(e.target)
        if ($button.hasClass('.panel-view-btn-active')) return false
        var panelId = $button.attr('data-panel-view-id')
        _setActivePanel(panelId)
    }

    function _setActivePanel(panelId) {
        if (activePanel == panelId) return

        var panelViewId = panelId.replace(/\./g, '-')

        $panelView
            .find('.panel-view-btn-active')
            .removeClass('panel-view-btn-active')

        $panelView
            .find('a[data-panel-view-id="' + panelId + '"]')
            .addClass('panel-view-btn-active')

        $panelView
            .find('#' + panelViewId)
            .removeClass('hide')

        $panelView
            .find('.panel-view-content')
                .children()
                .not('#' + panelViewId)
                .addClass('hide')

        activePanel = panelId
    }

    function _getActivePanel() {
        return activePanel
    }

    // Exposing public API
    module.exports = {
        SIDE: SIDE,
        setActivePanel: _setActivePanel,
        getActivePanel: _getActivePanel,
        createPanelView: createPanelView,
    }
});