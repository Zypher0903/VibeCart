// ============================================
//  VibeCart — auth.js
//  Client-side auth system using localStorage
//  Users, sessions, password hashing (SHA-256 via SubtleCrypto)
// ============================================

const Auth = (() => {
  const USERS_KEY   = 'vibecart_users';
  const SESSION_KEY = 'vibecart_session';

  // ---- helpers ----
  async function hashPassword(password) {
    const enc = new TextEncoder().encode(password + 'vc_salt_2026');
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
  function saveSession(user) {
    const session = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ---- public API ----
  return {
    // Register new user
    async register({ firstName, lastName, email, password }) {
      const users = getUsers();
      const key = email.toLowerCase().trim();
      if (users[key]) return { ok: false, error: 'An account with this email already exists.' };

      const hash = await hashPassword(password);
      const user = {
        id: 'u_' + Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: key,
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        orderCount: 0,
        wishlistCount: 0,
      };
      users[key] = user;
      saveUsers(users);
      return { ok: true, session: saveSession(user) };
    },

    // Login
    async login({ email, password, remember }) {
      const users = getUsers();
      const key = email.toLowerCase().trim();
      const user = users[key];
      if (!user) return { ok: false, error: 'No account found with this email.' };

      const hash = await hashPassword(password);
      if (hash !== user.passwordHash) return { ok: false, error: 'Incorrect password. Please try again.' };

      return { ok: true, session: saveSession(user) };
    },

    // Logout
    logout() {
      clearSession();
      window.location.href = 'index.html';
    },

    // Get current session (null if not logged in)
    getSession,

    // Is logged in?
    isLoggedIn() {
      return !!getSession();
    },

    // Update profile
    updateProfile({ firstName, lastName }) {
      const session = getSession();
      if (!session) return { ok: false };
      const users = getUsers();
      const user = users[session.email];
      if (!user) return { ok: false };
      user.firstName = firstName.trim();
      user.lastName = lastName.trim();
      saveUsers(users);
      saveSession(user);
      return { ok: true };
    },

    // Change password
    async changePassword({ currentPassword, newPassword }) {
      const session = getSession();
      if (!session) return { ok: false, error: 'Not logged in.' };
      const users = getUsers();
      const user = users[session.email];
      const currentHash = await hashPassword(currentPassword);
      if (currentHash !== user.passwordHash) return { ok: false, error: 'Current password is incorrect.' };
      user.passwordHash = await hashPassword(newPassword);
      saveUsers(users);
      return { ok: true };
    },

    // Display name helper
    displayName(session) {
      if (!session) return 'Account';
      return session.firstName || session.email.split('@')[0];
    },

    // Initials for avatar
    initials(session) {
      if (!session) return '?';
      return ((session.firstName?.[0] || '') + (session.lastName?.[0] || '')).toUpperCase() || session.email[0].toUpperCase();
    }
  };
})();

// ---- Nav injection: update header based on auth state ----
document.addEventListener('DOMContentLoaded', () => {
  const session = Auth.getSession();

  // Update account nav icon
  const accountLink = document.getElementById('navAccountLink') || document.querySelector('.nav-right a[aria-label="Account"]');
  if (accountLink) {
    if (session) {
      accountLink.href = 'account.html';
      accountLink.setAttribute('aria-label', 'My Account');
      accountLink.innerHTML = `<div class="nav-user-avatar" title="${session.firstName} ${session.lastName}">${Auth.initials(session)}</div>`;
    } else {
      accountLink.href = 'login.html';
    }
  }

  // Update drawer account link
  const drawerLink = document.getElementById('drawerAccountLink') || document.querySelector('.drawer-nav a[href="account.html"]');
  if (drawerLink) {
    if (session) {
      drawerLink.textContent = `Hi, ${session.firstName} →`;
      drawerLink.href = 'account.html';
    } else {
      drawerLink.textContent = 'Account';
      drawerLink.href = 'login.html';
    }
  }
});
