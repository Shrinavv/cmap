// extension/auth.js
const BACKEND_URL = 'http://localhost:5000/api';   // ← Change to production URL later

async function login(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  const data = await res.json();
  await chrome.storage.local.set({ token: data.token, user: data.user });
  return data;
}

async function register(email, password, name) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  const data = await res.json();
  await chrome.storage.local.set({ token: data.token, user: data.user });
  return data;
}

async function getToken() {
  const { token } = await chrome.storage.local.get('token');
  return token;
}

async function logout() {
  await chrome.storage.local.remove(['token', 'user']);
}

async function syncCookiesToServer(cookiesData) {
  const token = await getToken();
  if (!token) throw new Error('Please login first');
  const res = await fetch(`${BACKEND_URL}/cookies/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ cookies: cookiesData })
  });
  if (!res.ok) throw new Error('Sync failed');
  return res.json();
}

// Expose globally so popup.js can call them
window.loginExt = login;
window.registerExt = register;
window.logoutExt = logout;
window.syncCookiesToServer = syncCookiesToServer;