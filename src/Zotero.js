/*
 * @fileoverview    Manages querying the Zotero library, post-processing the
 *                  results, and holding citation keys in a hash serving them
 *                  to other modules upon request.
 * @author          Wasif Hasan Baig <pr.wasif@gmail.com>
 * @copyright       Wasif Hasan Baig 2015
 * @since           0.0.1
 * @license         MIT
 */

/*jslint vars: true, nomen: true, plusplus: true */
/*global define, brackets, console */

define(function (require, exports, module) {
    "use strict";

    // Brackets Modules
    var _               = brackets.getModule("thirdparty/lodash");

    // Local modules
    var BibtexParser    = require("src/thirdparty/BibtexParser");
    var settings        = JSON.parse(require("text!settings.json"));
    var Channel         = require("src/utils/Channel");
    var Events          = require("src/utils/Events");
    var Utils           = require("src/utils/Utils");
    var Prefs           = require("src/Preferences");

    /**
     * Search Zotero library using the given `query`.
     * @param   {String}  query The query string
     * @returns {Promise} promise to eventually provide search results
     * @private
     */
    function _search(query) {
        var reqData = {
            method : "search",
            params : [query]
        };
        return Utils.request(reqData);
    }

    /**
     * Post-process the search results.
     *
     *   -  Strips BibTeX key from the `extra` field and store it as `bibtexKey`
     *      property on every object.
     *
     *   -  Reduces the date field to year.
     *
     *   -  Combine all author last names using the given `authorNameSeparator`.
     *
     *   -  Remove items without BibTeX key if `itemsWithBibtexKeyOnly` flag is
     *      `true` in `settings.json`. (This is the default setting)
     *
     * @param   {Object[]} arrayOfObjects      The search results
     * @param   {String}   authorNameSeparator Seperator for author names e.g. ", "
     * @returns {Object[]} processed results
     * @private
     */
    function _postprocessData(arrayOfObjects, authorNameSeparator) {
        _.forEach(arrayOfObjects, function (objs, idx, collection) {
            var regxp = new RegExp(Prefs.get("extraFieldPrefix") + "[ ]+[a-zA-Z0-9-]+");
            // Checking if extra field is empty
            objs.bibtexKey = "";
            if (objs.extra && _.isString(objs.extra)) {
                // Extracting bibtexKey (e.g. Haux1997) from `extra` field
                var match = objs.extra.match(regxp);
                // console.log(match, objs);
                if (match !== null) {
                    objs.bibtexKey = match[0].split(":")[1]
                                             .trim();
                }
            } else {
                var warning = "";
                warning += "Entry with title " + objs.title + " and author(s) ";
                warning += objs.creators + " does not have a BibTeX key.";
                console.warn(warning); // logs warning to console if no BibTeX key found
            }

            // Only year in date
            if (objs.date  && objs.date.match(/\d{4,4}/g) !== null) {
                objs.date = objs.date.match(/\d{4,4}/g)[0];
            } else {
                objs.date = "";
            }

            // Converting creators object to a string of authors
            var authors = "";
            _.forEach(objs.creators, function (creator, i, col) {
                authors += creator.lastName;
                // appending separator only if not the last item
                if (i - col.length !== -1) {
                    authors += authorNameSeparator;
                }
            });
            collection[idx].creators = authors;
        });

        // removing items without BibTeX Key if `itemsWithBibtexKeyOnly` setting flag is true
        if (Prefs.get("itemsWithBibtexKeyOnly")) {
            arrayOfObjects = _.reject(arrayOfObjects, {
                bibtexKey : ""
            });
        }

        return arrayOfObjects;
    }

    /**
     * Removes items from search results array given a set of cite keys
     * @param   {{bibtexKey:string}[]} searchResults result items fetched as a result of the query
     * @param   {string[]}             prevKeys      a list of cite keys currectly held
     *                                               in the Zotero object
     * @returns {{bibtexKey:string}[]} Returns back the mutated searchResults array of objects
     */
    function _removeAlreadySelectedItems(searchResults, prevKeys) {
        _.forEach(prevKeys, function (bibtexKey) {
            searchResults = _.reject(searchResults, {
                bibtexKey : bibtexKey
            });
        });
        return searchResults;
    }

    /**
     * Brings selected/checked items to the top of the results list.
     * @param   {Object[]} searchResults the search results
     * @param   {Object[]} selectedItems the selected items
     * @returns {Object[]} the search results with selected items at the top
     */
    function _pushSelectedItemsToTop(searchResults, selectedItems) {
        _.forEachRight(selectedItems, function (item) {
            searchResults.unshift(item);
        });
        return searchResults;
    }

    function surroundWithSpan(string, index, length) {
        var matchedStr = string.slice(index,  index + length),
            surroundingStr = string.split(matchedStr),
            wrappedMatchedStr = '<span class="highlight">' + matchedStr + "</span>";
        return surroundingStr[0] + wrappedMatchedStr + surroundingStr[1];
    }

    function _highlightSearchTerms(query, searchResults) {
        var terms = query.split(" ");
        terms = _.filter(terms, function (term) {
                    return term.length > 1;
                });

        _.forEach(searchResults, function (obj) {
            _.forEach(terms, function (term) {
                var matchTitle = obj.title.match(new RegExp(term, "i"));
                var matchCreators = obj.creators.match(new RegExp(term, "i"));
                var matchDate = obj.date.match(new RegExp(term, "i"));
                var len = term.length;

                if (matchTitle !== null) {
                    obj.title = surroundWithSpan(obj.title, matchTitle.index, len);
                }

                if (matchCreators !== null) {
                    obj.creators = surroundWithSpan(obj.creators, matchCreators.index, len);
                }

                if (matchDate !== null) {
                    obj.date = surroundWithSpan(obj.date, matchDate.index, len);
                }
            });
        });
        return searchResults;
    }

    function _handleSearch(query) {
        /*jshint validthis: true */
        _search(query).then(function (response) {
            var searchResults = (!!response.result) ? _postprocessData(response.result, ", ") : [];
            this.results = searchResults;

            searchResults = _removeAlreadySelectedItems(searchResults, this.keysToAdd);
            // console.log(this.keysToAdd, searchResults)

            if (!_.isEmpty(this.selected)) {
                searchResults = _pushSelectedItemsToTop(searchResults, this.selected);
            }

            searchResults = _highlightSearchTerms(query, searchResults);

            searchResults = {
                results : searchResults
            };

            Channel.UI.command(Events.CMD_DISPLAY_RESULTS, searchResults);
        }.bind(this), function (err) {
            var warning = "";
            warning += "Unable to perform search. ";
            warning += "Make sure either Firefox or Zotero standalone is running.";

            console.warn(warning);
            Channel.UI.command(Events.CMD_DISPLAY_ERROR);
        });
    }

    /**
     * Request string representation of the bibliography given a set of citation keys
     * @param   {string[]}        keys List of citation keys
     * @returns {Promise|boolean} Returns a promise if keys[] is not empty;
     *                            otherwise returns false
     */
    function _requestBibliography(citationKeys, format) {
        /*jshint validthis: true */
        var citations = citationKeys || ((this && this.citations) ? this.citations : false);
        format = format || "text";

        if (!citations) {
            return false;
        }
        // console.log("Requesting bibliography from server...")
        var data = {
            method : "bibtex",
            params : [citations, {
                format : format
            }]
            // available translators: "betterbibtex", "betterbiblatex", "latexcitation",
            //                        "pandoccitation", "zoterotestcase", "bibtexaux scanner"
        };
        return Utils.request(data);
    }

    function postprocessExistingCites(citationKeys, existingCites) {
        var count = 1;
        var result = [];
        _.forEach(citationKeys, function (key) {
            var cite = existingCites[key.toUpperCase()];
            var obj = {};

            obj.number = count++;
            obj.bibtexKey = "@" + key;

            obj.title = (cite && cite.TITLE)
                ? cite.TITLE.replace(/\{|\}/g, "") // omitting curly braces from the title
                : "";

            obj.date = (cite && cite.DATE && cite.DATE.match(/\d{4,4}/g) !== null)
                ? cite.DATE.match(/\d{4,4}/g)[0] // replacing with `YYYY` formatted year
                : ""; // otherwise leaving it blank

            obj.authors = (cite && cite.AUTHOR)
                ? cite.AUTHOR
                      .replace(/\{|\}/g, "") // omitting all braces from authors
                      .split(" and ") // removing ` and `
                      .map(function (author) {
                          return author.split(", ")[0]; // removing `firstname`
                      })
                      .join(", ") // joining by `, `
                : "";

            result.push(obj);
        });
        return result;
    }

    function _generateCiteString(keys) {
        // pandoc style
        var citeString = Prefs.get("citeKeysOpeningDelimiter");
        if (keys.length === 1) {
            citeString += Prefs.get("citeKeyPrefix") + keys[0];
        } else {
            _.forEach(keys, function (bibtexKey, idx) {
                citeString += Prefs.get("citeKeyPrefix") + bibtexKey;
                if (idx !== keys.length - 1) {
                    citeString += Prefs.get("citeKeysSeparator");
                }
            });
        }
        citeString += Prefs.get("citeKeysClosingDelimiter");
        return citeString;
    }

    function _handleCiteStringRequest() {
        /*jshint validthis: true */
        this.citations = _.union(this.citations, this.keysToAdd);
        return _generateCiteString(this.keysToAdd);
    }

    function _handleCitesFromDocument(keys) {
        /*jshint validthis: true */

        // updating keys hashes
        this.keysToAdd = keys;
        this.citations = keys;

        // requesting bibliography
        var biblioJsonPromise = _requestBibliography(keys);
        biblioJsonPromise.then(function (data) {
            if (!data || !data.result) {
                return false;
            }
            var existingCites = postprocessExistingCites(keys, BibtexParser.parse(data.result));
            existingCites = {
                existingCites : existingCites
            };
            Channel.UI.command(Events.CMD_DISPLAY_CITES, existingCites);
        });
    }

    function _clearSelection() {
        /*jshint validthis: true */
        this.selected = [];
        this.keysToAdd = [];
    }

    function _updateSelection(bibtexKey, checked) {
        /*jshint validthis: true */
        // console.log(bibtexKey, checked)

        var selected = _.filter(this.results, {
            bibtexKey : bibtexKey
        });

        if (!_.isEmpty(selected)) {
            selected[0].selected = true;
            if (checked) {
                this.keysToAdd.push(bibtexKey);
            } else {
                this.keysToAdd = _.without(this.keysToAdd, bibtexKey);
            }
        }

        if (checked) {
            // checking if already present or not
            if (!_.some(this.selected, {
                    bibtexKey : bibtexKey
                })) {
                // adding to this.selected
                this.selected.push(selected[0]);
            }
        } else {
            // removing item from this.selected
            this.selected = _.reject(this.selected, {
                bibtexKey : bibtexKey
            });
        }
        // console.log(bibtexKey, checked, this)
    }

    function _init() {
        /*jshint validthis: true */
        Channel.Zotero.on(Events.EVT_CITEKEYS_FOUND,       _handleCitesFromDocument, this);
        Channel.Zotero.reply(Events.RQT_CITE_STRING,       _handleCiteStringRequest, this);
        Channel.Zotero.reply(Events.RQT_BIBLIOGRAPHY,      _requestBibliography,     this);
        Channel.Zotero.comply(Events.CMD_SEARCH,           _handleSearch,            this);

        Channel.Extension.on(Events.EVT_PANELVIEW_CLEARED, _clearSelection,          this);
        Channel.Extension.on(Events.EVT_ITEM_SELECTED,     _updateSelection,         this);
    }

    function Zotero() {
        this.citations  = []; // All bibtexKeys added in the document so far
        this.keysToAdd  = []; // Keys to add in `citations` at the end of this search session
        this.selected   = []; // Selected Zotero Items with `selected` property set to true
        this.results    = []; // Search results from the server

        Channel.Extension.on(Events.EVT_INIT, _init, this);
    }

    module.exports = new Zotero();

});
