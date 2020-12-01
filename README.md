# Google Scripts Spreadsheet Menu
Google Apps Script for Google Sheets that adds the ability to create a sheet based settings menu.

Allows settings to be stored on the spreadsheet so that they are accessible to running scripts but also editable by users without needing to edit any code in the scripts editor.

Many Google Scripts will depend on options that may need to be changed over the lifetime of a script. 
Many users will not be programmers and expecting them to use the script editor to edit options/settings is not feasible.
Using this project to create a settings menu on a sheet allows for both users and running scripts to access settings easily and quickly.

### SheetMenu

 ```javascript
const menu = SheetMenu(options, settings);
```

##### Parameters

Name | Type | Description
--- | --- | --- 
options | Object | Key-Value pairs of options
settings | Setting[] | Array of settings to have on menu

##### Options

Key | Default | Description
--- | --- | ---
sheetName | Settings | Name of sheet to put the menu on
sheetTitle | Settings Menu | Title to be displayed at top of settings sheet.
settingSpacing | 1 | Amount of empty lines to leave between different settings on the spreadsheet

### Menu Example

```javascript
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
 ```

This will produce the following menu on the sheet specified in the options.

![image](https://user-images.githubusercontent.com/34400721/100282158-09f12b00-2f63-11eb-9279-04d4c237162d.png)

The setting values can be retrieved from the menu as so

```javascript
var value = menu.get("Setting 1");
```

### Using ENUMs for setting names

The names of the settings you want to appear on the menu may not be convenient to use in the code.

The following example demonstrates a method that combines ease of programming with ease of use.

```javascript
var settings = {
    FOO: "More descriptive name",
}

const menu = SheetMenu(options,
    TextSetting(settings.FOO, "Value", "Description")
);

var value = menu.get(settings.FOO);
```

## Setting Types

#### Text Setting
` TextSetting(name, defaultValue, description) `

Freeform text entry.

##### Parameters

Name | Type | Description
--- | --- | --- 
name | String | Name of setting
defaultValue | String | Default value 
description | String | Description to display alongside setting in third column of menu sheet

#### Checkbox (boolean) Setting
` CheckboxSetting(name, defaultValue, description) `

Checkbox for true / false values.

##### Parameters

Name | Type | Description
--- | --- | --- 
name | String | Name of setting
defaultValue | Boolean | Default value (true/false)
description | String | Description to display alongside setting in third column of menu sheet


#### Dropdown (select) Setting
` DropdownSetting(name, possibleValues, description) `

Select option from list of possible values.

##### Parameters

Name | Type | Description
--- | --- | --- 
name | String | Name of setting
possibleValues | String[] | Array of available values. The first value in the array will be the default value
description | String | Description to display alongside setting in third column of menu sheet

