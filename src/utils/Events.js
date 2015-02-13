define(function (require, exports, module) {
    'use strict'

    module.exports = {
        // Brackets events
        EVENT_EDITOR_CHANGE: 'brackets:active:editor:change',
        EVENT_LIST_CLEAR: 'panel:list:clear',

        // Zotero.js
        EVENT_INIT: 'zotero:init',
        COMMAND_DISPLAY_RESULTS: 'searchpanelview:display:results',
        COMMAND_DISPLAY_ERROR: 'panel:display:error',
        COMMAND_DISPLAY_CITES: 'citepanelview:display:cites',
        COMMAND_INSERT_CITATIONS: 'document:insert:citation',
        COMMAND_INSERT_BIBLIOGRAPHY: 'document:insert:bibliography',

        // Document.js
        EVENT_CITEKEYS_FOUND: 'document:citekeys:found',
        REQUEST_CITE_STRING: 'zotero:citestring',
        REQUEST_BIBLIOGRAPHY: 'zotero:bibliography',
        REQUEST_PANEL_VISIBILITY_STATUS: 'panel:visibility:status',

        // Bibliography.js
        REQUEST_CITEKEYS: 'zotero:citekeys',

        // Panel.js
        EVENT_PANEL_SHOWN: 'panel:shown',
        EVENT_PANEL_HIDDEN: 'panel:hidden',
        COMMAND_SEARCH: 'zotero:search',
        COMMAND_TOGGLE_ICON_STATE: 'main:toggle:icon:state',
        COMMAND_SEARCH_PANELVIEW_INIT: 'searchpanelview:init',
        COMMAND_CITE_PANELVIEW_INIT: 'citepanelview:init',
        COMMAND_CLEAR_SEARCH_ITEMS: 'searchpanelview:clear:items',

        // SearchPanelView.js
        EVENT_PANELVIEW_CLEARED: 'panelview:list:cleared',
        EVENT_ITEM_SELECTED: 'searchpanelview:item:selected',

    }
})
