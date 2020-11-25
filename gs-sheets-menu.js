function SheetMenu(sheetName, ...settings){
    this.sheetName = sheetName;
    this.settings = settings;
}
SheetMenu.prototype = {
    _structure: undefined,
    _sheet: undefined,

    get structure(){
        if(this._structure !== undefined)
            return this._structure;

        this._structure = {};
        var row = 1;

        this.settings.forEach((setting) => {
            this._structure[setting.name] = row;
            row += setting.getSize().rows;
        })

        return this._structure;
    },

    get sheet(){
        if(this._sheet !== undefined)
            return this._sheet;

        var ss = SpreadsheetApp.getActiveSpreadsheet();
        this._sheet = ss.getSheetByName(this.sheetName);

        if(!this._sheet)
            this._sheet = ss.insertSheet(this.sheetName);

        return this._sheet;
    },

    draw: function(){
        this.settings.forEach((setting) => {
            var range = this.sheet.getRange(this.structure[setting.name], 1, 1, setting.getSize().columns);
            range.setValues([setting.getValues()]);
        })
    }
}

function TextSetting(name, defaultValue, description){
    if(!(this instanceof  TextSetting))
        return new TextSetting(name, defaultValue, description);

    Setting.call(this, name, defaultValue, description, SettingTypes.TEXT);
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

/**
 * Enum for settings types. Used to determine how to display on menu / validate etc.
 * @readonly
 * @enum {number}
 */
const SettingTypes = Object.freeze({
    TEXT: 1,
    BOOL: 2,
});
