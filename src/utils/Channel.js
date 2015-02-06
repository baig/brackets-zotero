define(function (require, exports, module) {
    'use strict';

    var Radio = require("src/thirdparty/Radio");

    // Communication Channels for triggering Events, giving Commands and sending Requests
    module.exports = {
        Extension: Radio.channel("zotero"),
        UI: Radio.channel("zotero.ui"),
        Zotero: Radio.channel("zotero.BBT"),
        Document: Radio.channel("zotero.document"),
        Biblio: Radio.channel("zotero.bibliography"),
    }
});