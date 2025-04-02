document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings when popup opens
  chrome.storage.sync.get(['blockedLanguages'], function(result) {
    const blockedLanguages = result.blockedLanguages || {};
    
    // Check boxes based on saved settings
    document.querySelectorAll('.language-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = blockedLanguages[checkbox.id] || false;
    });
  });

  // Save settings when button is clicked
  document.getElementById('save').addEventListener('click', function() {
    const blockedLanguages = {};
    
    // Collect all checked languages
    document.querySelectorAll('.language-option input[type="checkbox"]').forEach(checkbox => {
      blockedLanguages[checkbox.id] = checkbox.checked;
    });
    
    // Save to chrome storage
    chrome.storage.sync.set({blockedLanguages: blockedLanguages}, function() {
      // Show saved message
      const status = document.getElementById('status');
      status.textContent = 'Settings saved!';
      
      // Clear the message after 1.5 seconds
      setTimeout(function() {
        status.textContent = '';
      }, 1500);
      
      // Trigger content script to update blocking without requiring page refresh
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "updateBlocking", blockedLanguages: blockedLanguages});
        }
      });
    });
  });
}); 