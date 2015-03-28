/*jslint vars: true, nomen: true, plusplus: true */
/*global define, brackets, $ */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        CommandManager    = brackets.getModule("command/CommandManager");

    // Local modules
    var Channel           = require("src/utils/Channel"),
        C                 = require("src/utils/Constants"),
        S                 = require("strings");

    /**
     * All Commands registered are given this callback which channels the CMD_ID
     * to the Extension-wide Radio Channel. Any Object responsible for complying
     * to the command must listen to the desired CMD_ID on the Extension-wide
     * Radio Channel.
     */
    function command() {
        /*jshint validthis: true */
        Channel.Extension.command(this._id);
    }

    function request(data) {
        return $.ajax({
            type : "POST",
            url  : C.QUERY_URL,
            data : JSON.stringify(data)
        });
    }

    function registerCommandsAndKeyBindings() {

        CommandManager.register(S.COMMAND_SHOW_ZOTERO_PANEL,     C.CMD_ID_SHOW_PANEL,      command);
        CommandManager.register(S.COMMAND_HIDE_ZOTERO_PANEL,     C.CMD_ID_HIDE_PANEL,      command);
        CommandManager.register(S.COMMAND_TOGGLE_ZOTERO_PANEL,   C.CMD_ID_TOGGLE_PANEL,    command);

        CommandManager.register(S.COMMAND_INSERT_CITATION,       C.CMD_ID_INSERT_CITE,     command);
        CommandManager.register(S.COMMAND_INSERT_BIBLIOGRAPHY,   C.CMD_ID_INSERT_BIBLIO,   command);
        CommandManager.register(S.COMMAND_GENERATE_BIBLIOGRAPHY, C.CMD_ID_GENERATE_BIBLIO, command);

        CommandManager.register(S.COMMAND_ZOTERO_SETTINGS,       C.CMD_ID_SHOW_SETTINGS,   command);
        CommandManager.register(S.COMMAND_CLEAR_ALL_RESULTS,     C.CMD_ID_CLEAR_ALL,       command);

        KeyBindingManager.addBinding(C.CMD_ID_TOGGLE_PANEL,      C.KBD_TOGGLE_PANEL);

    }

    module.exports = {
        registerCommandsAndKeyBindings : registerCommandsAndKeyBindings,
        request                        : request
    };

});
