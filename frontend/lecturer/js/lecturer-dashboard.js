import { requireAuth, authFetch, lecturerLogout } from './auth.js';

const API_BASE = 'http://localhost:5000';

async function init() {
  const user = await requireAuth();   // Tự redirect login nếu 401
  if (!user) return;

  document.getElementById('welcomeName').textContent = `Xin chào, ${user.hoTen}!`;
  document.getElementById('sidebarName').textContent = user.hoTen;

  const avatarEl = document.getElementById('sidebarAvatar');
  if (user.anhUrl) {
    avatarEl.innerHTML = `<img src="${API_BASE}/${user.anhUrl}" alt="${user.hoTen}" onerror="this.parentNode.textContent='${user.hoTen[0]}'">`;
  } else {
    avatarEl.textContent = user.hoTen ? user.hoTen[0].toUpperCase() : '?';
  }

  if (user.phaDoiMk) {
    document.getElementById('changePwBanner').style.display = 'flex';
  }
}

document.getElementById('btnLogout').addEventListener('click', () => lecturerLogout());

init();
