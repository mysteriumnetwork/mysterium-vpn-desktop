#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

const app = Application.currentApplication()
app.includeStandardAdditions = true

const result = app.displayDialog('Mysterium Dark would like to install a helper utility. Please enter your password to continue.', {
    defaultAnswer: '',
    withTitle: "MysteriumDark",
    withIcon: 'note',
    buttons: ['Cancel', 'Ok'],
    defaultButton: 'Ok',
    hiddenAnswer: true,
})

if (result.buttonReturned === 'Ok') {
    result.textReturned
} else {
    $.exit(255)
}
