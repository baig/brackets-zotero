define(function (require, exports, module) {
    'use strict'

    module.exports = {
        QUERY_URL: 'http://localhost:23119/better-bibtex/schomd',

        // Selector Strings
        UI_SEARCH_INPUT: "input#zotero-search-query",
        INSERT_BTN: "button#zotero-insert-btn",
        CLEAR_BTN: "button#zotero-clear-btn",
        CLOSE_BTN: ".close",
        SETTINGS_BTN: "i#zotero-settings-btn",
        INSERT_BIBLIO_BTN: "button#zotero-insert-biblio-btn",
        GENERATE_BIBLIO_BTN: "button#zotero-generate-biblio-file-btn",

        REGEXP_MATCH_BRACKETS: /\[.*@[A-Za-z_].*\]/g,
        REGEXP_CITE_KEYS: /@[A-Za-z_]{1,1}[A-Za-z0-9_:.#$%&\-+?<>~/]+/g,

        //Commands and Menu
        CMD_ID_SHOW_PANEL: "baig.zoteroplugin.panel.show",
        CMD_ID_HIDE_PANEL: "baig.zoteroplugin.panel.hide",
        CMD_ID_TOGGLE_PANEL: "baig.zoteroplugin.panel.toggle",
        CMD_ID_CLEAR_ALL: "baig.zoteroplugin.clear.all",
        CMD_ID_SHOW_SETTINGS: "baig.zoteroplugin.settings.show",
        CMD_ID_INSERT_CITE: "baig.zoteroplugin.citation.insert",
        CMD_ID_INSERT_BIBLIO: "baig.zoteroplugin.bibliography.insert",
        CMD_ID_GENERATE_BIBLIO: "baig.zoteroplugin.bibliography.generate",
        CMD_ID_REFRESH_BIBLIO: "baig.zoteroplugin.bibliography.refresh",

        PANEL_VIEW_SEARCH: "baig-zoteroplugin-panelview-search",
        PANEL_VIEW_CITATION: "baig-zoteroplugin-panelview-citation",

        KBD_TOGGLE_PANEL: "Ctrl-Shift-Z",

        CSS_ZOTERO: '../styles/zotero.css',
    }

});
