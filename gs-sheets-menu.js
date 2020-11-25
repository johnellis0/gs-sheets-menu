function SheetMenu(sheetName, ...settings){
    this.sheetName = sheetName;
    this.settings = settings;
}
SheetMenu.prototype = {
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