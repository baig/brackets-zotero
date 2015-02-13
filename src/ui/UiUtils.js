define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var _ = brackets.getModule("thirdparty/lodash")

    // Local modules
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")

    function _clearView ( selector, options ) {
        var removeUnselectedOnly = (options) ? options.unselected : false
        if (removeUnselectedOnly) {
            // Remove only unselected items
            $( selector ).children().find("tr:not(.selected)").remove()
        } else {
            // Remove all items
            $( selector ).children().remove()
            Channel.Extension.trigger( Events.EVENT_PANELVIEW_CLEARED )
        }
    }

    function _append( selector, template, data ) {
        if (data) {
            $( selector ).append( Mustache.render(template, data) )
        } else {
            $( selector ).append( Mustache.render(template) )
        }
    }

    module.exports = {
        clearView: _clearView,
        append: _append,
    }
});
