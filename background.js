// background.js - Service Worker for Cookie Insight Dashboard
// Runs in background, handles cookie operations and communicates with popup

console.log('Cookie Insight Dashboard background service worker loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message.type);

  if (message.type === 'getAllCookies') {
    // Fetch all cookies (requires "cookies" permission and "<all_urls>" host permission)
    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting cookies:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      // Truncate long values for display
      const safeCookies = cookies.map(cookie => ({
        domain: cookie.domain,
        name: cookie.name,
        value: cookie.value.length > 100 ? cookie.value.substring(0, 97) + '...' : cookie.value,
        expirationDate: cookie.expirationDate 
          ? new Date(cookie.expirationDate * 1000).toLocaleString() 
          : 'Session cookie',
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        storeId: cookie.storeId
      }));

      sendResponse({ success: true, cookies: safeCookies });
    });

    // Return true to indicate async response
    return true;
  }

  if (message.type === 'deleteCookie') {
    const { url, name } = message;

    chrome.cookies.remove({ url, name }, (details) => {
      if (chrome.runtime.lastError) {
        console.error('Delete failed:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }
      console.log(`Deleted cookie: ${name} from ${url}`);
      sendResponse({ success: true });
    });

    return true;
  }

  if (message.type === 'bulkDelete') {
    const { cookies } = message; // array of {url, name}

    let deletedCount = 0;
    let failed = [];

    const deleteNext = () => {
      if (cookies.length === 0) {
        sendResponse({ success: true, deleted: deletedCount, failed });
        return;
      }

      const { url, name } = cookies.shift();
      chrome.cookies.remove({ url, name }, (details) => {
        if (chrome.runtime.lastError) {
          failed.push({ name, error: chrome.runtime.lastError.message });
        } else {
          deletedCount++;
        }
        deleteNext();
      });
    };

    deleteNext();
    return true;
  }

  // Unknown message type
  sendResponse({ success: false, error: 'Unknown message type' });
  return true;
});

// Optional: Log when extension is installed/updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed for the first time');
  } else if (details.reason === 'update') {
    console.log('Extension updated from version', details.previousVersion);
  }
});

// Optional: Keep alive or handle long-lived connections if needed
// (Manifest V3 service workers are event-driven, so usually no need)