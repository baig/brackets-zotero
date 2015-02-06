define(function (require, exports, module) {
    'use strict'

    // Brackets Modules
    var EditorManager = brackets.getModule("editor/EditorManager");
    // Local Modules
    var Channel = require("src/utils/Channel")
    var Events = require("src/utils/Events")

    /**
     * Channelize all Brackets' Events that you are interested in
     * to Extension's Radio Channel
     */

    EditorManager.on("activeEditorChange", function (e, newEd, oldEd) {
        Channel.Extension.trigger(Events.EVENT_EDITOR_CHANGE, newEd)
    })

})