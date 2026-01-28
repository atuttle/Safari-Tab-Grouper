// Tab Grouper Popup Script

document.addEventListener('DOMContentLoaded', () => {
  const groupBtn = document.getElementById('groupBtn');
  const resultDiv = document.getElementById('result');
  const statusDiv = document.getElementById('status');

  // Handle group button click
  groupBtn.addEventListener('click', async () => {
    groupBtn.disabled = true;
    groupBtn.textContent = 'Grouping...';

    try {
      const response = await browser.runtime.sendMessage({ action: 'groupTabs' });

      if (response.success) {
        resultDiv.textContent = `Grouped ${response.tabCount} tabs by domain`;
        resultDiv.classList.remove('hidden', 'error');
        resultDiv.classList.add('success');
      }
    } catch (error) {
      resultDiv.textContent = 'Error grouping tabs';
      resultDiv.classList.remove('hidden', 'success');
      resultDiv.classList.add('error');
    }

    groupBtn.disabled = false;
    groupBtn.textContent = 'Group Tabs by Domain';

    // Hide result after 3 seconds
    setTimeout(() => {
      resultDiv.classList.add('hidden');
    }, 3000);
  });

  // Check for recent duplicate blocks
  async function checkStatus() {
    try {
      const response = await browser.runtime.sendMessage({ action: 'getStatus' });

      if (response.lastDuplicateBlocked) {
        const blocked = response.lastDuplicateBlocked;
        const timeSince = Date.now() - blocked.timestamp;

        // Show if blocked within last 30 seconds
        if (timeSince < 30000) {
          const url = new URL(blocked.url);
          statusDiv.textContent = `Recently blocked duplicate: ${url.hostname}${url.pathname.slice(0, 20)}...`;
          statusDiv.classList.remove('hidden');
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }

  checkStatus();
});
