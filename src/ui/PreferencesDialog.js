/*jslint nomen: true */
/*global define, brackets, Mustache */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var Dialogs         = brackets.getModule("widgets/Dialogs");
    var prefs           = brackets.getModule("preferences/PreferencesManager")
                                  .getExtensionPrefs("baig.zoteroplugin");

    // Local modules
    var defaultSettings = JSON.parse(require("text!settings.json"));
    var Channel         = require("src/utils/Channel");
    var Events          = require("src/utils/Events");
    var S               = require("strings");

    // Templates and resources
    var PrefsTemplate = require("text!../../htmlContent/zotero-preferences-dialog.html");

    // private variables
    var _currentSettings = {};
    var _newSettings     = {};

    /**
     * Constructs an object representation of all the preferences.
     * @param   {String[]} prefNames An array of strings containing preference IDs.
     * @returns {Object}   An object containing preferences as key value pairs.
     */
    function _objectify(prefNames) {
        var obj = {};
        prefNames.forEach(function (prefName) {
            obj[prefName] = prefs.get(prefName);
        });
        return obj;
    }

    /**
     * Event Handler responding to `change` and `input` events
     * arising from Settings Dialog. The new values are saved
     * in _newSettings object.
     */
    function _handleUpdatingNewSettings() {
        /*jshint validthis: true */
        var $target = $(this);
        var attr = $target.attr("data-target");
        var type = $target.attr("type");

        switch (type) {
            case "text":
                _newSettings[attr] = $target.val();
                break;
            case "checkbox":
                _newSettings[attr] = $target.is(":checked");
                break;
        }
    }

    /**
     * Updates preferences and the current settings
     * @param {Object} settings The settings object
     */
    function _applySettings(settings) {
        Object.keys(settings).forEach(function (key) {
            prefs.set(key, settings[key]);
            _currentSettings[key] = settings[key];
        });
    }

    /**
     * Compiles HTML template, jQuerify it and attaches `change`
     * and `input` events to input tags.
     * @returns {jQueryObject} jQuerified version of compiled template.
     */
    function _compileTemplateAndAttachEvents() {
        var $template = $(Mustache.render(PrefsTemplate, {
            settings : _currentSettings,
            S        : S
        }));

        $template
            .on("change", "[data-target]:checkbox", _handleUpdatingNewSettings)
            .on("input",  "[data-target]:text",     _handleUpdatingNewSettings);

        return $template;
    }

    /**
     * @callback complying to `CMD_SHOW_SETTINGS` command.
     */
    function _handleShowPreferencesDialog() {
        var $template = _compileTemplateAndAttachEvents();

        Dialogs.showModalDialogUsingTemplate($template).done(function (id) {
            switch (id) {
                case "save":
                    // Applying the new settings
                    _applySettings(_newSettings);
                    // Resetting the new settings object
                    _newSettings = {};
                    break;
                case "cancel":
                    // Resetting the new settings object
                    _newSettings = {};
                    break;
                case "defaults":
                    // Applying the default settings
                    _applySettings(defaultSettings);
                    // Resetting the new settings object
                    _newSettings = {};
                    break;
            }
        });
    }

    /**
     * @callback triggered in response to `EVT_INIT` event.
     * @private
     */
    function _init() {
        _currentSettings = _objectify(Object.keys(defaultSettings));
        Channel.Extension.comply(Events.CMD_SHOW_SETTINGS, _handleShowPreferencesDialog);
    }

    /**
     * Constructs a Settings Dialog
     * @constructor
     */
    function PreferencesDialog() {
        Channel.Extension.on(Events.EVT_INIT, _init, this);
    }

    module.exports = new PreferencesDialog();
});
