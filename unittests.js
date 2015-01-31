define(function (require, exports, module) {
    "use strict";

    var main = require("main");

    describe("Zotero Plugin", function () {
        it("should expose a handleHelloWorld method", function () {
            expect(main.handleHelloWorld).not.toBeNull();
        });
    });
    
});