var port = chrome.extension.connect({name: 'urlPort'});

$(function() {

  // This is the switch button of the popup
  var state = document.querySelector('#switch');
  var removeProdScript = document.querySelector('#removeProdScript');
  var injectWorkbench = document.querySelector('#injectWorkbenchScript');

  getOptions();

  getCurrentProject();

  /**
    *
    * Update the title of the extension(ON/OFF);
    *
    */
  function updateTitle(status) {
    chrome.browserAction.setTitle({
      title: 'MC: '+status,
    });

    chrome.browserAction.setBadgeText({
      text: status,
    });
  }

  /**
    *
    * Set a new entry to localStorage using 'moovcheckout_project' as key.
    * This stores the current project running.
    *
    */
  function updateProject(e) {
    var url = $('#projectUrl').val();

    localStorage.setItem('moovcheckout_project', url);

    port.postMessage(url);

    if(!state.checked) {
      $(state).click();
    }

    getOptions();

    getCurrentProject();

    e.preventDefault();
  }

  function getOptions() {
    var removeScriptVerify = localStorage.getItem('moovcheckout_removeprodscript');
    var injectVerify  = localStorage.getItem('moovcheckout_injectWorkbench');

    if( removeScriptVerify && removeScriptVerify === 'true' ) {
      removeProdScript.setAttribute('checked', '');
    } else {
      $(removeProdScript).removeAttr('checked');

    }

    if( injectVerify && injectVerify === 'true' ) {
      injectWorkbench.setAttribute('checked', '');
    } else {
      $(injectWorkbench).removeAttr('checked');
    }
  }

  /**
    *
    * Get the value of 'moovcheckout_project' key into localStorage.
    *
    */
  function getCurrentProject() {

    updateTitle('OFF');

    var moovProject = localStorage.getItem('moovcheckout_project');

    if(moovProject) {
      $('#runningProject').text(moovProject);
      $('#projectUrl').val(moovProject);
      state.setAttribute('checked', '');

      updateTitle('ON');
    } else {
      $(state).removeAttr('checked');
    }
  }

  // Initializing Switcherry plugin
  var init = new Switchery(state);
  var initR = new Switchery(removeProdScript);
  var initW = new Switchery(injectWorkbench);

  /**
    *
    * Verifies if the switch is on/off.
    * If this is off, remove the entry 'moovcheckout_project' from localStorage and
    * reset popup fields.
    *
    */
  state.onchange = function() {
    if(!state.checked) {
      localStorage.removeItem('moovcheckout_project');
      $('#projectUrl').val('');
      $('#runningProject').text('None');

      updateTitle('OFF');

      chrome.tabs.reload();
    }
  };

  removeProdScript.onchange = function() {
    if(removeProdScript.checked) {
      localStorage.setItem('moovcheckout_removeprodscript', 'true');
    } else {
      localStorage.removeItem('moovcheckout_removeprodscript');
    }
    chrome.tabs.reload();
  };

  injectWorkbench.onchange = function() {
    if(injectWorkbench.checked) {
      localStorage.setItem('moovcheckout_injectWorkbench', 'true');
    } else {
      localStorage.removeItem('moovcheckout_injectWorkbench');
    }
    chrome.tabs.reload();
  };

  $('#urlForm').on('submit', updateProject);
});
