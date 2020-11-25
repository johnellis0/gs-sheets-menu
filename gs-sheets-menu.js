function SheetMenu(options, ...settings){
    this.options = {
        sheetName: "Settings",
        sheetTitle: "Settings Menu",
        settingSpacing: 0,
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
        var row = 2 + this.options.settingSpacing; // Skip title row

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
        this._sheet = ss.getSheetByName(this.sheetName);
        this._sheet = ss.getSheetByName(this.options.sheetName);

        if(!this._sheet)
            this._sheet = ss.insertSheet(this.sheetName);
            this._sheet = ss.insertSheet(this.options.sheetName);

        return this._sheet;
    },

    draw: function(){
        this.sheet.getRange(1,1).setValue(this.options.sheetTitle);

        this.settings.forEach((setting) => {
            var range = this.sheet.getRange(this.structure[setting.name], 1, 1, setting.getSize().columns);
            range.setValues([setting.getValues()]);
        })
    },

    get: function(settingName){
        // var setting = this.settings.find(s => s.name === settingName);
        var row = this.structure[settingName];
        return this.sheet.getRange(row, 2).getValue();
    },


}

function Setting(name, defaultValue, description, settingType){
    this.name = name;
    this.defaultValue = name;
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

    getValues: function(){
        return [this.name, this._value, this.description];
    }
};

function TextSetting(name, defaultValue, description){
    Setting.call(this, name, defaultValue, description, SettingTypes.TEXT);
}
TextSetting.prototype = Object.create(Setting.prototype);

/**
 * Enum for settings types. Used to determine how to display on menu / validate etc.
 * @readonly
 * @enum {number}
 */
const SettingTypes = Object.freeze({
    TEXT: 1,
    BOOL: 2,
});
