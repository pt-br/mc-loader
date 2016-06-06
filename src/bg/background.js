$(function() {
  // Reload the page onConnect to extension
  chrome.extension.onConnect.addListener(function(port) {
    console.log("Connected...");
    port.onMessage.addListener(function(projectUrl) {
      console.log("New project set: "+ projectUrl);
      chrome.tabs.reload();
    });
  });

  /**
    *
    * Get the domain, replacing unecessary stuff to get a clean URL.
    *
    */
  function domain(url) {
    var domain = url.indexOf("://") > -1 ? url.split('/')[2] : url.split('/')[0];
    domain = domain.replace(/www./, '');
    return domain.split(':')[0];
  }

  /**
    *
    * Escape a url to be transformed into a regex.
    *
    */
  function proccessUrl(url) {
    url = url.replace(/(\W)/g, '\\$1');
    return url;
  }

  /**
    *
    * Checks if the value of 'moovcheckout_project' on localStorage matches the current url.
    * If yes, send a response to inject.js to inject experience.js
    *
    */
  function checkImport(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      var url = domain(tab.url);
      var moovProject = localStorage.getItem('moovcheckout_project');
      var removeScript = localStorage.getItem('moovcheckout_removeprodscript');
      var injectWorkbench = localStorage.getItem('moovcheckout_injectWorkbench');
      var readyUrl = proccessUrl(moovProject);
      var urlRegex = new RegExp(readyUrl);
      if (url.match(urlRegex)) {
        chrome.tabs.sendMessage(tabId, { action: "mc" + ('import'), removeScript: removeScript, injectWorkbench: injectWorkbench }, function(response) {});
      }
    }
  }

  chrome.tabs.onUpdated.addListener(checkImport);
});
