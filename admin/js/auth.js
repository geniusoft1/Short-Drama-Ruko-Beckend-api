/**
 * Ruko Admin - Auth Guard & UI Utilities
 */

// ==================== AUTH ====================
function isLoggedIn() {
  return !!localStorage.getItem('ruko_token');
}

function getAdmin() {
  try { return JSON.parse(localStorage.getItem('ruko_admin') || '{}'); } catch { return {}; }
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/admin/index.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('ruko_token');
  localStorage.removeItem('ruko_admin');
  window.location.href = '/admin/index.html';
}

// ==================== SIDEBAR INIT ====================
function initSidebar() {
  if (!requireAuth()) return false;

  const admin = getAdmin();
  
  // Set admin info
  const nameEl = document.getElementById('admin-username');
  const roleEl = document.getElementById('admin-role');
  const avatarEl = document.getElementById('admin-avatar');
  
  if (nameEl) nameEl.textContent = admin.username || 'Admin';
  if (roleEl) roleEl.textContent = admin.role || 'Administrator';
  if (avatarEl) avatarEl.textContent = (admin.username || 'A')[0].toUpperCase();

  // Active nav item
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

  return true;
}

// ==================== TOAST NOTIFICATIONS ====================
function toast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 350);
  }, 3500);
}

// ==================== MODAL UTILITIES ====================
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ==================== COPY TO CLIPBOARD ====================
async function copyToClipboard(text, btn) {
  const original = btn.textContent;
  const onSuccess = () => {
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = original, 2000);
    toast('Copied to clipboard!', 'success');
  };

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess();
      return;
    } catch (err) {
      console.warn('Clipboard API failed', err);
    }
  }

  // Fallback for non-HTTPS environments
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    textArea.remove();
    
    if (successful) {
      onSuccess();
    } else {
      toast('Failed to copy', 'error');
    }
  } catch (err) {
    console.error('Fallback clipboard failed', err);
    toast('Failed to copy', 'error');
  }
}

// ==================== FORMAT HELPERS ====================
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
}

function genresBadges(genres) {
  if (!genres || !genres.length) return '<span class="text-muted">—</span>';
  return genres.slice(0, 2).map(g => `<span class="badge badge-primary">${g}</span>`).join(' ');
}

function statusBadge(status) {
  const map = {
    'Ongoing': 'badge-success',
    'Completed': 'badge-info',
    'success': 'badge-success',
    'failed': 'badge-danger',
    'running': 'badge-warning',
    'never': 'badge-secondary',
  };
  return `<span class="badge ${map[status] || 'badge-secondary'}">${status}</span>`;
}

// ==================== LOADING STATE ====================
function setLoading(btnEl, loading) {
  if (loading) {
    btnEl._origHTML = btnEl.innerHTML;
    btnEl.innerHTML = '<span class="spinner"></span> Loading...';
    btnEl.disabled = true;
  } else {
    btnEl.innerHTML = btnEl._origHTML || btnEl.innerHTML;
    btnEl.disabled = false;
  }
}

// ==================== DEBOUNCE ====================
function debounce(fn, delay = 400) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// Expose globals
window.toast = toast;
window.openModal = openModal;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.formatDate = formatDate;
window.formatNumber = formatNumber;
window.genresBadges = genresBadges;
window.statusBadge = statusBadge;
window.setLoading = setLoading;
window.debounce = debounce;
window.logout = logout;
window.initSidebar = initSidebar;
window.getAdmin = getAdmin;
