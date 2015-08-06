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
    return "local_file"
  }
  else {
    var link = document.createElement('a');
    link.href = url;
    if (link.hostname === "newtab") {
      return "TimeFlow"
    }
    else {
      return link.hostname
    }
  }
}

initial();
setInterval(function() { update() }, UPDATE_INTERVAL * 1000);
