function manageScript(status, message) {
  var run = function () {
    var head = document.querySelector('head');

    var moovScript = document.createElement('script');
    var tempScript = document.getElementById('chrome-mc-dev-loader');
    var pageScripts = head.getElementsByTagName("script");

    moovScript.src = 'https://localhost:3443/moovcheckout.js';
    moovScript.id = "chrome-mc-dev-loader";

    if(status == 'import' && !tempScript) {
      if( pageScripts.length > 0 ) {
        document.head.insertBefore(moovScript, pageScripts[0]);
      } else {
        head.appendChild(moovScript);
      }
    } else if(status == 'not_import' && tempScript) {
      tempScript.parentNode.removeChild(tempScript);
    }
  }

  run();
};

function removeProductionScript(removeExisting) {
  var run = function () {
    if( removeExisting === 'true' ) {
      var scriptRemoved = false;
      var pageScripts = document.head.getElementsByTagName("script");
      var prodScriptRegex = new RegExp("mc\\-assets\\.moovweb.net\\/.+\\/moovcheckout\\.js");

      [].forEach.call(pageScripts, function(actualScript) {
        if( actualScript.hasAttribute("src") && actualScript.getAttribute("src") !== "" ) {
          var actualScriptSrc = actualScript.getAttribute("src").toString();
          if( actualScriptSrc !== "" && prodScriptRegex.test(actualScriptSrc) ) {
            try {
              actualScript.remove();
              console.log("[Production MC Script (" + actualScriptSrc + ") removed]");
            } catch(error) {
              console.log("[Production MC Script was not removed due to the following error: " + error.message + "]");
            }
          }
        }
      });
    }
  }

  run();
};

function injectWorkbenchScript() {
  var run = function () {
    var head = document.querySelector('head');
    var pageScripts = head.getElementsByTagName("script");
    var workbench = document.createElement('script');

    workbench.src = 'https://localhost:8443/js/workbench.js';
    workbench.id = 'mc-workbench';

    if( pageScripts.length > 0 ) {
      document.head.insertBefore(workbench, pageScripts[0]);
    } else {
      head.appendChild(workbench);
    }
  }
  run();
};

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  var action = msg.action.substr(2).toLowerCase();
  var removeScript = msg.removeScript;
  var injectWorkbench = msg.injectWorkbench;

  if( removeScript && removeScript === 'true' ) {
    removeProductionScript(removeScript);
  }

  if( injectWorkbench && injectWorkbench === 'true' && action == 'import') {
    injectWorkbenchScript();
  }

  console.log('[MoovCheckout Script Loader]' + action);
  manageScript(action);
});
