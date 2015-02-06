define(function (require, exports, module) {
    'use strict'

    module.exports = {
        // Brackets events
        EVENT_EDITOR_CHANGE: 'brackets:active:editor:change',
        COMMAND_SEARCH: 'zotero:search',
        EVENT_ITEM_SELECT: 'panel:item:select',
        EVENT_LIST_CLEAR: 'panel:list:clear',
        EVENT_PANEL_VISIBLE: 'panel:shown',
        EVENT_PANEL_HIDDEN: 'panel:hidden',

        // Zotero.js
        EVENT_INIT: 'zotero:init',
        COMMAND_DISPLAY_RESULTS: 'panel:display:results',
        COMMAND_INSERT_CITATIONS: 'document:insert:citation',
        COMMAND_INSERT_BIBLIOGRAPHY: 'document:insert:bibliography',

        // Document.js
        EVENT_NEW_CITEKEYS_AVAILABLE: 'document:new:citekeys:available',
        REQUEST_CITE_STRING: 'zotero:citestring',
        REQUEST_BIBLIOGRAPHY: 'zotero:bibliography',
        REQUEST_PANEL_VISIBILITY_STATUS: 'panel:visibility:status',

        // Bibliography.js
        REQUEST_CITEKEYS: 'zotero:citekeys',
    }
})