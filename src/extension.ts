/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import { ExtensionContext, StatusBarAlignment, window, StatusBarItem, Selection, workspace, TextEditor, commands } from 'vscode';
import * as si from 'systeminformation';

var cc = 0;
var hh = null;
export function activate(context: ExtensionContext) {
    const status = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    status.command = 'extension.4x0v7.about';
    context.subscriptions.push(status);

    /*
    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => updateStatus(status)));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(e => updateStatus(status)));
    context.subscriptions.push(window.onDidChangeTextEditorViewColumn(e => updateStatus(status)));
    context.subscriptions.push(workspace.onDidOpenTextDocument(e => updateStatus(status)));
    context.subscriptions.push(workspace.onDidCloseTextDocument(e => updateStatus(status)));
    */

    context.subscriptions.push(commands.registerCommand('extension.4x0v7.toggleNrtxm', () => {
      toggleNrtxm(status);
    }));
    
    context.subscriptions.push(commands.registerCommand('extension.4x0v7.about', () => {
      window.showInformationMessage('Hello 4x0v7 Research');
    }));

    console.log('activated');
    toggleNrtxm(status);
}

function toggleNrtxm(status) {
  if (hh) {
    updateText('', status);
    clearInterval(hh);
    hh = null;
  } else {
    hh = setInterval(function () {
      updateStatus(status);
    }, 3000);
  }
}

function convert(v: number, cb: { (v: number, unit: string, emoji: string): void; (v: number, unit: string, emoji: string): void; (arg0: number, arg1: string, arg2: string): void; }) {
    v = Math.floor(v);
    let kb = 1024;
    let mb = 1024 * 1024;
    let gb = 1024 * 1024 * 1024;
    if (v > gb) {
        cb(Math.floor(v / gb * 100) / 100, 'GiB', '🚀');
    } else if (v > mb) {
        cb(Math.floor(v / mb * 100) / 100, 'MiB', '🚗');
    } else if (v > kb) {
        cb(Math.floor(v / kb * 100) / 100, 'KiB', '🚲');
    } else {
        cb(v, 'B', '🏃');
    }
}

function updateStatus(status: StatusBarItem): void {
    let rateLine = '';
    si.networkStats().then(data => {
        /*
        convert(data.rx, function (v, unit) {
            rateLine = 'RX ' + v + ' ' + unit;
        });
        convert(data.tx, function (v, unit) {
            rateLine += ' ';
            rateLine += 'TX ' + v + ' ' + unit;
        });
        */
        convert(data[0].rx_sec, function (v: number, unit: string, emoji: string) {
            rateLine += ' ';
            rateLine += 'RX ' + emoji + ' ' + v + ' ' + unit + '/S';
        });
        convert(data[0].tx_sec, function (v: number, unit: string, emoji: string) {
            rateLine += ' ';
            rateLine += 'TX ' + emoji + ' ' + v + ' ' + unit + '/S';
        });
        updateText(rateLine, status);
    });

}
function updateText(text: string, status: StatusBarItem) {
    if (text) {
        //status.text = '$(megaphone) ' + ' ' + emoji[i % 3] + ' ' + text[i];
        status.text = text;
    }

    if (text) {
        status.show();
    } else {
        status.hide();
    }
}
