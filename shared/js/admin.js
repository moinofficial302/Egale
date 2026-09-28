'use strict';

/* Turns Firebase Auth error codes into plain-language messages */
function friendlyAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn\'t look right.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a bit and try again.';
    case 'auth/network-request-failed':
      return 'Network error — check your connection.';
    default:
      return 'Login failed. Please try again.';
  }
}

/* Guard for dashboard.html: redirect to login if not authenticated.
   There is no per-wedding ownership check anymore — this is a single
   shared admin panel, so any account that can sign in at all is
   trusted with every wedding (accounts are only ever created by you,
   via the Firebase Console). */
function requireAuth(onReady) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    onReady(user);
  });
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  });
}

/* ═══════════════════════════════
   ADMIN PWA INSTALL
═══════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../../sw.js')
      .then(reg => console.log('[Admin] Service worker registered:', reg.scope))
      .catch(err => console.warn('[Admin] Service worker registration failed:', err));
  });
}

let deferredAdminInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredAdminInstallPrompt = e;
  document.getElementById('admin-install-btn')?.classList.add('show');
});

function installAdminApp() {
  if (!deferredAdminInstallPrompt) return;
  deferredAdminInstallPrompt.prompt();
  deferredAdminInstallPrompt.userChoice.finally(() => {
    deferredAdminInstallPrompt = null;
    document.getElementById('admin-install-btn')?.classList.remove('show');
  });
}

window.addEventListener('appinstalled', () => {
  document.getElementById('admin-install-btn')?.classList.remove('show');
  deferredAdminInstallPrompt = null;
});


/* ═══════════════════════════════════════════════════
   DASHBOARD LOGIC (only auto-runs on dashboard.html —
   guarded via the dashboard-only #wedding-list element,
   which is what makes it safe to also load on login.html)
═══════════════════════════════════════════════════ */

let currentWeddingId = null;   // which wedding is currently open for editing

if (document.getElementById('wedding-list')) {
  requireAuth(() => {
    loadWeddingList();
  });
}

/* ═══════════════════════════════
   WEDDING LIST (the new home screen)
═══════════════════════════════ */
function loadWeddingList() {
  const listEl = document.getElementById('wedding-list');
  listEl.innerHTML = '<div class="spinner"></div>';

  db.collection('weddings').get()
    .then(snapshot => {
      if (snapshot.empty) {
        listEl.innerHTML = `<div class="empty-state"><span class="emoji">💍</span>No weddings yet — add one above.</div>`;
        return;
      }

      const weddings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Most recently updated first, so active work stays at the top
      weddings.sort((a, b) => {
        const at = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : 0;
        const bt = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : 0;
        return bt - at;
      });

      listEl.innerHTML = weddings.map(w => {
        const c = w.coupleNames || {};
        const names = (c.groomName || c.brideName)
          ? `${escapeHTML(c.groomName || '?')} &amp; ${escapeHTML(c.brideName || '?')}`
          : '(names not set yet)';
        const dateLabel = w.weddingDateISO ? formatDateShort(w.weddingDateISO) : 'Date not set';
        return `
          <div class="rsvp-card" style="cursor:pointer;" onclick='selectWedding(${JSON.stringify(w.id)})'>
            <div class="rsvp-top">
              <div>
                <div class="rsvp-name">${names}</div>
                <span class="rsvp-phone" style="text-decoration:none;">/${escapeHTML(w.id)}/</span>
              </div>
              <span class="rsvp-badge yes">${dateLabel}</span>
            </div>
          </div>`;
      }).join('');
    })
    .catch(err => {
      console.error('[Admin] Failed to load wedding list:', err);
      listEl.innerHTML = `<div class="empty-state"><span class="emoji">⚠️</span>Could not load weddings. Check your connection.</div>`;
    });
}

