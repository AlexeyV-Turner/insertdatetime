// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// used for Year Progress bar calculation 
// calculated number of days in the current year
function daysInYear(year) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
};

// used for Year Progress Bar
// calculates a number of days passed since a year beginning 
function daysPassed(dt) {
    var current = new Date(dt.getTime());
    var previous = new Date(dt.getFullYear(), 0, 1);

    return Math.ceil((current - previous + 1) / 86400000);
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "insertdatetime" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.insertDateTime', function () {
        // The code you place here will be executed every time your command is executed

        var editor = vscode.window.activeTextEditor;
        var doc = editor.document;
        var selections = editor.selections;

        // calculating Year Progress in percent
        var current_percent;
        current_percent = daysPassed(new Date())/daysInYear((new Date()).getFullYear())*100;
        const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

        editor.edit(function (editBuilder) {
            for(var i = 0; i < selections.length; i++){
                //var locale = vscode.workspace.getConfiguration('insertDateTime')['locale'];
                var locale = "en-UK";
        
		var d = new Date;
                // var txt = weekday[d.getDay()]

                if(locale != '')
                    // var txt = txt + ", " + d.toLocaleString(locale);
                    var txt = d.toLocaleString(locale);
                else
                    // var txt = txt + ", " + d.toLocaleString();
                    var txt = d.toLocaleString();
                               
                var weekNumber = Math.ceil(daysPassed(d) / 7)
                var quarterNumber = Math.floor((d.getMonth() + 3) / 3);

                var txt = txt + ", " + weekday[d.getDay()] + " | W:" + weekNumber  + " | Q:" + quarterNumber + " | Y:[";
                // adding Year Progress Bar
                for (n = 0; n < 50; n++) {
                    if (current_percent < (n+1)*2) {
                        var txt = txt + "░"; // alt-176 
                    }
                    else {
                        var txt = txt + "▓"; // alt-178
                    }    
                    };
                var txt = txt + "] " + parseFloat(current_percent).toFixed(1)+'%';

                editBuilder.replace(selections[i], "");
                editBuilder.insert(selections[i].active, txt);
            }
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
