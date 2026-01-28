// Safari Tab Grouper - Background Service Worker
// Groups tabs by domain and limits duplicates to 3

const MAX_DUPLICATES = 1;

/**
 * Extract domain from URL
 */
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Get all tabs with matching exact URL
 */
async function getTabsWithUrl(url, windowId) {
  const tabs = await browser.tabs.query({ windowId });
  return tabs.filter(tab => tab.url === url);
}

/**
 * Check for duplicates and close if exceeds limit
 */
async function checkDuplicates(tabId, url) {
  if (!url || url.startsWith('about:') || url.startsWith('safari-')) {
    return;
  }

  const tab = await browser.tabs.get(tabId).catch(() => null);
  if (!tab) return;

  const matchingTabs = await getTabsWithUrl(url, tab.windowId);

  if (matchingTabs.length > MAX_DUPLICATES) {
    // Find the newest tab (highest id) that matches - should be the one just created/updated
    const sortedByAge = matchingTabs.sort((a, b) => b.id - a.id);
    const tabToClose = sortedByAge[0];
    const tabToActivate = sortedByAge[sortedByAge.length - 1]; // oldest tab

    // Close the newest duplicate
    await browser.tabs.remove(tabToClose.id);

    // Switch to an existing tab
    await browser.tabs.update(tabToActivate.id, { active: true });

    // Store notification for popup
    await browser.storage.local.set({
      lastDuplicateBlocked: {
        url: url,
        timestamp: Date.now()
      }
    });
  }
}

/**
 * Group all tabs in window by domain (sorts tabs alphabetically by domain)
 */
async function groupTabsByDomain(windowId) {
  const tabs = await browser.tabs.query({ windowId });

  // Filter out tabs without valid URLs
  const validTabs = tabs.filter(tab => {
    const domain = getDomain(tab.url);
    return domain !== null;
  });

  // Sort by domain alphabetically
  validTabs.sort((a, b) => {
    const domainA = getDomain(a.url) || '';
    const domainB = getDomain(b.url) || '';
    return domainA.localeCompare(domainB);
  });

  // Move tabs to their new positions
  for (let i = 0; i < validTabs.length; i++) {
    await browser.tabs.move(validTabs[i].id, { index: i });
  }

  return validTabs.length;
}

// Listen for new tabs
browser.tabs.onCreated.addListener(async (tab) => {
  if (tab.url) {
    await checkDuplicates(tab.id, tab.url);
  }
  if (tab.windowId) {
    await groupTabsByDomain(tab.windowId);
  }
});

// Listen for tab URL updates
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    await checkDuplicates(tabId, changeInfo.url);
  }
  // Re-sort when navigation completes
  if (changeInfo.status === 'complete' && tab.windowId) {
    await groupTabsByDomain(tab.windowId);
  }
});

// Handle messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'groupTabs') {
    browser.windows.getCurrent().then(async (window) => {
      const count = await groupTabsByDomain(window.id);
      sendResponse({ success: true, tabCount: count });
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === 'getStatus') {
    browser.storage.local.get('lastDuplicateBlocked').then((data) => {
      sendResponse({ lastDuplicateBlocked: data.lastDuplicateBlocked || null });
    });
    return true;
  }
});