function formatDateShort(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function createNewWedding() {
  const idInput    = document.getElementById('new-wedding-id');
  const groomInput = document.getElementById('new-groom-name');
  const brideInput = document.getElementById('new-bride-name');
  const status     = document.getElementById('create-wedding-status');
  const btn        = document.getElementById('create-wedding-btn');

  const id = idInput.value.trim().toLowerCase();
  status.style.color = 'var(--no)';

  if (!id) { status.textContent = 'Enter a Wedding ID (the folder name).'; return; }
  if (!/^[a-z0-9-]+$/.test(id)) { status.textContent = 'Use only lowercase letters, numbers and hyphens.'; return; }

  btn.disabled = true;
  btn.textContent = 'Creating...';
  status.textContent = '';

  const docRef = db.collection('weddings').doc(id);
  docRef.get().then(existing => {
    if (existing.exists) {
      status.style.color = 'var(--no)';
      status.textContent = `"${id}" already exists — pick it from the list below instead.`;
      btn.disabled = false;
      btn.textContent = 'Create Wedding';
      return;
    }

    return docRef.set({
      coupleNames: {
        groomName: groomInput.value.trim(),
        brideName: brideInput.value.trim()
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      status.style.color = 'var(--ok)';
      status.textContent = `✓ "${id}" created — opening it now.`;
      idInput.value = ''; groomInput.value = ''; brideInput.value = '';
      selectWedding(id);
    });
  }).catch(err => {
    status.style.color = 'var(--no)';
    status.textContent = '✗ Could not create: ' + err.message;
  }).finally(() => {
    btn.disabled = false;
    btn.textContent = 'Create Wedding';
  });
}

function selectWedding(id) {
  currentWeddingId = id;
  document.getElementById('editing-wedding-label').textContent = `Editing: /${id}/`;
  document.getElementById('wedding-list-view').style.display = 'none';
  document.getElementById('wedding-edit-view').style.display = 'block';
  loadContentIntoEditor();
}

function backToList() {
  currentWeddingId = null;
  document.getElementById('wedding-edit-view').style.display = 'none';
  document.getElementById('wedding-list-view').style.display = 'block';
  loadWeddingList(); // refresh in case anything changed
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/* ═══════════════════════════════
   EDIT CONTENT TAB (scoped to currentWeddingId)
═══════════════════════════════ */
function loadContentIntoEditor() {
  // Clear any repeatable rows left over from the previously-open wedding
  document.getElementById('timeline-editor').innerHTML = '';
  document.getElementById('prewedding-editor').innerHTML = '';

  db.collection('weddings').doc(currentWeddingId).get()
    .then(doc => {
      const data = doc.exists ? doc.data() : {};
      const c = data.coupleNames || {};

      document.getElementById('c-groom-name').value      = c.groomName || '';
      document.getElementById('c-bride-name').value       = c.brideName || '';
      document.getElementById('c-groom-fullname').value   = c.groomFullName || '';
      document.getElementById('c-bride-fullname').value   = c.brideFullName || '';
      document.getElementById('c-groom-parent').value     = c.groomParent || '';
      document.getElementById('c-bride-parent').value     = c.brideParent || '';

      document.getElementById('c-whatsapp').value = data.whatsappNumber || '';

      document.getElementById('c-wedding-date').value = data.weddingDateISO ? toDatetimeLocal(data.weddingDateISO) : '';

      const venue = data.venue || {};
      document.getElementById('c-venue-name').value = venue.name || '';
      document.getElementById('c-venue-addr').value = venue.address || '';

      const timeline = data.timeline || [];
      timeline.forEach(item => addTimelineRow(item.title, item.time));

      const preWedding = data.preWeddingEvents || [];
      preWedding.forEach(item => addPreweddingRow(item.name, item.detail));

      document.getElementById('c-invitation-text').value = data.invitationText || '';
      document.getElementById('c-footer-message').value = data.footerMessage || '';

      initLivePreviews();
    })
    .catch(err => {
      console.error('[Admin] Failed to load content:', err);
      document.getElementById('save-status').textContent = 'Could not load current content.';
    });
}

function toDatetimeLocal(isoString) {
  const d = new Date(isoString);
  if (isNaN(d)) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ── Timeline repeatable rows ── */
function addTimelineRow(title = '', time = '') {
  const wrap = document.createElement('div');
  wrap.className = 'repeat-item';
  wrap.innerHTML = `
    <button type="button" class="repeat-remove" onclick="this.parentElement.remove(); renderTimelinePreview();">✕</button>
    <div class="form-group">
      <label class="form-label">Event Title</label>
      <input type="text" class="form-input tl-title-input" placeholder="Wedding Ceremony" value="${escapeAttr(title)}">
    </div>
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">Date &amp; Time Text</label>
      <input type="text" class="form-input tl-time-input" placeholder="15 Jun 2026 · 5:00 PM" value="${escapeAttr(time)}">
    </div>
  `;
  document.getElementById('timeline-editor').appendChild(wrap);
  renderTimelinePreview();
}

/* ── Pre-wedding repeatable rows ── */
function addPreweddingRow(name = '', detail = '') {
  const wrap = document.createElement('div');
  wrap.className = 'repeat-item';
  wrap.innerHTML = `
    <button type="button" class="repeat-remove" onclick="this.parentElement.remove(); renderPreweddingPreview();">✕</button>
    <div class="form-group">
      <label class="form-label">Event Name</label>
      <input type="text" class="form-input pw-name-input" placeholder="Mehendi" value="${escapeAttr(name)}">
    </div>
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">Details</label>
      <input type="text" class="form-input pw-detail-input" placeholder="13 Jun 2026 · 3:00 PM at Bride's Home" value="${escapeAttr(detail)}">
    </div>
  `;
  document.getElementById('prewedding-editor').appendChild(wrap);
  renderPreweddingPreview();
}

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;');
}

/* ═══════════════════════════════
   LIVE PREVIEWS
═══════════════════════════════ */
function initLivePreviews() {
  const bind = (id, cb) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', cb);
  };

  function updateHeroPreview() {
    document.getElementById('prev-hero-groom').textContent =
      document.getElementById('c-groom-name').value.trim() || '—';
    document.getElementById('prev-hero-bride').textContent =
      document.getElementById('c-bride-name').value.trim() || '—';
  }

  function updateNamesPreview() {
    document.getElementById('prev-groom-fullname').textContent =
      document.getElementById('c-groom-fullname').value.trim() || '—';
    document.getElementById('prev-groom-parent').textContent =
      document.getElementById('c-groom-parent').value.trim();
    document.getElementById('prev-bride-fullname').textContent =
      document.getElementById('c-bride-fullname').value.trim() || '—';
    document.getElementById('prev-bride-parent').textContent =
      document.getElementById('c-bride-parent').value.trim();
  }

  function updateDatePreview() {
    const val = document.getElementById('c-wedding-date').value;
    if (!val) return;
    const d = new Date(val);
    if (isNaN(d)) return;
    document.getElementById('prev-date-text').textContent =
      d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    document.getElementById('prev-date-sub').textContent = `${dayName} · ${time}`;
  }

  function updateVenuePreview() {
    document.getElementById('prev-venue-name').textContent =
      document.getElementById('c-venue-name').value.trim() || '—';
    document.getElementById('prev-venue-addr').textContent =
      document.getElementById('c-venue-addr').value.trim();
  }

  function updateInvitePreview() {
    document.getElementById('prev-invitation-text').textContent =
      document.getElementById('c-invitation-text').value.trim();
  }

  function updateFooterPreview() {
    document.getElementById('prev-footer-message').textContent =
      document.getElementById('c-footer-message').value.trim() || "We can't wait to celebrate with you!";
  }

  ['c-groom-name', 'c-bride-name'].forEach(id => bind(id, updateHeroPreview));
  ['c-groom-fullname', 'c-groom-parent', 'c-bride-fullname', 'c-bride-parent'].forEach(id => bind(id, updateNamesPreview));
  bind('c-wedding-date', updateDatePreview);
  ['c-venue-name', 'c-venue-addr'].forEach(id => bind(id, updateVenuePreview));
  bind('c-invitation-text', updateInvitePreview);
  bind('c-footer-message', updateFooterPreview);

  const timelineEditor = document.getElementById('timeline-editor');
  if (timelineEditor) timelineEditor.addEventListener('input', renderTimelinePreview);

  const preweddingEditor = document.getElementById('prewedding-editor');
  if (preweddingEditor) preweddingEditor.addEventListener('input', renderPreweddingPreview);

  updateHeroPreview();
  updateNamesPreview();
  updateDatePreview();
  updateVenuePreview();
  updateInvitePreview();
  updateFooterPreview();
  renderTimelinePreview();
  renderPreweddingPreview();
}

function renderTimelinePreview() {
  const preview = document.getElementById('timeline-preview');
  if (!preview) return;
  const rows = Array.from(document.querySelectorAll('#timeline-editor .repeat-item'));

  if (!rows.length) {
    preview.innerHTML = `<p style="font-size:11px;color:var(--text-light);">Koi item nahi hai abhi</p>`;
    return;
  }

  preview.innerHTML = rows.map(row => {
    const title = row.querySelector('.tl-title-input').value.trim() || '(untitled)';
    const time  = row.querySelector('.tl-time-input').value.trim();
    return `
      <div class="preview-timeline-item">
        <div class="dot"></div>
        <div>
          <div class="p-title">${escapeHTML(title)}</div>
          <div class="p-time">${escapeHTML(time)}</div>
        </div>
      </div>`;
  }).join('');
}

function renderPreweddingPreview() {
  const preview = document.getElementById('prewedding-preview');
  if (!preview) return;
  const rows = Array.from(document.querySelectorAll('#prewedding-editor .repeat-item'));

  if (!rows.length) {
    preview.innerHTML = `<p style="font-size:11px;color:var(--text-light);">Koi event nahi hai abhi</p>`;
    return;
  }

  preview.innerHTML = rows.map(row => {
    const name   = row.querySelector('.pw-name-input').value.trim() || '(untitled)';
    const detail = row.querySelector('.pw-detail-input').value.trim();
    return `
      <div class="preview-prewedding-item">
        <div class="p-pwname">${escapeHTML(name)}</div>
        <div class="p-pwdetail">${escapeHTML(detail)}</div>
      </div>`;
  }).join('');
}

/* ── Save everything to Firestore (scoped to currentWeddingId) ── */
function saveContent() {
  const btn    = document.getElementById('save-btn');
  const status = document.getElementById('save-status');

  const timeline = Array.from(document.querySelectorAll('#timeline-editor .repeat-item')).map(row => ({
    title: row.querySelector('.tl-title-input').value.trim(),
    time:  row.querySelector('.tl-time-input').value.trim()
  })).filter(item => item.title || item.time);

  const preWeddingEvents = Array.from(document.querySelectorAll('#prewedding-editor .repeat-item')).map(row => ({
    name:   row.querySelector('.pw-name-input').value.trim(),
    detail: row.querySelector('.pw-detail-input').value.trim()
  })).filter(item => item.name || item.detail);

  const dateLocal = document.getElementById('c-wedding-date').value; // "2026-06-15T17:00"
  // Wedding is IST — append the offset so the countdown is correct everywhere
  const weddingDateISO = dateLocal ? `${dateLocal}:00+05:30` : '';

  const data = {
    coupleNames: {
      groomName:     document.getElementById('c-groom-name').value.trim(),
      brideName:     document.getElementById('c-bride-name').value.trim(),
      groomFullName: document.getElementById('c-groom-fullname').value.trim(),
      brideFullName: document.getElementById('c-bride-fullname').value.trim(),
      groomParent:   document.getElementById('c-groom-parent').value.trim(),
      brideParent:   document.getElementById('c-bride-parent').value.trim()
    },
    weddingDateISO,
    whatsappNumber: document.getElementById('c-whatsapp').value.replace(/\D/g, ''),
    venue: {
      name:    document.getElementById('c-venue-name').value.trim(),
      address: document.getElementById('c-venue-addr').value.trim()
    },
    timeline,
    preWeddingEvents,
    invitationText: document.getElementById('c-invitation-text').value.trim(),
    footerMessage:  document.getElementById('c-footer-message').value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  btn.disabled = true;
  btn.textContent = 'Saving...';
  status.textContent = '';
  status.style.color = 'var(--ok)';

  db.collection('weddings').doc(currentWeddingId).set(data, { merge: true })
    .then(() => {
      status.textContent = '✓ Saved — the site now reflects these changes.';
    })
    .catch(err => {
      status.style.color = 'var(--no)';
      status.textContent = '✗ Could not save: ' + err.message;
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    });
}
