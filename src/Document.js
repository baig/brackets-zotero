/*
 * @fileoverview    Manages scanning, inserting and highlighting citations in
 *                  the currently opened document in the editor.
 * @author          Wasif Hasan Baig <pr.wasif@gmail.com>
 * @copyright       Wasif Hasan Baig 2015
 * @since           0.1.0
 * @license         MIT
 */

/*jslint vars: true, nomen: true, plusplus: true */
/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    // Brackets Modules
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var EditorManager   = brackets.getModule("editor/EditorManager");
    var _               = brackets.getModule("thirdparty/lodash");

    // Local Modules
    var Channel         = require("src/utils/Channel");
    var Events          = require("src/utils/Events");
    var Prefs           = require("src/Preferences");
    var C               = require("src/utils/Constants");

    function insertText(string) {
        var edits      = [];
        var document   = DocumentManager.getCurrentDocument();
        var selections = EditorManager.getCurrentFullEditor()
                                      .getSelections();

        _.forEach(selections, function (sel) {
            edits.push({
                edit : {
                    text  : string,
                    start : sel.start,
                    end   : sel.end
                }
            });
        });

        document.doMultipleEdits(edits);
    }

    function extractKeysFromText(fileContents) {
        var keys  = [];
        var match = fileContents.match(C.REGEXP_MATCH_BRACKETS);

        _.forEach(match, function (citesEnclosedInBrackets) {
            var items = citesEnclosedInBrackets.match(C.REGEXP_CITE_KEYS);
            _.forEach(items, function (citeKey) {
                // removing `@` prefix by slicing citeKey
                keys.push(citeKey.slice(1));
            });
        });

        return _.uniq(keys);
    }

    function indexKeysLocations(fileContents, keys) {
        var lines         = fileContents.split("\n");
        var lineCount     = 0; // 0-based line count
        var selectionKeys = {};

        _.forEach(lines, function (line) {

            _.forEach(keys, function (key) {
                if (!selectionKeys[key]) {
                    selectionKeys[key] = [];
                }

                var re = new RegExp(key, "g");
                var match;

                while ((match = re.exec(line)) !== null) {
                    var obj = {
                        line    : lineCount,
                        index   : match.index,
                        current : false
                    };
                    selectionKeys[key].push(obj);
                }
            });

            lineCount++;
        });

        _.forEach(selectionKeys, function (array) {
            array[0].current = true;
        });

        return selectionKeys;
    }

    function _getEditor(editor) {
        // getting editor if no editor provided
        if (!editor) {
            editor = EditorManager.getCurrentFullEditor();
        }

        // if still no editor found, throwing error
        if (!editor) {
            return false;
        }

        return editor;
    }

    function getFileExtension(editor) {
        return editor.document
                     .file
                     ._path
                     .split(".")
                     .slice(-1)[0];
    }

    function getNextKey(key) {
        /*jshint validthis: true */

        var col         = this.keysLocationHash[key];
        var index       = 0;
        var length      = col.length;
        var currentItem = null;

        _.forEach(col, function (item, idx) {
            if (!!item.current) {
                index = idx;
                currentItem = item;
            }
        });

        this.keysLocationHash[key][index].current = false;

        if (index === length - 1) {
            this.keysLocationHash[key][0].current = true;
        } else {
            this.keysLocationHash[key][index + 1].current = true;
        }

        return currentItem;
    }

    function _handleHighlighting(key) {
        /*jshint validthis: true */

        var editor = EditorManager.getCurrentFullEditor();

        if (!editor) {
            return false;
        }

        var curentCite = _.bind(getNextKey, this)(key.slice(1));

        editor.setCursorPos(curentCite.line, curentCite.index, true);
        editor.selectWordAt(editor.getSelection().start);
    }

    function _handleFileScanning(editor) {
        /*jshint validthis: true */

        editor = _getEditor(editor);

        if (!editor) {
            return false;
        }

        var fileExtension = getFileExtension(editor);

        if (!_.contains(Prefs.get("docTypesToScan"), fileExtension)) {
            return false;
        }

        var isPanelVisible = Channel.UI.request(Events.RQT_PANEL_VISIBILITY_STATUS);

        if (!isPanelVisible) {
            return false;
        }

        var fileContents = editor.document.getText();

        if (!fileContents) {
            return [];
        }

        var keys = extractKeysFromText(fileContents);

        if (keys.length) {
            this.extractedKeys = keys;
            Channel.Zotero.trigger(Events.EVT_CITEKEYS_FOUND, keys);
            this.keysLocationHash = indexKeysLocations(fileContents, keys);
        }

        this.scanned = true;
    }

    // insert the selected key into document at the current cursor position
    function _handleCiteInsertion() {
        var citeString = Channel.Zotero.request(Events.RQT_CITE_STRING);

        if (!citeString) {
            return;
        }

        insertText(citeString);
    }

    function _handleBiblioInsertion() {
        var biblioStringPromise = Channel.Zotero.request(Events.RQT_BIBLIOGRAPHY);

        if (!biblioStringPromise) {
            throw new Error("Error Inserting Bibliography in the Document");
        }

        biblioStringPromise.then(function (data) {
            insertText(data.result);
        });
    }

    function _init() {
        /*jshint validthis: true */
        Channel.Document.comply(Events.CMD_HIGHLIGHT_CITES, _handleHighlighting, this);
        Channel.Extension.on(Events.EVT_PANEL_SHOWN,        _handleFileScanning, this);
        Channel.Extension.on(Events.EVT_EDITOR_CHANGE,      _handleFileScanning, this);

        Channel.Extension.comply(Events.CMD_INSERT_CITE,    _handleCiteInsertion);
        Channel.Extension.comply(Events.CMD_INSERT_BIBLIO,  _handleBiblioInsertion);
    }

    function Document() {
        this.scanned = false;
        this.extractedKeys = [];
        this.keysLocationHash = {};

        Channel.Extension.on(Events.EVT_INIT, _init, this);
    }

    // exporting the singleton Document object
    module.exports = new Document();

});
