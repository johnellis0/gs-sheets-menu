/* Google Scripts Sheets Form Utilities
 * By John Ellis
 * https://github.com/johnellis0/gs-sheets-menu
 * Released under the MIT License
 *
 * Google Apps Script for Google Sheets that adds the ability to create a sheet based settings menu.
 */

/**
 * Create SheetMenu instance
 *
 * @param {object} options Optional options object
 * @param {...Setting} settings List of Setting's as arguments. Can be TextSetting's, CheckboxSetting's, DropdownSetting's
 * @returns {SheetMenu}
 * @constructor
 *
 * @example
 options = {
         sheetName: "Settings",
         sheetTitle: "Menu",
         settingSpacing: 1
     };

 const menu = SheetMenu(options,
     TextSetting("Setting 1", "Value 1", "Example 1"),
     TextSetting("Setting 2", "Value 2", "Example 2"),
     CheckboxSetting("Setting 3", false, "Example 3"),
     DropdownSetting("Setting 4", [1,2,3,4,5], "Example 4")
 );
 */
function SheetMenu(options, ...settings){
    if(!(this instanceof SheetMenu))
        return new SheetMenu(options, ...settings);

    this.options = {
        sheetName: "Settings",
        sheetTitle: "Settings Menu",
        settingSpacing: 1,
        ...options
    };

    this.settings = settings;

    if(!SpreadsheetApp.getActiveSpreadsheet().getSheets().includes(this.options.sheetName))
        this.draw();
}
SheetMenu.prototype = {
    _structure: undefined,
    _sheet: undefined,

    get structure(){
        if(this._structure !== undefined)
            return this._structure;

        this._structure = {};
        var row = 2; // Skip title row

        this.settings.forEach((setting) => {
            this._structure[setting.name] = row;
            row += setting.getSize().rows;
            row += this.options.settingSpacing;
        })

        return this._structure;
    },

    get sheet(){
        if(this._sheet !== undefined)
            return this._sheet;

        var ss = SpreadsheetApp.getActiveSpreadsheet();
        this._sheet = ss.getSheetByName(this.options.sheetName);

        if(!this._sheet)
            this._sheet = ss.insertSheet(this.options.sheetName);

        return this._sheet;
    },

    /**
     * Creates menu sheet & draws out menu, with the *default* setting values.
     *
     * The menu will automatically be drawn if it does not exist when the SheetMenu object is instantiated.
     *
     * Only call this function yourself if you wish to re-draw the menu, eg. to reset all settings.
     *
     * @example
const menu = SheetMenu(options, settings);

function resetSettings(){
    menu.draw(); // Re-create menu with default settings
}
     */
    draw: function(){
        this.sheet.getRange(1,1,1,3).merge()
            .setValue(this.options.sheetTitle)
            .setFontSize(16)
            .setFontWeight("bold")
            .setHorizontalAlignment("center");

        this.sheet.getRange(1,1, this.sheet.getMaxRows(), this.sheet.getMaxColumns()).setBackground("lightgrey");

        this.settings.forEach((setting) => {
            var range = this.sheet.getRange(this.structure[setting.name], 1, 1, setting.getSize().columns);
            setting.draw(range);
            range.getCell(1,2).setBackground("white").setBorder(true, true, true, true, null, null);
        })

        var rows = this.sheet.getLastRow();
        var columns = this.sheet.getLastColumn()

        if(rows !== this.sheet.getMaxRows())
            this.sheet.deleteRows(rows+1, this.sheet.getMaxRows()-rows);

        if(columns !== this.sheet.getMaxColumns())
            this.sheet.deleteColumns(columns+1, this.sheet.getMaxColumns()-columns);

        this.sheet.getDataRange().protect().setWarningOnly(true);

        this.sheet.autoResizeColumns(1, this.sheet.getMaxColumns());
        this.sheet.setColumnWidth(2, this.sheet.getColumnWidth(2) + 25);
    },

    /**
     * Returns value of setting with `settingName`
     * @param {string} settingName Name of setting
     * @returns {*} Value of setting from sheet menu
     * @example
const menu = SheetMenu(options,
    CheckboxSetting("FOO", false, "Example 3")
);

menu.get("FOO"); // Returns value of setting 'FOO'
     */
    get: function(settingName){
        // var setting = this.settings.find(s => s.name === settingName);
        var row = this.structure[settingName];
        return this.sheet.getRange(row, 2).getValue();
    },

    /**
     * Get all settings & their values
     * @returns {String[][]} Array of [Name, Value] pairs for all settings
     *
     * @example
const menu = SheetMenu(options,
    TextSetting("Setting 1", "Value 1", "Example 1"),
    TextSetting("Setting 2", "Value 2", "Example 2"),
    CheckboxSetting("Setting 3", false, "Example 3"),
    DropdownSetting("Setting 4", [1,2,3,4,5], "Example 4")
);

var key_values = menu.getAll();
Logger.log(key_values[1]) // ["Setting 2", "Value 2"]
     */
    getAll(){
        var keyPairs = [];

        this.settings.forEach((s) => {
            keyPairs.push([s.name, this.get(s.name)]);
        })

        return keyPairs;
    },

    set: function(settingName, value){

    }
}

