/*global define*/
define(function (require, exports, module) {
    "use strict";

    // Local modules
    var Radio = require("src/thirdparty/Radio");

    // Communication Channels for triggering Events, giving Commands
    // and sending Requests.
    module.exports = {
        Extension : Radio.channel("zotero"),
        Document  : Radio.channel("zotero.document"),
        Biblio    : Radio.channel("zotero.bibliography"),
        Zotero    : Radio.channel("zotero.BBT"),
        UI        : Radio.channel("zotero.ui")
    };
});
