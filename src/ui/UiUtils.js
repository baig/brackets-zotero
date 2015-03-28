/*global define, $, Mustache */
define(function (require, exports, module) {
    "use strict";

    // Local modules
    var Channel = require("src/utils/Channel"),
        Events  = require("src/utils/Events");

    function clearView(selector, options) {
        var removeUnselectedOnly = (options) ? options.unselected : false;
        if (removeUnselectedOnly) {
            // Remove only unselected items
            $(selector).children().find("tr:not(.selected)").remove();
        } else {
            // Remove all items
            $(selector).children().remove();
            Channel.Extension.trigger(Events.EVT_PANELVIEW_CLEARED);
        }
    }

    function append(selector, template, data) {
        if (data) {
            $(selector).append(Mustache.render(template, data));
        } else {
            $(selector).append(Mustache.render(template));
        }
    }

    module.exports = {
        clearView : clearView,
        append    : append
    };
});
