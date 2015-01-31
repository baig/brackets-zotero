define(function (require, exports, module) {
    'use strict'

    var CommandManager = brackets.getModule("command/CommandManager");
    var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    var Channel = require("src/utils/Channel")
    var C = require("src/utils/Constants")
    var S = require("strings")

    /**
     * All Commands registered are given this callback which channels the CMD_ID
     * to the Extension-wide Radio Channel. Any Object responsible for complying
     * to the command must listen to the desired CMD_ID on the Extension-wide
     * Radio Channel.
     */
    function _command() {
        Channel.Extension.command(this._id)
    }

    function _request(data) {
        return Promise.resolve($.ajax({
            type: 'POST',
            url: C.QUERY_URL,
            data: JSON.stringify(data)
        }))
    }

    function _registerCommandsAndKeyBindings() {

        CommandManager.register(S.COMMAND_SHOW_ZOTERO_PANEL, C.CMD_ID_SHOW_PANEL, _command);
        CommandManager.register(S.COMMAND_HIDE_ZOTERO_PANEL, C.CMD_ID_HIDE_PANEL, _command);
        CommandManager.register(S.COMMAND_TOGGLE_ZOTERO_PANEL, C.CMD_ID_TOGGLE_PANEL, _command);

        CommandManager.register(S.COMMAND_INSERT_CITATION, C.CMD_ID_INSERT_CITE, _command);
        CommandManager.register(S.COMMAND_INSERT_BIBLIOGRAPHY, C.CMD_ID_INSERT_BIBLIO, _command);
        CommandManager.register(S.COMMAND_GENERATE_BIBLIOGRAPHY, C.CMD_ID_GENERATE_BIBLIO, _command);

        CommandManager.register(S.COMMAND_CLEAR_ALL_RESULTS, C.CMD_ID_CLEAR_ALL, _command);

        KeyBindingManager.addBinding(C.CMD_ID_TOGGLE_PANEL, C.KBD_TOGGLE_PANEL)

    }

    module.exports = {
        request: _request,
        registerCommandsAndKeyBindings: _registerCommandsAndKeyBindings,
    }

});