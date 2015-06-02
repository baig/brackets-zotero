/*global define, brackets */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
    var prefs              = PreferencesManager.getExtensionPrefs("baig.zoteroplugin");
    
    // Local modules
    var Channel = require("src/utils/Channel");
    var Events  = require("src/utils/Events");
    
    var defaults = {
        itemsWithBibtexKeyOnly   : { type: "boolean",  value: true                       },
        extraFieldPrefix         : { type: "string" ,  value: "bibtex:"                  },
        docTypesToScan           : { type: "string" ,  value: "md txt"                   },
        bibFolderName            : { type: "string" ,  value: "brackets-zotero-bibtex-DB"},
        scanInterval             : { type: "number" ,  value: 10000                      },
        bibFileName              : { type: "string" ,  value: "refs.bib"                 },
        citeKeysOpeningDelimiter : { type: "string" ,  value: "["                        },
        citeKeysClosingDelimiter : { type: "string" ,  value: "]"                        },
        citeKeysSeparator        : { type: "string" ,  value: "; "                       },
        citeKeyPrefix            : { type: "string" ,  value: "@"                        }
    }

    // Defining preferences
    Object.keys(defaults).forEach(function(prefName) {
        prefs.definePreference(prefName, defaults[prefName].type, defaults[prefName].value);
    })

    // Get preference
    function _get(name) {
        return prefs.get(name);
    }
        
    // Set preference
    function _set(name, value) {
        prefs.set(name, value);
    }
    
    /**
     * Constructs an object representation of all the preferences.
     * @param   {String[]} prefNames An array of strings containing preference IDs.
     * @returns {Object}   An object containing preferences as key value pairs.
     */
    function _objectify(opts) {
        var isDefault = (opts && opts.defaults) ? opts.defaults : false;
        var obj = {};
        Object.keys(defaults).forEach(function(prefName) {
            isDefault
                ? obj[prefName] = defaults[prefName].value
                : obj[prefName] = prefs.get(prefName);
        });
        return obj;
    }
    
    module.exports = {
        get: _get,
        set: _set,
        objectify: _objectify
    }

});
