/* 
Licensed under the MIT license (MIT): http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2015 Chiun Hau You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var UPDATE_INTERVAL = 3;//sec
var IDLE_TIME = 30;//sec
var apps;

function updateLocal(domain) {
  if (!apps[domain]) {
    console.log("going to create this domain: " + domain);
    apps[domain] = { sumTime: UPDATE_INTERVAL }
  }
  else {
    apps[domain].sumTime += UPDATE_INTERVAL;
  }
  localStorage.setItem('apps', JSON.stringify(apps));
}

function initial() {
  if (!localStorage.getItem('apps')) {
    console.log("no apps in local");
    localStorage.setItem('apps', JSON.stringify({}));
  }
  apps = JSON.parse(localStorage.getItem('apps'));
  if(!localStorage.getItem('start')) {
    console.log("no started time");
  }
}

function update() {
  chrome.idle.queryState(IDLE_TIME, function(state) {
    if (state === "active") {
      chrome.tabs.query({ "active": true, "lastFocusedWindow": true}, function(tabs) {
        if (tabs.length === 0) {
          console.log("no tabs active...");
          return;
        }
        else {
          chrome.windows.get(tabs[0].windowId, function(currentWindow) {
            if (currentWindow.focused == true) {
              var domain = extractDomain(tabs[0].url);
              updateLocal(domain);
            }
          });
        }
      });
    }
    else {
      console.log("idle, nothing to track");
    }
  });
}

function extractDomain(url) {
  if (url.indexOf("file://") === 0) {
    return "localhost"
  }
  else {
    var link = document.createElement('a');
    link.href = url;
    if (link.hostname === "newtab") {
      return "Time Flow"
    }
    else {
      return link.hostname
    }
  }
}

initial();
setInterval(function() { update() }, UPDATE_INTERVAL * 1000);
