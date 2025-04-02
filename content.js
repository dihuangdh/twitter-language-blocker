// Language detection patterns
const languagePatterns = {
  chinese: /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/,
  arabic: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  russian: /[\u0400-\u04FF\u0500-\u052F]/,
  japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
  korean: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F]/
};

// Store the blocked languages
let blockedLanguages = {};

// Function to check if text contains any of the blocked languages
function containsBlockedLanguage(text) {
  if (!text) return false;
  
  for (const language in blockedLanguages) {
    if (blockedLanguages[language] && languagePatterns[language] && languagePatterns[language].test(text)) {
      return true;
    }
  }
  return false;
}

// Function to process tweets and hide those in blocked languages
function processTweets() {
  // Get all tweets on the page
  // Twitter's DOM structure might change, so this selector may need to be updated
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  
  tweets.forEach(tweet => {
    // Get the text content of the tweet
    const tweetText = tweet.querySelector('[data-testid="tweetText"]')?.textContent || '';
    
    // Check if the tweet contains any blocked language
    if (containsBlockedLanguage(tweetText)) {
      // Add a blocked class to hide the tweet
      tweet.style.display = 'none';
    } else {
      // Make sure the tweet is visible (in case it was hidden before)
      tweet.style.display = '';
    }
  });
}

// Function to start observing the timeline for new tweets
function setupObserver() {
  // Create a new observer to watch for new tweets being added
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldProcess = true;
      }
    });
    
    if (shouldProcess) {
      processTweets();
    }
  });
  
  // Start observing the timeline
  const timeline = document.querySelector('div[data-testid="primaryColumn"]');
  if (timeline) {
    observer.observe(timeline, { childList: true, subtree: true });
  }
}

// Initialize the extension
function initialize() {
  // Load blocked languages from storage
  chrome.storage.sync.get(['blockedLanguages'], function(result) {
    blockedLanguages = result.blockedLanguages || {};
    
    // Process existing tweets immediately after getting settings
    processTweets();
    
    // Set up observer for new tweets
    setupObserver();
    
    // Periodically process tweets to ensure none are missed
    // This helps when navigating between pages on Twitter
    setInterval(processTweets, 2000);
  });
}

// Initialize as soon as the content script loads
initialize();

// Also initialize when the document is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateBlocking") {
    blockedLanguages = message.blockedLanguages || {};
    processTweets();
  }
}); 