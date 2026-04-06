const api = typeof chrome !== "undefined" ? chrome : browser;

function getAllCookies() {
  return new Promise((resolve, reject) => {
    try {
      api.cookies.getAll({}, (cookies) => {
        if (api.runtime.lastError) reject(api.runtime.lastError);
        else resolve(cookies);
      });
    } catch (e) {
      api.cookies.getAll({}).then(resolve).catch(reject);
    }
  });
}

async function loadCookies() {
  const cookies = await getAllCookies();
  const tableBody = document.getElementById('cookieTableBody');
  tableBody.innerHTML = '';

  cookies.forEach(cookie => {
    const cookieUrl = (cookie.secure ? "https://" : "http://") + cookie.domain.replace(/^\./, "") + cookie.path;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${cookie.domain || 'N/A'}</td>
      <td>${cookie.name || 'N/A'}</td>
      <td>${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'}</td>
      <td>${cookie.secure ? 'Yes' : 'No'}</td>
      <td>
        <button class="delete-btn" data-url="${cookieUrl}" data-name="${cookie.name}" data-store="${cookie.storeId || ''}">Delete 🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  addEventListeners();
  searchCookies();
}

function addEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearFilteredBtn');
  const syncBtn = document.getElementById('syncBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  searchInput.addEventListener('input', searchCookies);
  clearBtn.addEventListener('click', clearFilteredCookies);
  syncBtn.addEventListener('click', syncToServer);
  logoutBtn.addEventListener('click', async () => {
    await window.logoutExt();
    document.getElementById('authSection').classList.remove('hidden');
    document.getElementById('mainSection').classList.add('hidden');
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', deleteCookie);
  });
}

async function deleteCookie(e) {
  const btn = e.target;
  const url = btn.dataset.url;
  const name = btn.dataset.name;
  const storeId = btn.dataset.store;

  api.cookies.remove({ url, name, storeId }, () => {
    btn.closest('tr').remove();
    searchCookies();
  });
}

function searchCookies() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.getElementById('cookieTableBody').rows;
  let visible = 0;
  for (let row of rows) {
    const domain = row.cells[0].textContent.toLowerCase();
    const name = row.cells[1].textContent.toLowerCase();
    if (domain.includes(input) || name.includes(input)) {
      row.style.display = '';
      visible++;
    } else row.style.display = 'none';
  }
  document.getElementById('clearFilteredBtn').disabled = visible === 0;
}

async function clearFilteredCookies() {
  const rows = Array.from(document.getElementById('cookieTableBody').rows);
  for (let row of rows) {
    if (row.style.display !== 'none') {
      const btn = row.querySelector('.delete-btn');
      await api.cookies.remove({ url: btn.dataset.url, name: btn.dataset.name, storeId: btn.dataset.store });
      row.remove();
    }
  }
}

async function syncToServer() {
  const cookies = await getAllCookies();
  const safeCookies = cookies.map(c => ({
    domain: c.domain,
    name: c.name,
    value: c.value.length > 100 ? c.value.substring(0, 97) + '...' : c.value,
    expirationDate: c.expirationDate ? new Date(c.expirationDate * 1000).toLocaleString() : 'Session',
    secure: c.secure,
    httpOnly: c.httpOnly,
    sameSite: c.sameSite
  }));

  try {
    await window.syncCookiesToServer(safeCookies);
    alert('✅ Cookies synced to your dashboard!');
  } catch (err) {
    alert('Sync failed: ' + err.message);
  }
}

// ================== AUTH FLOW ==================
document.addEventListener('DOMContentLoaded', async () => {
  const { token } = await chrome.storage.local.get('token');
  const authSection = document.getElementById('authSection');
  const mainSection = document.getElementById('mainSection');

  if (token) {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    loadCookies();
  } else {
    authSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
  }

  // Login
document.getElementById('loginBtn').addEventListener('click', async () => {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await window.loginExt(email, password);


    emailInput.value = '';
    passwordInput.value = '';

    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    loadCookies();
  } catch (e) {
    document.getElementById('authMessage').textContent = e.message;
  }
});

  // Register
document.getElementById('registerBtn').addEventListener('click', async () => {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await window.registerExt(email, password, 'User');


    emailInput.value = '';
    passwordInput.value = '';

    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    loadCookies();
  } catch (e) {
    document.getElementById('authMessage').textContent = e.message;
  }
});
});