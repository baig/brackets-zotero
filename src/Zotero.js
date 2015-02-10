define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var _ = brackets.getModule("thirdparty/lodash");

    //    // Local modules
    var settings = JSON.parse(require('text!settings.json'));
    var C = require("src/utils/Constants")
    var Channel = require("src/utils/Channel")
    var Utils = require("src/utils/Utils")
    var Events = require("src/utils/Events")
    var BibtexParser = require("src/thirdparty/BibtexParser")

    require('src/Panel')
    require('src/Document')
    require('src/Bibliography')
    require('src/utils/EventTranslator')

    /**
     * Removes items from search results array given a set of cite keys
     * @param   {{bibtexKey:string}[]} searchResults result items fetched as a result of the query
     * @param   {string[]}             prevKeys      a list of cite keys currectly held in the Zotero object
     * @returns {{bibtexKey:string}[]} Returns back the mutated searchResults array of objects
     */
    function _removeAlreadySelectedItems(searchResults, prevKeys) {
        _.forEach(prevKeys, function (bibtexKey) {
            searchResults = _.reject(searchResults, {
                bibtexKey: bibtexKey
            })
        })
        return searchResults
    }

    // side-effect free
    function _pushSelectedItemsToTop(searchResults, selectedItems) {
        _.forEachRight(selectedItems, function (item) {
            searchResults.unshift(item)
        })
        return searchResults
    }

    function _surroundWithSpan(string, index, length) {
        var matchedStr = string.slice(index,  index+length)
        var surroundingStr = string.split(matchedStr)
        var wrappedMatchedStr = '<span class="highlight">' + matchedStr + '</span>'
        return surroundingStr[0] + wrappedMatchedStr + surroundingStr[1]
    }

    function _highlightSearchTerms(query, searchResults) {
        var terms = query.split(' ')
        var terms = _.filter(terms, function(term) { return term.length > 1 })

        _.forEach( searchResults, function (resultObj) {
            _.forEach( terms, function (term) {
                var matchTitle = resultObj.title.match(new RegExp(term, 'i'))
                var matchCreators = resultObj.creators.match(new RegExp(term, 'i'))
                var matchDate = resultObj.date.match(new RegExp(term, 'i'))

                if (matchTitle !== null)
                    resultObj.title = _surroundWithSpan(resultObj.title, matchTitle.index, term.length)

                if (matchCreators !== null)
                    resultObj.creators = _surroundWithSpan(resultObj.creators, matchCreators.index, term.length)

                if (matchDate !== null)
                    resultObj.date = _surroundWithSpan(resultObj.date, matchDate.index, term.length)
            })
        })
        return searchResults
    }

    function _handleSearch(query) {
        _search(query).then(function (response) {
            var searchResults = (!!response.result) ? _postprocessData(response.result, ", ") : []
            this.results = searchResults

            searchResults = _removeAlreadySelectedItems(searchResults, this.keysToAdd)
                //            console.log(this.keysToAdd, searchResults)

            if (!_.isEmpty(this.selected)) searchResults = _pushSelectedItemsToTop(searchResults, this.selected)

            searchResults = _highlightSearchTerms(query, searchResults)

            searchResults = {
                results: searchResults
            }

            Channel.UI.command('display:results', searchResults)
        }.bind(this), function (err) {
            console.warn("Unable to perform search. Make sure either Firefox or Zotero standalone is running.")
            Channel.UI.command('display:error')
        })
    }

    function _search(query) {
        var reqData = {
            method: 'search',
            params: [query]
        }
//        console.log(reqData)
        return Utils.request(reqData)
    }

    /**
     * Request string representation of the bibliography given a set of citation keys
     * @param   {string[]}        keys List of citation keys
     * @returns {Promise|boolean} Returns the request Promise if keys[] is not empty; otherwise returns false
     */
    function _requestBibliography(citationKeys, format) {
        var format = format || 'text'
        var citations = citationKeys || ( (this && this.citations) ? this.citations : false )
        if (!citations) return false
//        console.log("Requesting bibliography from server...")
        var data = {
            method: 'bibtex',
            params: [citations, {
                    format: format
                }]
                // available translators: "betterbibtex", "betterbiblatex", "latexcitation", "pandoccitation", "zoterotestcase", "bibtexaux scanner"
        }
        return Utils.request(data)
    }

    function _postprocessExistingCites(citationKeys, existingCites) {
        var count = 1;
        var result = []
        _.forEach( citationKeys, function (key) {
            var cite = existingCites[ key.toUpperCase() ]
            var obj = {}
            
            obj.number = count++;
            obj.bibtexKey = '@' + key;
            // omitting all the braces from title
            obj.title = (cite && cite.TITLE) ? cite.TITLE.replace(/\{|\}/g, '') : ''
            // replacing any date with just `YYYY` formatted date
            obj.date = (cite && cite.DATE && cite.DATE.match(/\d{4,4}/g) !== null) ? cite.DATE.match(/\d{4,4}/g)[0] : ''
            // omitting all braces from authors; removing ` and `; removing `firstname`; joining by `, `
            obj.authors = (cite && cite.AUTHOR) ? cite.AUTHOR.replace(/\{|\}/g, '').split(' and ').map( function(author) { return author.split(', ')[0] } ).join(', ') : ''
            
            result.push(obj)
        })
        return result
    }

    function _generateCiteString(keys) {
        // pandoc style
        var citeString = "[";
        if (keys.length === 1) {
            citeString += "@" + keys[0]
        } else {
            _.forEach(keys, function (bibtexKey, idx) {
                citeString += "@" + bibtexKey
                if (idx !== keys.length - 1) citeString += "; "
            })
        }
        citeString += "]"
        return citeString
    }

    function _handleCiteStringRequest() {
        this.citations = _.union(this.citations, this.keysToAdd)
        return _generateCiteString(this.keysToAdd)
    }

    function _postprocessData(arrayOfObjects, separator) {
        _.forEach(arrayOfObjects, function (objs, idx, collection) {
            // checking if extra field is empty
            objs.bibtexKey = ""
            if (objs.extra && _.isString(objs.extra)) {
                // extracting bibtexKey (e.g. Haux1997) from `extra` field
                var match = objs.extra.match(new RegExp(settings.bibtexPrefix + "[ ]+[a-zA-Z0-9\-]+"))
                    //                console.log(match)
                if (match !== null) {
                    objs.bibtexKey = match[0].split(":")[1].trim()
                }
            } else {
                // display warning "some items don't have bibtex bibtexKey set"
            }

            // only year in date
            if (objs.date  && objs.date.match(/\d{4,4}/g) !== null) {
                objs.date = objs.date.match(/\d{4,4}/g)[0]
            } else {
                objs.date = ''
            }
                //
                // converting creators object to a string of authors
            var authors = "";
            _.forEach(objs.creators, function (creator, i, col) {
                authors += creator.lastName
                    // appending separator only if not the last item
                if (i - col.length != -1) authors += separator
            })
            collection[idx].creators = authors
        })

        // removing items without BibTeX Key if `itemsWithBibtexKeyOnly` setting flag is true
        if (settings.itemsWithBibtexKeyOnly) {
            arrayOfObjects = _.reject(arrayOfObjects, {
                bibtexKey: ""
            })
        }

        return arrayOfObjects
    }

    function _handleCitekeysFoundInDocument(keys) {
        // updating keys hashes
        this.keysToAdd = keys
        this.citations = keys
        
        // requesting bibliography
        var biblioJsonPromise = _requestBibliography(keys)
        biblioJsonPromise.then( function(data) {
            if (!data || !data.result) return false
            var existingCites = _postprocessExistingCites( keys, BibtexParser.parse(data.result) )
            existingCites = { existingCites: existingCites }
            Channel.UI.command( 'display:existing:cites', existingCites )
        })
    }

    function _clearSelection() {
        this.selected = []
        this.keysToAdd = []
    }

    function _updateSelection(bibtexKey, checked) {
        //        console.log(bibtexKey, checked)

        var selected = _.filter(this.results, {
            bibtexKey: bibtexKey
        })

        if (!_.isEmpty(selected)) {
            selected[0].selected = true
            if (checked) {
                this.keysToAdd.push(bibtexKey)
            } else {
                this.keysToAdd = _.without(this.keysToAdd, bibtexKey)
            }
        }

        if (checked) {
            // checking if already present or not
            if (!_.some(this.selected, {
                    bibtexKey: bibtexKey
                })) {
                // adding to this.selected
                this.selected.push(selected[0])
            }
        } else {
            // removing item from this.selected
            this.selected = _.reject(this.selected, {
                bibtexKey: bibtexKey
            })
        }
//        console.log(bibtexKey, checked, this)
    }

    function _init() {
        // Registering all commands to use Extension-wide Radio Channel
        Utils.registerCommandsAndKeyBindings()

        Channel.Zotero.on('citekeys:from:document', _.bind(_handleCitekeysFoundInDocument, this))
        Channel.Zotero.comply('search', _.bind(_handleSearch, this))
        Channel.Zotero.reply(Events.REQUEST_CITE_STRING, _.bind(_handleCiteStringRequest, this))
        Channel.Zotero.reply(Events.REQUEST_BIBLIOGRAPHY, _.bind(_requestBibliography, this))

        Channel.Extension.on('panel:list:cleared', _.bind(_clearSelection, this))
        Channel.Extension.on('panel:item:selected', _.bind(_updateSelection, this))

        Channel.Extension.trigger(Events.EVENT_INIT)
    }

    function Zotero() {
        this.citations = [] // all bibtexKeys added in the document so far
        this.results = [] // search results from the server
        this.selected = [] // selected Zotero Items with `selected` property set to true
        this.keysToAdd = [] // keys of selected items to add in citations at the end of this search session
        this.init = _init
    }

    module.exports = new Zotero()

});
