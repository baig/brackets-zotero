/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    module.exports = {

        QUERY_URL        : "http://localhost:23119/better-bibtex/schomd",

        // Selector Strings
        GENERATE_BIB_BTN : "button#zotero-generate-biblio-file-btn",
        UI_SEARCH_INPUT  : "input#zotero-search-query",
        INSERT_BIB_BTN   : "button#zotero-insert-biblio-btn",
        SETTINGS_BTN     : "i#zotero-settings-btn",
        INSERT_BTN       : "button#zotero-insert-btn",
        CLEAR_BTN        : "button#zotero-clear-btn",
        CLOSE_BTN        : ".close",

        REGEXP_MATCH_BRACKETS : /\[.*@[A-Za-z_].*\]/g,
        REGEXP_CITE_KEYS      : /@[A-Za-z_]{1,1}[A-Za-z0-9_:.#$%&\-+?<>~\/]+/g,

        PANEL_VIEW_CITATION   : "baig-zoteroplugin-panelview-citation",
        PANEL_VIEW_SEARCH     : "baig-zoteroplugin-panelview-search",
        PANEL_BOTTOM          : "baig.zoteroplugin.library.search",

        KBD_TOGGLE_PANEL      : (brackets.platform === "mac") ? "Alt-Z" : "Ctrl-Shift-Z",

        CSS_ZOTERO : "../styles/zotero.css"

    };

});
