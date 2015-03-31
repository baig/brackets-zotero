/*global define */

/**
 * Central catalogue of all the events raised and consumed
 * in this extension, categorized by file names.
 *
 * The messaging patterns used in this extension are heavily inspired by Backbone.Radio.
 * To get a better understanding of the intent behind these event types, it is highly
 * recommended that you go through the README at
 * {@link https://github.com/marionettejs/backbone.radio|Backbone.Radio}.
 *
 * EVT = Event
 * CMD = Command
 * RQT = Request
 */

define(function (require, exports, module) {
    "use strict";

    module.exports = {
        // Brackets events
        EVT_EDITOR_CHANGE : "brackets:active:editor:change",
        EVT_LIST_CLEAR    : "panel:list:clear",

        // Zotero.js
        CMD_INSERT_BIBLIOGRAPHY : "document:insert:bibliography",
        CMD_INSERT_CITATIONS    : "document:insert:citation",
        CMD_DISPLAY_RESULTS     : "searchpanelview:display:results",
        CMD_DISPLAY_CITES       : "citepanelview:display:cites",
        CMD_DISPLAY_ERROR       : "panel:display:error",
        EVT_INIT                : "zotero:init",

        // Document.js
        RQT_PANEL_VISIBILITY_STATUS : "panel:visibility:status",
        EVT_CITEKEYS_FOUND          : "document:citekeys:found",
        CMD_INSERT_BIBLIO           : "baig.zoteroplugin.bibliography.insert",
        RQT_BIBLIOGRAPHY            : "zotero:bibliography",
        CMD_INSERT_CITE             : "baig.zoteroplugin.citation.insert",
        RQT_CITE_STRING             : "zotero:citestring",

        // Bibliography.js
        CMD_GENERATE_BIBLIO  : "baig.zoteroplugin.bibliography.generate",
        RQT_CITEKEYS         : "zotero:citekeys",

        // Panel.js
        CMD_SEARCH_PANELVIEW_INIT : "searchpanelview:init",
        CMD_CITE_PANELVIEW_INIT   : "citepanelview:init",
        CMD_CLEAR_SEARCH_ITEMS    : "searchpanelview:clear:items",
        CMD_TOGGLE_ICON_STATE     : "main:toggle:icon:state",
        CMD_TOGGLE_PANEL          : "baig.zoteroplugin.panel.toggle",
        CMD_HIDE_PANEL            : "baig.zoteroplugin.panel.hide",
        CMD_CLEAR_ALL             : "baig.zoteroplugin.clear.all",
        EVT_PANEL_HIDDEN          : "panel:hidden",
        EVT_PANEL_SHOWN           : "panel:shown",
        CMD_SEARCH                : "zotero:search",

        // SearchPanelView.js
        EVT_PANELVIEW_CLEARED : "panelview:list:cleared",
        EVT_ITEM_SELECTED     : "searchpanelview:item:selected",

        // CitePanelView.js
        CMD_HIGHLIGHT_CITES : "document:highlight:cites",

        // SettingsDialog.js
        CMD_SHOW_SETTINGS   : "baig.zoteroplugin.settings.show"

    };
});