/**
 * Superclass for all other Settings
 * @param {string} name Name of setting
 * @param {string} defaultValue Default value
 * @param {string} description Displayed in the description column on the settings sheet
 * @param {SettingTypes} settingType Type of setting
 * @returns {TextSetting}
 * @constructor
 * @ignore
 */
function Setting(name, defaultValue, description, settingType){
    this.name = name;
    this.defaultValue = defaultValue;
    this.description = description;
    this.settingType = settingType;
}
Setting.prototype = {
    _value: undefined,

    getDefault: function(){
        return this.defaultValue;
    },

    getSize: function(){
        var rows = 1;
        var columns = 3;

        return {rows, columns};
    },

    getDefaultValues: function(){
        return [this.name, this.getDefault(), this.description];
    },

    draw: function(range){
        range.setValues([this.getDefaultValues()]);
    }
};

/**
 * TextSetting allows any value to be entered and is displayed as a normal cell on the sheet menu.
 * @param {string} name Name of setting
 * @param {string} defaultValue Default value
 * @param {string} description Displayed in the description column on the settings sheet
 * @returns {TextSetting}
 * @constructor
 * @extends Setting
 */
function TextSetting(name, defaultValue, description=""){
    if(!(this instanceof TextSetting))
        return new TextSetting(...arguments);

    Setting.call(this, name, defaultValue, description, SettingTypes.TEXT);
}
TextSetting.prototype = Object.create(Setting.prototype);

/**
 * CheckboxSetting allows only true/false values and is displayed as a checkbox on the sheet menu.
 * @param {string} name Name of setting
 * @param {boolean} defaultValue Default value
 * @param {string} description Displayed in the description column on the settings sheet
 * @returns {CheckboxSetting}
 * @constructor
 * @extends Setting
 */
function CheckboxSetting(name, defaultValue=false, description=""){
    if(!(this instanceof CheckboxSetting))
        return new CheckboxSetting(...arguments);

    Setting.call(this, name, defaultValue, description, SettingTypes.BOOL);
}
CheckboxSetting.prototype = Object.create(Setting.prototype);

CheckboxSetting.prototype.draw = function(range){
    range.setValues([this.getDefaultValues()]);
    range.getCell(1,2).insertCheckboxes();
};

/**
 * DropdownSetting allows only certain values and is displayed as a cell with a dropdown on the sheet menu.
 * @param {string} name Name of setting
 * @param {string[]} possibleValues Array of available values. First value is taken as the default
 * @param {string} description Displayed in the description column on the settings sheet
 * @returns {DropdownSetting}
 * @constructor
 * @extends Setting
 */
function DropdownSetting(name, possibleValues, description=""){
    if(!(this instanceof DropdownSetting))
        return new DropdownSetting(...arguments);

    Setting.call(this, name, possibleValues[0], description, SettingTypes.BOOL);
    this.possibleValues = possibleValues;
}
DropdownSetting.prototype = Object.create(Setting.prototype);

DropdownSetting.prototype.draw = function(range){
    range.setValues([this.getDefaultValues()]);

    var rule = SpreadsheetApp.newDataValidation()
                .requireValueInList(this.possibleValues)
                .setAllowInvalid(false)
                .build();

    range.getCell(1,2).setDataValidation(rule);
};

/**
 * Setting types ENUM.
 * @readonly
 * @enum {number}
 * @ignore
 */
const SettingTypes = Object.freeze({
    TEXT: 1,
    BOOL: 2,
});
