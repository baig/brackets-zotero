/**
 * @fileOverview Brackets Zotero Plugin
 * @author Wasif Hasan Baig
 * @license MIT
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true */
/*global define, brackets*/

define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var AppInit = brackets.getModule("utils/AppInit");

    // Local modules
    var Main    = require("src/Main");

    AppInit.appReady(function () {
        Main.init();
    });

});
