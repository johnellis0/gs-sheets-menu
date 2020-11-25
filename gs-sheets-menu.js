function SheetMenu(sheetName, ...settings){
    this.sheetName = sheetName;
    this.settings = settings;
}
SheetMenu.prototype = {
    structure: undefined,

    getStructure: function(){
        var structure = {};
        var row = 1;

        this.settings.forEach((setting) => {
            structure[setting.name] = row;
            row += setting.getSize().rows;
        })

        return structure;
    }
}

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