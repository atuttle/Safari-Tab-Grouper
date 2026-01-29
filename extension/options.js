// Tab Grouper Options

const DEFAULT_MATCH_MODE = 'exact';

async function loadSettings() {
  const data = await browser.storage.local.get('matchMode');
  const matchMode = data.matchMode || DEFAULT_MATCH_MODE;

  const radio = document.querySelector(`input[value="${matchMode}"]`);
  if (radio) {
    radio.checked = true;
    updateSelectedState(matchMode);
  }
}

function updateSelectedState(value) {
  document.querySelectorAll('.option').forEach(option => {
    option.classList.toggle('selected', option.dataset.value === value);
  });
}

function showSavedMessage() {
  const msg = document.getElementById('savedMessage');
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 2000);
}

async function saveSettings(matchMode) {
  await browser.storage.local.set({ matchMode });
  updateSelectedState(matchMode);
  showSavedMessage();
}

document.querySelectorAll('input[name="matchMode"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    saveSettings(e.target.value);
  });
});

loadSettings();
