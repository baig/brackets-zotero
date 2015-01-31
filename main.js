/**
 * @fileOverview Brackets Zotero Plugin
 * @author Wasif Hasan Baig
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global $, define, brackets*/

define(function (require, exports, module) {
    'use strict';

    var AppInit = brackets.getModule("utils/AppInit")
    var Zotero = require("src/Zotero");

    AppInit.appReady(function () {
        Zotero.init()
    });

});