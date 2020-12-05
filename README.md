# Google Scripts Spreadsheet Menu
Google Apps Script for Google Sheets that adds the ability to create a sheet based settings menu.

Allows settings to be stored on the spreadsheet so that they are accessible to running scripts but also editable by users without needing to edit any code in the scripts editor.

Many Google Scripts will depend on options that may need to be changed over the lifetime of a script. 
Many users will not be programmers and expecting them to use the script editor to edit options/settings is not feasible.
Using this project to create a settings menu on a sheet allows for both users and running scripts to access settings easily and quickly.

# Basic Usage

First, add `src/gs-sheets-menu.js` to your Google Scripts project.

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
var foo = menu.get("Setting 1"); // == "Value 1"

var bar = menu.get("Setting 3"); // == false
```

## Using ENUMs for setting names

The names of the settings you want to appear on the menu may not be convenient to use in the code.

The following example demonstrates a method that combines ease of programming with ease of use.

```javascript
var settings = {
    FOO: "More descriptive name",
    BAR: "Another descriptive name",
}

const menu = SheetMenu(options,
    TextSetting(settings.FOO, "Value 1", "Description"),
    TextSetting(settings.BAR, "Value 2", "Description")
);

var value = menu.get(settings.FOO);
```

## First run & menu creation

The menu sheet will be created if it does not already exist the first time a `SettingMenu` object is instantiated.

If you want to create the menu before running any code you will need to create an empty macro you can run from in the spreadsheet itself.

# API Reference
## Classes

<dl>
<dt><a href="#SheetMenu">SheetMenu</a></dt>
<dd></dd>
<dt><a href="#TextSetting">TextSetting</a> ⇐ <code><a href="#new_Setting_new">Setting</a></code></dt>
<dd></dd>
<dt><a href="#CheckboxSetting">CheckboxSetting</a> ⇐ <code><a href="#new_Setting_new">Setting</a></code></dt>
<dd></dd>
<dt><a href="#DropdownSetting">DropdownSetting</a> ⇐ <code><a href="#new_Setting_new">Setting</a></code></dt>
<dd></dd>
</dl>

<a name="SheetMenu"></a>

## SheetMenu
**Kind**: global class  

* [SheetMenu](#SheetMenu)
    * [new SheetMenu(options, ...settings)](#new_SheetMenu_new)
    * [.draw()](#SheetMenu+draw)
    * [.get(settingName)](#SheetMenu+get) ⇒ <code>\*</code>
    * [.getAll()](#SheetMenu+getAll) ⇒ <code>Array.&lt;Array.&lt;String&gt;&gt;</code>

<a name="new_SheetMenu_new"></a>

### new SheetMenu(options, ...settings)
Create SheetMenu instance


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Optional options object |
| ...settings | [<code>Setting</code>](#new_Setting_new) | List of Setting's as arguments. Can be TextSetting's, CheckboxSetting's, DropdownSetting's |

**Example**  
```js
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
<a name="SheetMenu+draw"></a>

### sheetMenu.draw()
Creates menu sheet & draws out menu, with the *default* setting values.

The menu will automatically be drawn if it does not exist when the SheetMenu object is instantiated.

Only call this function yourself if you wish to re-draw the menu, eg. to reset all settings.

**Kind**: instance method of [<code>SheetMenu</code>](#SheetMenu)  
**Example**  
```js
const menu = SheetMenu(options, settings);

function resetSettings(){
    menu.draw(); // Re-create menu with default settings
}
```
<a name="SheetMenu+get"></a>

### sheetMenu.get(settingName) ⇒ <code>\*</code>
Returns value of setting with `settingName`

**Kind**: instance method of [<code>SheetMenu</code>](#SheetMenu)  
**Returns**: <code>\*</code> - Value of setting from sheet menu  

| Param | Type | Description |
| --- | --- | --- |
| settingName | <code>string</code> | Name of setting |

**Example**  
```js
const menu = SheetMenu(options,
    CheckboxSetting("FOO", false, "Example 3")
);

menu.get("FOO"); // Returns value of setting 'FOO'
```
<a name="SheetMenu+getAll"></a>

### sheetMenu.getAll() ⇒ <code>Array.&lt;Array.&lt;String&gt;&gt;</code>
Get all settings & their values

**Kind**: instance method of [<code>SheetMenu</code>](#SheetMenu)  
**Returns**: <code>Array.&lt;Array.&lt;String&gt;&gt;</code> - Array of [Name, Value] pairs for all settings  
**Example**  
```js
const menu = SheetMenu(options,
    TextSetting("Setting 1", "Value 1", "Example 1"),
    TextSetting("Setting 2", "Value 2", "Example 2"),
    CheckboxSetting("Setting 3", false, "Example 3"),
    DropdownSetting("Setting 4", [1,2,3,4,5], "Example 4")
);

var key_values = menu.getAll();
Logger.log(key_values[1]) // ["Setting 2", "Value 2"]
```
<a name="TextSetting"></a>

## TextSetting ⇐ [<code>Setting</code>](#new_Setting_new)
**Kind**: global class  
**Extends**: [<code>Setting</code>](#new_Setting_new)  
<a name="new_TextSetting_new"></a>

### new TextSetting(name, defaultValue, description)
TextSetting allows any value to be entered and is displayed as a normal cell on the sheet menu.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of setting |
| defaultValue | <code>string</code> | Default value |
| description | <code>string</code> | Displayed in the description column on the settings sheet |

<a name="CheckboxSetting"></a>

## CheckboxSetting ⇐ [<code>Setting</code>](#new_Setting_new)
**Kind**: global class  
**Extends**: [<code>Setting</code>](#new_Setting_new)  
<a name="new_CheckboxSetting_new"></a>

### new CheckboxSetting(name, defaultValue, description)
CheckboxSetting allows only true/false values and is displayed as a checkbox on the sheet menu.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of setting |
| defaultValue | <code>boolean</code> | <code>false</code> | Default value |
| description | <code>string</code> |  | Displayed in the description column on the settings sheet |

<a name="DropdownSetting"></a>

## DropdownSetting ⇐ [<code>Setting</code>](#new_Setting_new)
**Kind**: global class  
**Extends**: [<code>Setting</code>](#new_Setting_new)  
<a name="new_DropdownSetting_new"></a>

### new DropdownSetting(name, possibleValues, description)
DropdownSetting allows only certain values and is displayed as a cell with a dropdown on the sheet menu.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of setting |
| possibleValues | <code>Array.&lt;string&gt;</code> | Array of available values. First value is taken as the default |
| description | <code>string</code> | Displayed in the description column on the settings sheet |


#About
### Authors
 - John Ellis - [GitHub](https://github.com/johnellis0) / [Portfolio](https://johnellis.dev)

### License
Released under [MIT](/LICENSE)
