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

    draw: function(){
        this.sheet.getRange(1,1,1,3).merge().setValue(this.options.sheetTitle).setHorizontalAlignment("center");

        this.sheet.getRange(1,1, this.sheet.getMaxRows(), this.sheet.getMaxColumns()).setBackground("lightgrey");

        this.settings.forEach((setting) => {
            var range = this.sheet.getRange(this.structure[setting.name], 1, 1, setting.getSize().columns);
            setting.draw(range);
            range.getCell(1,2).setBackground("white").setBorder(true, true, true, true, null, null);
        })

        var rows = this.sheet.getLastRow();
        var columns = this.sheet.getLastColumn()

        this.sheet.deleteRows(rows+1, this.sheet.getMaxRows()-rows);
        this.sheet.deleteColumns(columns+1, this.sheet.getMaxColumns()-columns);

        this.sheet.getDataRange().protect().setWarningOnly(true);
    },

    get: function(settingName){
        // var setting = this.settings.find(s => s.name === settingName);
        var row = this.structure[settingName];
        return this.sheet.getRange(row, 2).getValue();
    },

    set: function(settingName, value){

    }
}

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

function TextSetting(name, defaultValue, description=""){
    if(!(this instanceof TextSetting))
        return new TextSetting(...arguments);

    Setting.call(this, name, defaultValue, description, SettingTypes.TEXT);
}
TextSetting.prototype = Object.create(Setting.prototype);

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
 * Enum for settings types. Used to determine how to display on menu / validate etc.
 * @readonly
 * @enum {number}
 */
const SettingTypes = Object.freeze({
    TEXT: 1,
    BOOL: 2,
});
