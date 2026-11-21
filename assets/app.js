/* Pustaka Digital CERMAT
   Daftar folder dibaca dari data.json. Mode Admin (tombol "Admin" di bawah halaman)
   mengubah daftar itu dan menyimpannya kembali ke data.json di GitHub.
   Portal wajib login memakai akun LAPORAN CERMAT (server Apps Script yang sama).
   Admin, Fasilitator, Pemantau melihat semua folder; Kepala Sekolah & Guru hanya folder yang dicentang untuk mereka.
   v10: tampilan baru (kepala halaman biru tua, kartu putih), profil di kanan atas membuka dialog "Akun Saya".
   v11: kartu "Petunjuk Penggunaan" (folder panduan/) dan tautan petunjuk di halaman masuk.
   v13: tombol "Lihat hasil" di kartu Pretes & Postes (fasilitator, admin, pemantau): nilai langsung dari Google Form.
   v12: halaman "Pretes & Postes" (#/tes): fasilitator membuka/menutup tes per sekolah, guru & kepala sekolah
        hanya bisa membuka form saat tes dibuka, admin mengisi tautan edit Google Form (disimpan di server). */
(function () {
  'use strict';

  var P = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    bantuan: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.3-2.4 3.8"/><path d="M12 17.2h.01" stroke-width="2.6"/>',
    materi: '<path d="M2 5h6a4 4 0 0 1 4 4v11a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v11a3 3 0 0 1 3-3h7z"/>',
    soal: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7.5h7"/><path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" stroke-width="2.6"/>',
    foto: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>',
    laporan: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12"/>',
    tayang: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/><path d="M10 8.5l4 2-4 2z"/>',
    unggah: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };
  var UI = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.6a6.5 6.5 0 0 1 3.5 5.4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'
  };
  var ICON_NAMES = ['folder', 'materi', 'soal', 'foto', 'laporan', 'template', 'tayang', 'unggah', 'link'];
  var ICON_LABEL = {
    folder: 'Folder', materi: 'Buku / materi', soal: 'Soal / latihan', foto: 'Foto', laporan: 'Laporan',
    template: 'Lembar kerja / tabel', tayang: 'Bahan tayang', unggah: 'Unggah', link: 'Tautan'
  };

  var DEFAULT_DATA = {
    site: {
      kicker: 'Portal Berkas Digital',
      title: 'Pustaka Digital CERMAT',
      subtitle: 'Akses seluruh materi dan berkas program CERMAT dengan satu ketukan. Pilih folder untuk membukanya di Google Drive.',
      announcement: ''
    },
    groups: [
      {
        id: 'fasil', name: 'Fasilitator',
        links: [
          { title: 'Silabus dan Modul', desc: 'Silabus dan modul pembelajaran', url: '', icon: 'materi', access: 'publik', primary: false, hidden: false },
          { title: 'Lembar Kerja', desc: 'Lembar kerja peserta', url: '', icon: 'template', access: 'publik', primary: false, hidden: false },
          { title: 'Bahan Tayang', desc: 'Slide dan bahan presentasi', url: '', icon: 'tayang', access: 'publik', primary: false, hidden: false },
          { title: 'Upload Foto', desc: 'Unggah foto kegiatan', url: '', icon: 'foto', access: 'publik', primary: false, hidden: false },
          { title: 'Laporan Fasil', desc: 'Laporan kegiatan', url: '', icon: 'laporan', access: 'terbatas', primary: false, hidden: false }
        ]
      },
      {
        id: 'sekolah', name: 'Sekolah Binaan',
        links: [
          { title: 'Materi dan Modul', desc: 'Materi dan modul untuk sekolah binaan', url: '', icon: 'materi', access: 'publik', primary: false, hidden: false },
          { title: 'Lembar Kerja', desc: 'Lembar kerja siswa', url: '', icon: 'template', access: 'publik', primary: false, hidden: false },
          { title: 'Unggah Foto Kegiatan', desc: 'Dokumentasi kegiatan sekolah', url: '', icon: 'foto', access: 'publik', primary: false, hidden: false }
        ]
      }
    ]
  };

  var FILE = 'data.json';
  var API = 'https://api.github.com';
  var CRED_KEY = 'cermat-admin';

  var state = clone(DEFAULT_DATA);
  var admin = false;
  var dirty = false;
  var fileSha = null;
  var repo = '';
  var token = '';
  var saving = false;
  var gi = 0;

  /* ---------- util ---------- */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function str(v) { return typeof v === 'string' ? v : ''; }

  function normLinks(arr) {
    return (Array.isArray(arr) ? arr : []).filter(function (l) { return l && typeof l === 'object' && str(l.title).trim(); })
      .map(function (l) {
        return {
          title: str(l.title).trim(),
          desc: str(l.desc).trim(),
          url: str(l.url).trim(),
          icon: ICON_NAMES.indexOf(l.icon) !== -1 ? l.icon : 'folder',
          access: l.access === 'terbatas' ? 'terbatas' : 'publik',
          primary: l.primary === true,
          hidden: l.hidden === true,
          ks: l.ks === true,
          guru: l.guru === true
        };
      });
  }

  function normalize(d) {
    var out = clone(DEFAULT_DATA);
    if (!d || typeof d !== 'object') return out;
    var s = d.site && typeof d.site === 'object' ? d.site : {};
    ['kicker', 'title', 'subtitle', 'announcement'].forEach(function (k) {
      if (typeof s[k] === 'string') out.site[k] = s[k];
    });
    if (Array.isArray(d.groups)) {
      out.groups.forEach(function (g, i) {
        var src = d.groups[i];
        if (src && typeof src === 'object') {
          if (typeof src.name === 'string' && src.name.trim()) g.name = src.name.trim().slice(0, 30);
          g.links = normLinks(src.links);
        }
      });
    } else if (Array.isArray(d.links)) {
      out.groups[0].links = normLinks(d.links);   /* format lama: satu daftar */
    }
    return out;
  }

  /* Satu daftar saja: grup pertama. Grup lain (mis. "Sekolah Binaan") tetap tersimpan di data.json tetapi tidak ditampilkan. */
  function curLinks() {
    gi = 0;
    return state.groups[0].links;
  }

  function renderTabs() {
    var t = $('tabs');
    if (!t) return;
    t.textContent = '';
    state.groups.forEach(function (g, i) {
      t.appendChild(h('button', {
        type: 'button', role: 'tab', class: 'tab' + (i === gi ? ' on' : ''),
        'aria-selected': i === gi ? 'true' : 'false', text: g.name,
        onclick: function () { selectGroup(i); }
      }));
    });
  }

  function selectGroup(i) {
    gi = i;
    try { history.replaceState(null, '', '#' + state.groups[i].id); } catch (e) { /* abaikan */ }
    renderAll();
  }

  function readHash() { gi = 0; }

  function validUrl(u) { return typeof u === 'string' && /^https:\/\/[^\s<>"']+$/i.test(u.trim()); }

  function h(tag, attrs, kids) {
    var e = document.createElement(tag), k, v;
    attrs = attrs || {};
    for (k in attrs) {
      v = attrs[k];
      if (v === false || v === null || v === undefined) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function ic(name, size, w) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', size || 22);
    s.setAttribute('height', size || 22);
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', w || 1.8);
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = P[name] || UI[name] || P.folder;
    return s;
  }

  function $(id) { return document.getElementById(id); }

  var toastTimer = null;
  function toast(msg, bad) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (bad ? ' bad' : '');
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, bad ? 7000 : 4500);
  }

  /* ---------- tampilan publik ---------- */

  function tag(cls, iconName, text) {
    return h('span', { class: 'tag ' + cls }, [iconName ? ic(iconName, 12, 2.2) : null, text]);
  }

  function accessTag(l) {
    return l.access === 'terbatas' ? tag('lim', 'lock', 'Terbatas') : tag('pub', 'globe', 'Publik');
  }

  function publicCard(l) {
    var ok = validUrl(l.url);
    var hl = isLaporanLink(l);
    var cls = 'card' + (hl ? ' hl' : '') + (ok ? '' : ' empty');
    var meta = [];
    if (l.desc) meta.push(h('span', { text: l.desc }));
    if (l.access === 'terbatas') meta.push(accessTag(l));
    if (!ok) meta.push(tag('hid', null, 'Segera hadir'));
    var kids = [
      h('div', { class: 'chipicon' }, [ic(l.icon, 26)]),
      h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: l.title }), meta.length ? h('div', { class: 'meta' }, meta) : null])
    ];
    if (ok) kids.push(h('div', { class: 'go' }, [ic('arrow', 18, 2)]));
    if (ok) {
      // tautan ke situs ini sendiri (mis. LAPORAN CERMAT) dibuka di jendela yang sama agar tetap di dalam aplikasi
      var same = false;
      try { same = new URL(l.url.trim(), location.href).origin === location.origin; } catch (e) { same = false; }
      return h('a', same ? { class: cls, href: l.url.trim() } : { class: cls, href: l.url.trim(), target: '_blank', rel: 'noopener noreferrer' }, kids);
    }
    return h('div', { class: cls, 'aria-disabled': 'true' }, kids);
  }

  function ctlBtn(icon, label, fn, disabled) {
    return h('button', { type: 'button', class: 'ib', 'aria-label': label, title: label, disabled: !!disabled, onclick: fn }, [ic(icon, 17, 2)]);
  }

  function adminCard(l, i) {
    var ok = validUrl(l.url), meta = [];
    meta.push(ok ? tag('pub', 'link', 'Tautan terpasang') : tag('hid', null, 'Belum ada tautan'));
    if (l.hidden) meta.push(tag('hid', 'eyeoff', 'Disembunyikan'));
    if (l.ks) meta.push(tag('pub', 'user', 'Kepala Sekolah'));
    if (l.guru) meta.push(tag('pub', 'user', 'Guru'));
    var n = curLinks().length;
    return h('div', { class: 'card adm' + (l.hidden ? ' off' : '') }, [
      h('div', { class: 'chipicon' }, [ic(l.icon, 22)]),
      h('div', { class: 'txt' }, [
        h('span', { class: 'ttl', text: l.title }),
        h('div', { class: 'meta' }, meta)
      ]),
      h('div', { class: 'ctl' }, [
        ctlBtn('up', 'Naikkan', function () { move(i, -1); }, i === 0),
        ctlBtn('down', 'Turunkan', function () { move(i, 1); }, i === n - 1),
        ctlBtn(l.hidden ? 'eye' : 'eyeoff', l.hidden ? 'Tampilkan' : 'Sembunyikan', function () { curLinks()[i].hidden = !curLinks()[i].hidden; changed(); }),
        h('button', { type: 'button', class: 'ib main', 'aria-label': 'Ubah ' + l.title, title: 'Ubah tautan', onclick: function () { editLink(i); } }, [ic('edit', 17, 2), h('span', { text: 'Ubah' })])
      ])
    ]);
  }

  function renderList() {
    var list = $('list'), shown = 0;
    list.textContent = '';
    if (!me) return;
    if (!admin && me.peran === 'kepsek') { list.appendChild(laporanCard('Pengesahan Laporan', 'Periksa & sahkan laporan pendampingan', '#/pengesahan')); shown++; }
    curLinks().forEach(function (l, i) {
      if (admin) { list.appendChild(adminCard(l, i)); shown++; return; }
      if (l.hidden || !canSee(l)) return;
      if (me.peran === 'admin' && isLaporanLink(l)) return;   // admin memakai "Pantau Laporan" di Panel Admin
      shown++;
      list.appendChild(publicCard(l));
    });
    if (!shown) list.appendChild(h('div', { class: 'empty-note', text: admin ? 'Belum ada folder. Tekan "Tambah folder".' : 'Belum ada folder yang ditampilkan.' }));
    if (!admin) { list.appendChild(tesHomeCard()); list.appendChild(guideCard()); }
    var aw = $('addwrap');
    aw.textContent = '';
    if (admin) {
      aw.appendChild(h('button', { type: 'button', class: 'btn ghost wide', onclick: addLink }, [ic('plus', 18, 2.2), h('span', { text: 'Tambah folder' })]));
    } else if (me && me.peran === 'admin') {
      var tile = function (icon, text, href, fn) {
        var kids = [h('span', { class: 'ai' }, [ic(icon, 20, 2)]), h('span', { text: text })];
        return href ? h('a', { class: 'atile', href: href }, kids) : h('button', { type: 'button', class: 'atile', onclick: fn }, kids);
      };
      aw.appendChild(h('div', { class: 'label' }, [h('h2', { text: 'Panel Admin' })]));
      aw.appendChild(h('div', { class: 'adminpanel' }, [
        tile('users', 'Kelola Pengguna', LAPORAN + '#/pengguna'),
        tile('gear', 'Atur Folder', null, adminEntry),
        tile('chart', 'Pantau Laporan', LAPORAN + '#/lihat')
      ]));
    }
  }

  function renderSite() {
    var s = state.site;
    var set = function (id, v) { var el = $(id); if (el && v) el.textContent = v; };
    set('title', s.title);
    set('subtitle', s.subtitle);
    if (s.title) document.title = s.title;
    var n = $('notice');
    n.textContent = '';
    if (s.announcement && me) {
      n.appendChild(h('strong', { text: 'Pengumuman' }));
      n.appendChild(h('span', { text: s.announcement }));
      n.hidden = false;
    } else { n.hidden = true; }
  }

  function renderAll() {
    renderSite();
    renderTabs();
    renderAuth();
    renderList();
    renderBar();
    renderView();
  }

  function renderSkeleton() {
    var list = $('list');
    list.textContent = '';
    for (var i = 0; i < 5; i++) list.appendChild(h('div', { class: 'skel', 'aria-hidden': 'true' }));
  }

  /* ---------- memuat data ---------- */

  function loadPublic() {
    renderSkeleton();
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    return fetch(FILE + '?t=' + Date.now(), { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) { state = normalize(d); })
      .catch(function (err) {
        clearTimeout(timer);
        if (window.console && console.warn) console.warn('Pustaka CERMAT: memakai data bawaan.', err && err.message ? err.message : err);
        state = clone(DEFAULT_DATA);
      })
      .then(renderAll);
  }

  /* ---------- GitHub ---------- */

  function guessRepo() {
    var host = location.hostname;
    if (/\.github\.io$/i.test(host)) {
      var owner = host.split('.')[0];
      var first = location.pathname.split('/')[1];
      return owner + '/' + (first && first.indexOf('.') === -1 ? first : owner + '.github.io');
    }
    return '';
  }

  function utf8ToB64(s) {
    var bytes = new TextEncoder().encode(s), bin = '', i;
    for (i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function b64ToUtf8(b) {
    var bin = atob(String(b).replace(/\s/g, '')), bytes = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function gh(method, path, body) {
    return fetch(API + '/repos/' + repo + '/contents/' + path, {
      method: method,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + token,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; }
        if (!r.ok) {
          var e2 = new Error(j && j.message ? j.message : 'HTTP ' + r.status);
          e2.status = r.status;
          throw e2;
        }
        return j;
      });
    });
  }

  function explain(err) {
    var s = err && err.status;
    if (s === 401) return 'Token ditolak (salah, kedaluwarsa, atau dicabut). Buat token baru lalu masuk lagi.';
    if (s === 403) return 'Token tidak punya izin menulis ke repositori ini. Pastikan izin "Contents" diatur ke Read and write.';
    if (s === 404) return 'Repositori atau berkas data.json tidak ditemukan, atau token tidak mencakup repositori ini. Periksa nama repositori dan akses token.';
    if (s === 409 || s === 422) return 'Data di GitHub sudah berubah sejak Anda masuk. Muat ulang halaman, masuk lagi, lalu ulangi perubahan.';
    if (err && err.name === 'TypeError') return 'Tidak bisa terhubung ke GitHub. Periksa koneksi internet.';
    return 'Gagal: ' + (err && err.message ? err.message : 'kesalahan tidak dikenal');
  }

  function fetchRemote() {
    return gh('GET', FILE).then(function (j) {
      fileSha = j.sha;
      return normalize(JSON.parse(b64ToUtf8(j.content)));
    });
  }

  function serialize() {
    return JSON.stringify({ site: state.site, groups: state.groups }, null, 2) + '\n';
  }

  function save() {
    if (saving) return;
    for (var g = 0; g < state.groups.length; g++) {
      for (var i = 0; i < state.groups[g].links.length; i++) {
        var u = state.groups[g].links[i].url;
        if (u && !validUrl(u)) { toast('Tautan "' + state.groups[g].links[i].title + '" (' + state.groups[g].name + ') tidak valid. Harus diawali https://', true); return; }
      }
    }
    saving = true;
    renderBar();
    gh('PUT', FILE, {
      message: 'Perbarui daftar folder (mode admin)',
      content: utf8ToB64(serialize()),
      sha: fileSha
    }).then(function (j) {
      fileSha = j.content && j.content.sha ? j.content.sha : fileSha;
      dirty = false;
      toast('Tersimpan. Pengunjung akan melihat perubahan dalam 1 sampai 2 menit.');
    }).catch(function (err) {
      toast(explain(err), true);
    }).then(function () {
      saving = false;
      renderBar();
    });
  }

  /* ---------- kredensial ---------- */

  function readCred() {
    var raw = null;
    try { raw = sessionStorage.getItem(CRED_KEY) || localStorage.getItem(CRED_KEY); } catch (e) { raw = null; }
    if (!raw) return null;
    try {
      var c = JSON.parse(raw);
      return c && c.repo && c.token ? c : null;
    } catch (e2) { return null; }
  }

  function writeCred(remember) {
    var raw = JSON.stringify({ repo: repo, token: token });
    try {
      sessionStorage.removeItem(CRED_KEY);
      localStorage.removeItem(CRED_KEY);
      (remember ? localStorage : sessionStorage).setItem(CRED_KEY, raw);
    } catch (e) { /* penyimpanan tidak tersedia: tidak masalah */ }
  }

  function clearCred() {
    try { sessionStorage.removeItem(CRED_KEY); localStorage.removeItem(CRED_KEY); } catch (e) { /* abaikan */ }
  }

  /* ---------- dialog ---------- */

  function field(label, input, hint) {
    return h('label', { class: 'fld' }, [h('span', { class: 'fl', text: label }), input, hint ? h('span', { class: 'fh', text: hint }) : null]);
  }

  function openDialog(title, body, buttons, onClose) {
    var dlg = h('dialog', { class: 'dlg' });
    var form = h('form', { method: 'dialog', novalidate: true }, [
      h('h2', { text: title }),
      h('div', { class: 'dbody' }, body),
      h('div', { class: 'dbtn' }, buttons)
    ]);
    dlg.appendChild(form);
    document.body.appendChild(dlg);
    dlg.addEventListener('close', function () {
      if (dlg.parentNode) dlg.parentNode.removeChild(dlg);
      if (onClose) onClose();
    });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    return { dlg: dlg, form: form, close: function () { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); } };
  }

  function btn(text, cls, attrs) {
    var a = attrs || {};
    a.class = 'btn ' + (cls || '');
    if (!a.type) a.type = 'button';
    a.text = text;
    return h('button', a);
  }

  function errBox() { return h('div', { class: 'ferr', role: 'alert', hidden: true }); }
  function showErr(box, msg) { box.textContent = msg; box.hidden = !msg; }
  function okBox() { return h('div', { class: 'fok', role: 'status', hidden: true }); }
  function showOk(box, msg) { box.textContent = msg; box.hidden = !msg; }

  function loginDialog() {
    var inRepo = h('input', { type: 'text', value: repo || guessRepo(), placeholder: 'akun/nama-repositori', autocapitalize: 'none', autocomplete: 'off', spellcheck: 'false' });
    var inTok = h('input', { type: 'password', placeholder: 'github_pat_...', autocomplete: 'off', spellcheck: 'false' });
    var inRem = h('input', { type: 'checkbox' });
    var err = errBox();
    var go = btn('Masuk', 'pri', { type: 'submit' });
    var cancel = btn('Batal', 'ghost', { onclick: function () { d.close(); } });
    var d = openDialog('Masuk Mode Admin', [
      h('p', { class: 'dnote', text: 'Mode admin menyimpan perubahan langsung ke repositori GitHub situs ini. Anda memerlukan token akses dari akun GitHub pemilik repositori (lihat README, bagian "Membuat token").' }),
      field('Repositori', inRepo, 'Format: akun/nama-repositori'),
      field('Token GitHub', inTok, 'Token tidak dikirim ke tempat lain selain GitHub.'),
      h('label', { class: 'chk' }, [inRem, h('span', { text: 'Ingat di perangkat ini' })]),
      err
    ], [cancel, go]);
    d.form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var r = inRepo.value.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/\/+$/, '');
      var t = inTok.value.trim();
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(r)) { showErr(err, 'Nama repositori harus berbentuk akun/nama-repositori.'); return; }
      if (!t) { showErr(err, 'Token belum diisi.'); return; }
      showErr(err, '');
      go.disabled = true;
      go.textContent = 'Memeriksa...';
      repo = r; token = t;
      fetchRemote().then(function (data) {
        state = data;
        writeCred(inRem.checked);
        d.close();
        enterAdmin();
      }).catch(function (e) {
        go.disabled = false;
        go.textContent = 'Masuk';
        showErr(err, explain(e));
      });
    });
    inTok.focus();
  }

  function editLink(i) {
    var l = curLinks()[i];
    var inName = h('input', { type: 'text', value: l.title, maxlength: '60' });
    var inDesc = h('input', { type: 'text', value: l.desc, maxlength: '100' });
    var inUrl = h('input', { type: 'url', value: l.url, placeholder: 'https://drive.google.com/drive/folders/...', autocapitalize: 'none', spellcheck: 'false' });
    var inIcon = h('select', {}, ICON_NAMES.map(function (n) { return h('option', { value: n, text: ICON_LABEL[n], selected: n === l.icon }); }));
    var inAcc = h('select', {}, [
      h('option', { value: 'publik', text: 'Publik', selected: l.access !== 'terbatas' }),
      h('option', { value: 'terbatas', text: 'Terbatas', selected: l.access === 'terbatas' })
    ]);
    var inHid = h('input', { type: 'checkbox', checked: l.hidden });
    var inKs = h('input', { type: 'checkbox', checked: l.ks });
    var inGuru = h('input', { type: 'checkbox', checked: l.guru });
    var err = errBox();
    var del = btn('Hapus', 'danger');
    var armed = false;
    del.addEventListener('click', function () {
      if (!armed) { armed = true; del.textContent = 'Yakin hapus?'; return; }
      curLinks().splice(i, 1);
      changed();
      d.close();
    });
    var d = openDialog('Ubah folder', [
      field('Nama tombol', inName),
      field('Keterangan', inDesc, 'Teks kecil di bawah nama. Boleh kosong.'),
      field('Tautan Google Drive', inUrl, 'Salin dari Google Drive: klik kanan folder, Bagikan, atur "Siapa saja yang memiliki link", Salin link. Kosongkan bila belum ada.'),
      h('div', { class: 'two' }, [field('Ikon', inIcon), field('Label akses', inAcc)]),
      h('label', { class: 'chk' }, [inHid, h('span', { text: 'Sembunyikan dari pengunjung' })]),
      h('div', { class: 'fl', text: 'Juga tampilkan untuk' }),
      h('label', { class: 'chk' }, [inKs, h('span', { text: 'Kepala Sekolah' })]),
      h('label', { class: 'chk' }, [inGuru, h('span', { text: 'Guru' })]),
      h('span', { class: 'fh', text: 'Admin, Fasilitator, dan Pemantau selalu melihat semua folder yang tidak disembunyikan.' }),
      err
    ], [del, btn('Batal', 'ghost', { onclick: function () { d.close(); } }), btn('Simpan', 'pri', { type: 'submit' })]);
    d.form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = inName.value.trim(), url = inUrl.value.trim();
      if (!name) { showErr(err, 'Nama tombol tidak boleh kosong.'); return; }
      if (url && !validUrl(url)) { showErr(err, 'Tautan harus diawali https:// dan tanpa spasi.'); return; }
      curLinks()[i] = {
        title: name, desc: inDesc.value.trim(), url: url, icon: inIcon.value,
        access: inAcc.value, primary: l.primary, hidden: inHid.checked, ks: inKs.checked, guru: inGuru.checked
      };
      changed();
      d.close();
    });
    inUrl.focus();
  }

  function addLink() {
    curLinks().push({ title: 'Folder baru', desc: '', url: '', icon: 'folder', access: 'publik', primary: false, hidden: false, ks: false, guru: false });
    changed();
    editLink(curLinks().length - 1);
  }

  function settingsDialog() {
    var s = state.site;
    var b = h('input', { type: 'text', value: s.title, maxlength: '60' });
    var c = h('textarea', { rows: '3', maxlength: '300', text: s.subtitle });
    var e = h('textarea', { rows: '3', maxlength: '300', placeholder: 'Kosongkan bila tidak ada pengumuman', text: s.announcement });
    var d = openDialog('Pengaturan halaman', [
      field('Judul', b),
      field('Kalimat pengantar', c, 'Tampil di bawah judul "Folder utama".'),
      field('Pengumuman', e, 'Muncul di atas daftar folder.')
    ], [btn('Batal', 'ghost', { onclick: function () { d.close(); } }), btn('Simpan', 'pri', { type: 'submit' })]);
    d.form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      state.site = {
        kicker: s.kicker || DEFAULT_DATA.site.kicker,
        title: b.value.trim() || DEFAULT_DATA.site.title,
        subtitle: c.value.trim() || DEFAULT_DATA.site.subtitle,
        announcement: e.value.trim()
      };
      changed();
      d.close();
    });
  }

  function copyDialog() {
    var ta = h('textarea', { rows: '10', readonly: true, class: 'mono', text: serialize() });
    var d = openDialog('Salin data', [
      h('p', { class: 'dnote', text: 'Cadangan bila penyimpanan otomatis tidak bisa dipakai. Di GitHub, buka berkas data.json, tekan ikon pensil, ganti seluruh isinya dengan teks ini, lalu Commit changes.' }),
      ta
    ], [btn('Tutup', 'ghost', { onclick: function () { d.close(); } }), btn('Salin', 'pri', {
      onclick: function (ev) {
        var b = ev.currentTarget;
        ta.select();
        var done = function () { b.textContent = 'Tersalin'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, function () { document.execCommand('copy'); done(); });
        else { document.execCommand('copy'); done(); }
      }
    })]);
  }

  /* ---------- login (akun LAPORAN CERMAT) ---------- */

  var TOKEN_KEY = 'cermat_token', USER_KEY = 'cermat_user', LAPORAN = '../laporanCermat/';
  var PERAN = { admin: 'Admin', fasilitator: 'Fasilitator', pemantau: 'Pemantau', kepsek: 'Kepala Sekolah', guru: 'Guru' };
  var me = null;

  function apiUrl() { return ((window.CERMAT_CONFIG || {}).API_URL || '').trim(); }
  function getTok() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }

  function api(action, payload) {
    var url = apiUrl();
    if (!/^https:\/\//.test(url)) return Promise.reject(new Error('Alamat server belum terbaca. Periksa koneksi, lalu muat ulang.'));
    var body = JSON.stringify(Object.assign({ action: action, token: getTok() }, payload || {}));
    return fetch(url, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow' })
      .catch(function () { var e = new Error('Tidak bisa terhubung ke server. Periksa koneksi internet.'); e.offline = true; throw e; })
      .then(function (r) { return r.json().catch(function () { var e = new Error('Jawaban server tidak terbaca.'); e.offline = !r.ok; throw e; }); })
      .then(function (j) {
        if (!j.ok) { var e = new Error(j.error || 'Terjadi kesalahan di server.'); e.code = j.code; throw e; }
        return j.data;
      });
  }

  /* data pengguna disimpan bersama penanda token, supaya tidak tertukar bila token berganti */
  function cachedMe() {
    var t = getTok(); if (!t) return null;
    try { var u = JSON.parse(localStorage.getItem(USER_KEY) || 'null'); return u && u._t === t.slice(-16) ? u : null; } catch (e) { return null; }
  }
  function storeMe(u) {
    me = u;
    try { var c = Object.assign({}, u, { _t: getTok().slice(-16) }); localStorage.setItem(USER_KEY, JSON.stringify(c)); } catch (e) { /* abaikan */ }
  }
  function clearSession() {
    me = null;
    try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch (e) { /* abaikan */ }
  }

  function canSee(l) {
    if (!me) return false;
    if (me.peran === 'kepsek') return l.ks === true;
    if (me.peran === 'guru') return l.guru === true;
    return true;   // admin, fasilitator, pemantau
  }

  /* tombol besar (gaya sama dengan kartu "tombol utama" di daftar folder) */
  function isLaporanLink(l) {
    try { return /^\/laporancermat(\/|$)/i.test(new URL(l.url, location.href).pathname); } catch (e) { return false; }
  }

  /* =========================================================
   * PRETES & POSTES (#/tes) — data dari server LAPORAN CERMAT
   * ========================================================= */
  var TES_JUDUL = ['Numerasi dalam Konteks Sehari-hari', 'Deep Learning dalam Matematika', 'Mengenal Pendekatan Concrete–Visual–Abstract (CVA)',
    'Pembelajaran Matematika dari Konteks Menuju Abstrak', 'Berpikir Komputasional (Bagian 1): Memahami dan Menumbuhkan',
    'Berpikir Komputasional (Bagian 2): Menerapkan dalam Pembelajaran', 'Manajemen Kelas yang Efektif dalam Pembelajaran Matematika'];
  var tesData = null, tesErr = '', tesBusy = false, tesTimer = null, tesAct = {}, tesWas = false;

  function tesHomeCard() {
    return h('a', { class: 'card', href: '#/tes' }, [
      h('div', { class: 'chipicon' }, [ic('soal', 26)]),
      h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: 'Pretes & Postes' }), h('div', { class: 'meta' }, [h('span', { text: 'Tes pendampingan P1–P7' })])]),
      h('div', { class: 'go' }, [ic('arrow', 18, 2)])
    ]);
  }

  function onTes() { return !!me && !admin && location.hash === '#/tes'; }

  function renderView() {
    var tv = $('tesview'), t = onTes();
    if (!tv) return;
    tv.hidden = !t;
    if (me) ['list', 'addwrap'].forEach(function (id) { $(id).hidden = t; });
    var lb = document.querySelector('.label'); if (lb && me) lb.hidden = t;
    clearInterval(tesTimer); tesTimer = null;
    var masuk = t && !tesWas;
    tesWas = t;
    if (!t) return;
    if (masuk) tesData = null;   // selalu ambil status terbaru saat halaman dibuka
    renderTes();
    if (!tesData && !tesBusy) loadTes();
    // guru & kepala sekolah: periksa berkala apakah tes sudah dibuka fasilitator
    if (me.peran === 'guru' || me.peran === 'kepsek') tesTimer = setInterval(function () { if (onTes() && !document.hidden) loadTes(true); }, 30000);
  }

  function loadTes(quiet) {
    tesBusy = true; if (!quiet) { tesErr = ''; renderTes(); }
    return api('tesList').then(function (d) { tesData = d; tesErr = ''; })
      .catch(function (e) { if (!quiet || !tesData) tesErr = e.message; if (e.code === 'AUTH') { clearSession(); renderAll(); } })
      .then(function () { tesBusy = false; if (onTes()) renderTes(); });
  }

  function normSk(v) { return String(v || '').toLowerCase().replace(/\b(sd|mi|sdn|negeri|swasta|islam|it)\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function tesSekolahVal(t, sk) {
    if (!sk || !t.entSekolah) return '';
    var opsi = t.opsiSekolah || [];
    if (!opsi.length) return sk.nama;
    var cands = [sk.nama].concat(sk.alias || []);
    var hit = opsi.filter(function (o) { return cands.some(function (c) { return o.trim().toLowerCase() === c.trim().toLowerCase(); }); })[0]
      || opsi.filter(function (o) { return cands.some(function (c) { return normSk(o) && normSk(o) === normSk(c); }); })[0];
    return hit || '';
  }
  function tesUrl(t, jenis, sk) {
    if (!t.url) return '';
    var q = [];
    if (t.entJenis) q.push('entry.' + t.entJenis + '=' + encodeURIComponent(jenis === 'pre' ? t.optPre : t.optPost));
    var sv = tesSekolahVal(t, sk);
    if (sv) q.push('entry.' + t.entSekolah + '=' + encodeURIComponent(sv));
    return t.url + (q.length ? (t.url.indexOf('?') < 0 ? '?' : '&') + 'usp=pp_url&' + q.join('&') : '');
  }
  function jamTutup(st) { try { return new Date(st.sampai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.'); } catch (e) { return '23.59'; } }

  function tesSet(t, sk, jenis, buka) {
    var k = t.no + jenis + sk.id;
    if (tesAct[k]) return;
    var preBuka = !!((t.status || {})[sk.id] || {}).pre;
    tesAct[k] = true; renderTes();
    api('tesSet', { sekolahId: sk.id, no: t.no, jenis: jenis, buka: buka }).then(function (d) {
      tesData = d;
      toast((jenis === 'pre' ? 'Pretes' : 'Postes') + ' P' + t.no + (buka ? ' dibuka untuk ' + sk.nama + ' sampai pukul 23.59.' : ' ditutup.')
        + (buka && jenis === 'post' && preBuka ? ' Pretes otomatis ditutup.' : ''));
    }).catch(function (e) { toast(e.message, true); }).then(function () { delete tesAct[k]; renderTes(); });
  }

  function renderTes() {
    var tv = $('tesview'); if (!tv || !me) return;
    var peran = me.peran, d = tesData;
    var peserta = peran === 'guru' || peran === 'kepsek';
    var sub = peserta ? 'Ketuk tes yang sudah dibuka fasilitator. Tombol yang terkunci akan terbuka saat pendampingan.'
      : peran === 'fasilitator' ? 'Buka tes untuk sekolah binaan Anda saat pendampingan. Membuka postes otomatis menutup pretes. Tes tertutup sendiri pukul 23.59 hari itu.'
      : peran === 'admin' ? 'Isi tautan Google Form tiap pendampingan lewat Atur tautan. Status menunjukkan tes yang sedang dibuka di setiap sekolah.'
      : 'Tes yang sedang dibuka di setiap sekolah.';
    tv.textContent = '';
    var head = h('div', { class: 'teshead' }, [
      h('a', { class: 'btn ghost sm', href: '#/' }, [ic('back', 16, 2.2), h('span', { text: 'Folder utama' })]),
      h('span', { class: 'spacer' }),
      peran === 'admin' ? btn('Atur tautan', 'pri sm', { onclick: tesLinksDialog }) : null,
      btn(tesBusy ? 'Memuat…' : 'Muat ulang', 'ghost sm', { disabled: tesBusy, onclick: function () { loadTes(); } })
    ]);
    tv.appendChild(head);
    tv.appendChild(h('div', { class: 'label' }, [h('h2', { text: 'Pretes & Postes' }), h('p', { class: 'sub', text: sub })]));
    if (tesErr) { tv.appendChild(h('div', { class: 'empty-note', text: tesErr })); return; }
    if (!d) { var g0 = h('div', { class: 'tesgrid' }); for (var i = 0; i < 4; i++) g0.appendChild(h('div', { class: 'skel' })); tv.appendChild(g0); return; }
    var sks = d.sekolah || [];
    if (!sks.length && peran !== 'admin' && peran !== 'pemantau') { tv.appendChild(h('div', { class: 'empty-note', text: peserta ? 'Akun ini belum terhubung ke sekolah. Hubungi admin.' : 'Anda belum dipasangkan ke sekolah binaan. Hubungi admin.' })); return; }
    var grid = h('div', { class: 'tesgrid' });
    d.tes.forEach(function (t) {
      var kids = [h('div', { class: 'teshd' }, [h('span', { class: 'tesno', text: 'P' + t.no }), h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: 'Pendampingan ' + t.no }), h('span', { class: 'meta', text: TES_JUDUL[t.no - 1] || '' })])])];
      if (!t.ada) kids.push(h('p', { class: 'tesnote', text: 'Tautan Google Form belum diisi admin.' }));
      else if (peserta) {
        var sk = sks[0], st = (t.status || {})[sk && sk.id] || {};
        kids.push(h('div', { class: 'tesbtns' }, ['pre', 'post'].map(function (j) {
          var lbl = j === 'pre' ? 'Pretes' : 'Postes';
          if (st[j] && t.url) return h('a', { class: 'btn pri', href: tesUrl(t, j, sk), target: '_blank', rel: 'noopener' }, [h('span', { text: 'Kerjakan ' + lbl })]);
          return h('span', { class: 'btn lockd', 'aria-disabled': 'true' }, [ic('lock', 15, 2.2), h('span', { text: lbl + ' belum dibuka' })]);
        })));
        var open = ['pre', 'post'].filter(function (j) { return st[j]; });
        if (open.length) kids.push(h('p', { class: 'tesnote ok', text: 'Dibuka sampai pukul ' + jamTutup(st[open[0]]) + '.' }));
      } else if (peran === 'fasilitator') {
        sks.forEach(function (sk) {
          var st = (t.status || {})[sk.id] || {};
          var rows = ['pre', 'post'].map(function (j) {
            var lbl = j === 'pre' ? 'Pretes' : 'Postes', on = !!st[j], busy = tesAct[t.no + j + sk.id];
            return h('div', { class: 'tesrow' }, [
              h('b', { text: lbl }),
              h('span', { class: 'tag ' + (on ? 'open' : 'hid'), title: on ? 'Dibuka sampai pukul ' + jamTutup(st[j]) : '', text: on ? 'Dibuka' : 'Tertutup' }),
              h('span', { class: 'spacer' }),
              btn(busy ? '…' : (on ? 'Tutup' : 'Aktifkan'), on ? 'ghost sm' : 'pri sm', { disabled: !!busy, onclick: function () { tesSet(t, sk, j, !on); } }),
              t.url ? h('a', { class: 'ib', href: tesUrl(t, j, sk), target: '_blank', rel: 'noopener', title: 'Buka form ' + lbl, 'aria-label': 'Buka form ' + lbl }, [ic('link', 16, 2)]) : null
            ]);
          });
          if (sks.length > 1) kids.push(h('div', { class: 'tessk', text: sk.nama }));
          kids.push(h('div', { class: 'tesrows' }, rows));
        });
        kids.push(hasilBtn(t));
      } else {
        var aktif = [];
        sks.forEach(function (sk) { var st = (t.status || {})[sk.id]; if (st) aktif.push(sk.nama + ': ' + ['pre', 'post'].filter(function (j) { return st[j]; }).map(function (j) { return j === 'pre' ? 'pretes' : 'postes'; }).join(' & ')); });
        kids.push(h('div', { class: 'tesnote' + (aktif.length ? ' ok' : '') }, aktif.length ? aktif.map(function (x) { return h('div', { text: 'Dibuka · ' + x }); }) : [h('span', { text: 'Tidak ada sekolah yang sedang membuka tes ini.' })]));
        kids.push(h('div', { class: 'tesbtns' }, [
          hasilBtn(t),
          peran === 'admin' && t.url ? h('a', { class: 'btn ghost sm', href: tesUrl(t, 'pre'), target: '_blank', rel: 'noopener' }, [h('span', { text: 'Lihat form' })]) : null]));
      }
      grid.appendChild(h('div', { class: 'card tes' + (t.ada ? '' : ' empty') }, kids));
    });
    tv.appendChild(grid);
  }

  /* ---------- Lihat hasil: nilai langsung dari jawaban Google Form ----------
   * Aturan sama dengan impor di LAPORAN CERMAT (memakai js/importer.js milik LAPORAN): kolom dikenali otomatis,
   * kiriman terakhir per nama & jenis tes yang dipakai, nama sekolah dicocokkan termasuk ejaan lain. */
  function hasilBtn(t) {
    return btn('Lihat hasil', 'ghost sm hasilbtn', { onclick: function () { hasilDialog(t); } });
  }
  var importerP = null;
  function loadImporter() {
    if (window.Importer) return Promise.resolve(window.Importer);
    if (!importerP) importerP = new Promise(function (ok, no) {
      var sc = document.createElement('script');
      sc.src = LAPORAN + 'js/importer.js';
      sc.onload = function () { window.Importer ? ok(window.Importer) : no(new Error('Pengolah nilai tidak termuat.')); };
      sc.onerror = function () { importerP = null; no(new Error('Pengolah nilai tidak termuat. Periksa koneksi internet.')); };
      document.head.appendChild(sc);
    });
    return importerP;
  }
  function fmtN(v) { return v === null || v === undefined || isNaN(v) ? '–' : Number(v).toLocaleString('id-ID', { maximumFractionDigits: 2 }); }
  function ringkas(list) {   // list: [{nama, skor}]
    if (!list.length) return { n: 0, avg: null, min: null, max: null, minN: [], maxN: [] };
    var sk = list.map(function (x) { return x.skor; });
    var mn = Math.min.apply(null, sk), mx = Math.max.apply(null, sk);
    var eqv = function (a, b) { return Math.abs(a - b) < 1e-9; };
    return { n: list.length, avg: sk.reduce(function (a, b) { return a + b; }, 0) / list.length, min: mn, max: mx,
      minN: list.filter(function (x) { return eqv(x.skor, mn); }).map(function (x) { return x.nama; }),
      maxN: list.filter(function (x) { return eqv(x.skor, mx); }).map(function (x) { return x.nama; }) };
  }
  function olahHasil(I, rows, sks, no) {
    var an = I.analyze(rows), c = an.cols;
    var kurang = [['nama', 'Nama'], ['sekolah', 'Asal sekolah'], ['jenis', 'Jenis tes'], ['skor', 'Skor']].filter(function (k) { return c[k[0]] < 0; }).map(function (k) { return k[1]; });
    if (kurang.length) throw new Error('Kolom ' + kurang.join(', ') + ' tidak ditemukan di form.' + (c.skor < 0 ? ' Pastikan form diatur sebagai Kuis.' : ''));
    var nilai = I.distinct(an.body, c.sekolah);
    var dipakai = {};
    var per = sks.map(function (sk) {
      var vals = nilai.filter(function (v) { return I.schoolMatch(v.value, sk); }).map(function (v) { dipakai[v.value] = true; return v.value; });
      var ex = vals.length ? I.extract(an, c, vals, no).rows : [];
      var orang = {};
      ex.forEach(function (r) { var k = I.normName(r.nama); (orang[k] = orang[k] || { nama: r.nama, pre: null, post: null })[r.jenis] = r.skor; });
      var daftar = Object.keys(orang).map(function (k) { return orang[k]; }).sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
      return { sk: sk, daftar: daftar, pre: ringkas(ex.filter(function (r) { return r.jenis === 'pre'; })), post: ringkas(ex.filter(function (r) { return r.jenis === 'post'; })) };
    });
    var lain = nilai.filter(function (v) { return !dipakai[v.value]; });
    var semua = { pre: [], post: [] };
    per.forEach(function (x) { x.daftar.forEach(function (o) { if (o.pre !== null) semua.pre.push({ nama: o.nama, skor: o.pre }); if (o.post !== null) semua.post.push({ nama: o.nama, skor: o.post }); }); });
    return { per: per, lain: lain, semua: { pre: ringkas(semua.pre), post: ringkas(semua.post) } };
  }
  function naik(pre, post) {
    if (pre.avg === null || post.avg === null) return '–';
    var d = post.avg - pre.avg;
    return (d >= 0 ? '+' : '−') + fmtN(Math.abs(d)) + (pre.avg ? ' (' + (d >= 0 ? '+' : '−') + fmtN(Math.abs(d) / pre.avg * 100) + '%)' : '');
  }
  function kotakRingkas(judul, r) {
    var nm = function (a) { return a.length > 2 ? a.slice(0, 2).join(', ') + ' +' + (a.length - 2) : a.join(', '); };
    return h('div', { class: 'hbox' }, [
      h('div', { class: 'hbt' }, [h('b', { text: judul }), h('span', { text: r.n + ' peserta' })]),
      h('div', { class: 'hbn' }, [
        h('div', {}, [h('span', { text: 'Rata-rata' }), h('b', { text: fmtN(r.avg) })]),
        h('div', { class: 'lo' }, [h('span', { text: 'Terendah' }), h('b', { text: fmtN(r.min) }), r.n ? h('small', { text: nm(r.minN) }) : null]),
        h('div', { class: 'hi' }, [h('span', { text: 'Tertinggi' }), h('b', { text: fmtN(r.max) }), r.n ? h('small', { text: nm(r.maxN) }) : null])
      ])
    ]);
  }
  function tabelPeserta(x) {
    if (!x.daftar.length) return h('p', { class: 'dnote', text: 'Belum ada jawaban dari sekolah ini.' });
    var cls = function (v, r) { return v === null ? '' : (Math.abs(v - r.min) < 1e-9 ? 'lo' : (Math.abs(v - r.max) < 1e-9 ? 'hi' : '')); };
    return h('div', { class: 'tscroll' }, [h('table', { class: 'htab' }, [
      h('thead', {}, [h('tr', {}, ['No', 'Nama', 'Pretes', 'Postes', 'Kenaikan'].map(function (t, i) { return h('th', { class: i > 1 ? 'num' : '', text: t }); }))]),
      h('tbody', {}, x.daftar.map(function (o, i) {
        var d = o.pre !== null && o.post !== null ? o.post - o.pre : null;
        return h('tr', {}, [h('td', { class: 'num', text: String(i + 1) }), h('td', { text: o.nama }),
          h('td', { class: 'num ' + cls(o.pre, x.pre), text: fmtN(o.pre) }), h('td', { class: 'num ' + cls(o.post, x.post), text: fmtN(o.post) }),
          h('td', { class: 'num', text: d === null ? '–' : (d >= 0 ? '+' : '−') + fmtN(Math.abs(d)) })]);
      }))
    ])]);
  }
  function hasilDialog(t) {
    var body = h('div', { class: 'hasil' }, [h('div', { class: 'skel' }), h('p', { class: 'dnote', text: 'Membaca jawaban Google Form…' })]);
    var d = openDialog('Hasil P' + t.no + ' · ' + (TES_JUDUL[t.no - 1] || ''), [body], [btn('Tutup', 'ghost', { onclick: function () { d.close(); } })]);
    d.dlg.classList.add('wide');
    d.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    var sks = (tesData && tesData.sekolah) || [];
    var semua = me.peran === 'admin' || me.peran === 'pemantau';
    Promise.all([loadImporter(), api('tesResponses', semua ? { no: t.no } : { no: t.no, sekolahId: (sks[0] || {}).id })]).then(function (r) {
      var I = r[0], res = r[1];
      body.textContent = '';
      var info = h('p', { class: 'dnote', text: 'Langsung dari Google Form "' + (res.judul || '') + '" · ' + res.jumlah + ' jawaban · nilai skala 0–100 · kiriman terakhir per nama yang dipakai.' });
      if (res.jumlah === 0) { body.appendChild(info); body.appendChild(h('div', { class: 'empty-note', text: 'Belum ada jawaban.' })); return; }
      var o = olahHasil(I, res.rows, sks, t.no);
      body.appendChild(info);
      if (!semua) {
        var x = o.per[0];
        body.appendChild(h('div', { class: 'hgrid' }, [kotakRingkas('Pretes', x.pre), kotakRingkas('Postes', x.post)]));
        body.appendChild(h('div', { class: 'hnaik' }, [h('span', { text: 'Kenaikan rata-rata' }), h('b', { text: naik(x.pre, x.post) })]));
        body.appendChild(tabelPeserta(x));
        return;
      }
      var cel = function (r) { return [h('td', { class: 'num', text: String(r.n) }), h('td', { class: 'num lo', text: fmtN(r.min) }), h('td', { class: 'num hi', text: fmtN(r.max) }), h('td', { class: 'num b', text: fmtN(r.avg) })]; };
      var detail = h('div', { class: 'hdetail' });
      var rows = o.per.map(function (x) {
        var tr = h('tr', { class: 'click', tabindex: '0', title: 'Lihat nilai peserta' }, [h('td', { text: x.sk.nama })].concat(cel(x.pre), cel(x.post), [h('td', { class: 'num', text: naik(x.pre, x.post) })]));
        var buka = function () {
          [].forEach.call(tr.parentNode.children, function (r) { r.classList.remove('on'); }); tr.classList.add('on');
          detail.textContent = '';
          detail.appendChild(h('h3', { text: x.sk.nama }));
          detail.appendChild(h('div', { class: 'hgrid' }, [kotakRingkas('Pretes', x.pre), kotakRingkas('Postes', x.post)]));
          detail.appendChild(tabelPeserta(x));
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        tr.addEventListener('click', buka); tr.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); buka(); } });
        return tr;
      });
      rows.push(h('tr', { class: 'tot' }, [h('td', { text: 'Semua sekolah' })].concat(cel(o.semua.pre), cel(o.semua.post), [h('td', { class: 'num', text: naik(o.semua.pre, o.semua.post) })])));
      var th2 = function (t) { return h('th', { class: 'num', text: t }); };
      body.appendChild(h('div', { class: 'tscroll' }, [h('table', { class: 'htab sk' }, [
        h('thead', {}, [
          h('tr', {}, [h('th', { rowspan: '2', text: 'Sekolah' }), h('th', { colspan: '4', class: 'grp', text: 'Pretes' }), h('th', { colspan: '4', class: 'grp', text: 'Postes' }), h('th', { rowspan: '2', class: 'num', text: 'Kenaikan' })]),
          h('tr', {}, [th2('n'), th2('Terendah'), th2('Tertinggi'), th2('Rata-rata'), th2('n'), th2('Terendah'), th2('Tertinggi'), th2('Rata-rata')])
        ]),
        h('tbody', {}, rows)
      ])]));
      body.appendChild(h('p', { class: 'fh', text: 'Ketuk nama sekolah untuk melihat nilai setiap peserta.' }));
      if (o.lain.length) body.appendChild(h('div', { class: 'notice' }, [h('strong', { text: 'Asal sekolah tidak dikenali' }),
        h('span', { text: o.lain.map(function (v) { return '"' + v.value + '" (' + v.count + ' jawaban)'; }).join(', ') + '. Jawaban ini tidak dihitung. Tambahkan sebagai ejaan lain sekolah di LAPORAN CERMAT (Data Sekolah) atau perbaiki pilihan di form.' })]));
      body.appendChild(detail);
    }).catch(function (e) {
      body.textContent = '';
      body.appendChild(h('div', { class: 'ferr', text: e.code === 'NOFORM' ? 'Tautan Google Form P' + t.no + ' belum diisi admin.' : e.message }));
    });
  }

  function tesLinksDialog() {
    var inputs = {}, notes = {};
    var body = [h('p', { class: 'dnote', text: 'Tempel tautan EDIT Google Form (alamat saat form dibuka untuk diedit, berakhiran /edit). Akun Google pemilik Apps Script harus menjadi editor form. Tautan edit hanya disimpan di server; peserta menerima tautan isian.' })];
    var err = errBox(), info = h('div', { class: 'fok', hidden: true });
    var list = h('div', { class: 'dbody' }, [h('div', { class: 'skel' })]);
    body.push(list, err, info);
    var d;
    var go = btn('Simpan', 'pri', { disabled: true });
    function fill(links) {
      list.textContent = '';
      links.forEach(function (L) {
        var inp = h('input', { type: 'url', value: L.editUrl || '', placeholder: 'https://docs.google.com/forms/d/…/edit', autocomplete: 'off', spellcheck: 'false' });
        inputs[L.no] = inp;
        var n = h('span', { class: 'fh', text: L.pubUrl ? (L.catatan ? 'Tersimpan. Catatan: ' + L.catatan : 'Tersimpan, isian otomatis jenis tes dan sekolah aktif.') : 'Belum diisi.' });
        notes[L.no] = n;
        list.appendChild(h('label', { class: 'fld' }, [h('span', { class: 'fl', text: 'P' + L.no + ' · ' + (TES_JUDUL[L.no - 1] || '') }), inp, n]));
      });
      go.disabled = false;
    }
    api('tesLinks').then(fill).catch(function (e) { list.textContent = ''; showErr(err, e.message); });
    go.addEventListener('click', function () {
      var links = Object.keys(inputs).map(function (no) { return { no: Number(no), editUrl: inputs[no].value.trim() }; });
      var salah = links.filter(function (l) { return l.editUrl && !/\/forms\/d\/(?!e\/)[A-Za-z0-9_-]{20,}/.test(l.editUrl); });
      if (salah.length) { showErr(err, 'P' + salah.map(function (l) { return l.no; }).join(', P') + ': itu tautan untuk peserta. Tempel tautan EDIT (…/forms/d/…/edit).'); return; }
      showErr(err, ''); info.hidden = true; go.disabled = true; go.textContent = 'Memeriksa form…';
      api('tesSaveLinks', { links: links }).then(function (r) {
        fill(r.links);
        if (r.gagal && r.gagal.length) showErr(err, r.gagal.join(' '));
        info.textContent = 'Tautan disimpan.'; info.hidden = false;
        tesData = null; loadTes(true);
      }).catch(function (e) { showErr(err, e.message); }).then(function () { go.disabled = false; go.textContent = 'Simpan'; });
    });
    d = openDialog('Atur tautan Pretes & Postes', body, [btn('Tutup', 'ghost', { onclick: function () { d.close(); } }), go]);
    d.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
  }

  /* Petunjuk Penggunaan: halaman di folder panduan/, sesuai peran (admin: daftar semua petunjuk) */
  var PANDUAN = { fasilitator: 'fasilitator.html', kepsek: 'kepala-sekolah.html', guru: 'guru.html', pemantau: 'pemantau.html', admin: '' };
  function guideCard() {
    var f = PANDUAN[me.peran];
    return h('a', { class: 'card guide', href: 'panduan/' + (f || '') }, [
      h('div', { class: 'chipicon' }, [ic('bantuan', 26)]),
      h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: 'Petunjuk Penggunaan' }), h('div', { class: 'meta' }, [h('span', { text: me.peran === 'admin' ? 'Petunjuk untuk semua peran' : 'Cara memakai aplikasi CERMAT' })])]),
      h('div', { class: 'go' }, [ic('arrow', 18, 2)])
    ]);
  }

  function laporanCard(title, desc, hash) {
    return h('a', { class: 'card hl', href: LAPORAN + (hash || '') }, [
      h('div', { class: 'chipicon' }, [ic('laporan', 26)]),
      h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: title }), h('div', { class: 'meta' }, [h('span', { text: desc })])]),
      h('div', { class: 'go' }, [ic('arrow', 18, 2)])
    ]);
  }

  function pwInput(attrs) {
    var inp = h('input', Object.assign({ type: 'password' }, attrs));
    var eye = h('button', { type: 'button', class: 'eye', title: 'Lihat password', 'aria-label': 'Lihat password' }, [ic('eye', 20, 1.9)]);
    eye.addEventListener('click', function () {
      var show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      eye.textContent = ''; eye.appendChild(ic(show ? 'eyeoff' : 'eye', 20, 1.9));
      eye.title = show ? 'Sembunyikan password' : 'Lihat password'; eye.setAttribute('aria-label', eye.title);
      inp.focus();
    });
    return { input: inp, el: h('div', { class: 'pwf' }, [inp, eye]) };
  }

  function renderAuth() {
    var a = $('auth'), ub = $('userbar'), logged = !!me;
    document.body.classList.toggle('need-login', !logged);
    ['label', 'list', 'addwrap'].forEach(function (id) { var el = id === 'label' ? document.querySelector('.label') : $(id); if (el) el.hidden = !logged; });
    $('adminlink').hidden = true;   // pindah ke Panel Admin
    if (logged) {
      a.hidden = true; a.textContent = '';
      ub.textContent = '';
      ub.appendChild(h('button', { type: 'button', class: 'pill', title: 'Akun Saya', 'aria-label': 'Akun Saya: ' + shortName(me), onclick: accountDialog }, [
        h('span', { class: 'nm' }, [h('b', { text: shortName(me) }), h('span', { text: PERAN[me.peran] || me.peran })]),
        h('span', { class: 'avatar', 'aria-hidden': 'true', text: initials(me) })
      ]));
      ub.hidden = false;
      return;
    }
    ub.hidden = true; ub.textContent = '';
    if (a.dataset.on === '1' && !a.hidden) return;   // form login sudah tampil
    a.dataset.on = '1'; a.hidden = false; a.textContent = '';
    var inU = h('input', { type: 'text', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', required: true });
    var pw = pwInput({ autocomplete: 'current-password', required: true });
    var err = errBox();
    var go = btn('Masuk', 'pri', { type: 'submit' });
    var form = h('form', { class: 'login', novalidate: true }, [
      h('h2', { text: 'Masuk' }),
      h('p', { class: 'dnote', text: 'Gunakan akun yang diberikan admin program (akun yang sama dengan LAPORAN CERMAT).' }),
      field('Username', inU), field('Password', pw.el), err, go,
      h('p', { class: 'fh', text: 'Lupa password? Hubungi admin program.' }),
      h('a', { class: 'guidelink', href: 'panduan/pasang.html' }, [ic('bantuan', 16, 2), h('span', { text: 'Petunjuk memasang aplikasi & masuk' })])
    ]);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var u = inU.value.trim(), p = pw.input.value;
      if (!u || !p) { showErr(err, 'Isi username dan password.'); return; }
      showErr(err, ''); go.disabled = true; go.textContent = 'Memeriksa...';
      api('login', { username: u, password: p }).then(function (r) {
        try { localStorage.setItem(TOKEN_KEY, r.token); } catch (e) { /* abaikan */ }
        storeMe(r.user);
        a.dataset.on = '';
        renderAll();
        window.scrollTo(0, 0);
      }).catch(function (e) {
        go.disabled = false; go.textContent = 'Masuk';
        showErr(err, e.message);
      });
    });
    a.appendChild(form);
    setTimeout(function () { inU.focus(); }, 50);
  }

  function shortName(u) { return String(u.nama || u.username).split(',')[0].trim(); }
  function initials(u) {
    var w = shortName(u).replace(/^(drs?|dra|hj?|ir|prof)\.?\s+/i, '').split(/\s+/).filter(Boolean);
    return ((w[0] || '?').charAt(0) + (w.length > 1 ? w[1].charAt(0) : '')).toUpperCase();
  }

  /* Akun Saya: profil (NIP) dan ganti password, memakai server LAPORAN CERMAT */
  function accountDialog() {
    if (!me) return;
    var body = [h('div', { class: 'acct' }, [
      h('span', { class: 'avatar', 'aria-hidden': 'true', text: initials(me) }),
      h('div', { class: 'who' }, [h('b', { text: me.nama || me.username }), h('span', { text: '@' + me.username + ' · ' + (PERAN[me.peran] || me.peran) })])
    ])];
    var d;
    if (me.peran === 'guru') {
      body.push(h('p', { class: 'dnote', text: 'Akun guru dipakai bersama oleh semua guru di sekolah. Profil dan password akun ini hanya bisa diganti admin program.' }));
    } else {
      var inNip = h('input', { type: 'text', inputmode: 'numeric', maxlength: '30', value: me.nip || '', placeholder: 'Contoh: 19800101 200501 1 001', autocomplete: 'off' });
      var errP = errBox(), okP = okBox();
      var goP = btn('Simpan profil', 'pri sm');
      goP.addEventListener('click', function () {
        showErr(errP, ''); showOk(okP, ''); goP.disabled = true; goP.textContent = 'Menyimpan...';
        api('saveProfile', { nip: inNip.value }).then(function (u) {
          storeMe(Object.assign({}, me, u)); inNip.value = me.nip || '';
          showOk(okP, 'Profil tersimpan.');
        }).catch(function (e) { showErr(errP, e.message); }).then(function () { goP.disabled = false; goP.textContent = 'Simpan profil'; });
      });
      body.push(h('div', { class: 'sect' }, [
        h('h3', { text: 'Profil' }),
        field('NIP', inNip, 'Tampil di Lembar Pengesahan laporan. Nama lengkap hanya bisa diubah admin.'),
        errP, okP, goP
      ]));
      var pO = pwInput({ autocomplete: 'current-password' }), pN = pwInput({ autocomplete: 'new-password' }), pU = pwInput({ autocomplete: 'new-password' });
      var errW = errBox(), okW = okBox();
      var goW = btn('Ganti password', 'pri sm');
      goW.addEventListener('click', function () {
        var o = pO.input.value, n1 = pN.input.value, n2 = pU.input.value;
        showOk(okW, '');
        if (!o || !n1) { showErr(errW, 'Isi password lama dan password baru.'); return; }
        if (n1.length < 6) { showErr(errW, 'Password baru minimal 6 karakter.'); return; }
        if (n1 !== n2) { showErr(errW, 'Ulangi password baru belum sama.'); return; }
        showErr(errW, ''); goW.disabled = true; goW.textContent = 'Mengganti...';
        api('changePassword', { old: o, baru: n1 }).then(function () {
          pO.input.value = pN.input.value = pU.input.value = '';
          showOk(okW, 'Password diganti. Perangkat lain yang memakai akun ini perlu masuk lagi.');
        }).catch(function (e) { showErr(errW, e.message); }).then(function () { goW.disabled = false; goW.textContent = 'Ganti password'; });
      });
      body.push(h('div', { class: 'sect' }, [
        h('h3', { text: 'Ganti password' }),
        field('Password lama', pO.el), field('Password baru', pN.el, 'Minimal 6 karakter.'), field('Ulangi password baru', pU.el),
        errW, okW, goW
      ]));
    }
    var out = btn('Keluar', 'danger', { onclick: function () { d.close(); logout(); } });
    d = openDialog('Akun Saya', body, [out, btn('Tutup', 'ghost', { onclick: function () { d.close(); } })]);
    d.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
  }

  /* perubahan LAPORAN CERMAT di perangkat ini yang belum terkirim (jangan sampai hilang saat keluar) */
  function laporanPending() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) return resolve(0);
      var req;
      try { req = indexedDB.open('laporan-cermat-v2'); } catch (e) { return resolve(0); }
      req.onupgradeneeded = function () { try { req.transaction.abort(); } catch (e) { /* abaikan */ } };
      req.onerror = function () { resolve(0); };
      req.onsuccess = function () {
        var db = req.result, n = 0;
        try {
          var names = ['pending', 'reports'].filter(function (x) { return db.objectStoreNames.contains(x); });
          if (!names.length) { db.close(); return resolve(0); }
          var tx = db.transaction(names, 'readonly');
          names.forEach(function (x) {
            var c = tx.objectStore(x).openCursor();
            c.onsuccess = function () { var cur = c.result; if (!cur) return; if (x === 'pending' || (cur.value && cur.value._dirty)) n++; cur.continue(); };
          });
          tx.oncomplete = function () { db.close(); resolve(n); };
          tx.onerror = function () { db.close(); resolve(n); };
        } catch (e) { db.close(); resolve(0); }
      };
    });
  }

  function logout() {
    laporanPending().then(function (n) {
      if (n && !window.confirm('Masih ada ' + n + ' perubahan LAPORAN CERMAT di perangkat ini yang belum terkirim. Buka LAPORAN CERMAT dulu supaya tersimpan. Tetap keluar?')) return;
      if (admin && dirty && !window.confirm('Ada perubahan daftar folder yang belum disimpan. Keluar dan buang perubahan?')) return;
      api('logout').catch(function () { /* abaikan */ });
      clearSession();
      if (admin) { admin = false; dirty = false; token = ''; fileSha = null; }
      clearCred();
      renderAll();
      window.scrollTo(0, 0);
    });
  }

  /* periksa sesi ke server; peran bisa berubah, sesi bisa kedaluwarsa */
  function verifySession() {
    if (!getTok()) return Promise.resolve();
    return api('me').then(function (u) { storeMe(u); renderAll(); }).catch(function (e) {
      if (e.code === 'AUTH') { clearSession(); renderAll(); toast('Sesi berakhir. Silakan masuk lagi.', true); }
      else if (!me) toast(e.message, true);
    });
  }

  /* ---------- mode admin ---------- */

  function changed() { dirty = true; renderAll(); }

  function move(i, dir) {
    var j = i + dir;
    if (j < 0 || j >= curLinks().length) return;
    var t = curLinks()[i]; curLinks()[i] = curLinks()[j]; curLinks()[j] = t;
    changed();
  }

  function renderBar() {
    var bar = $('adminbar');
    bar.textContent = '';
    bar.hidden = !admin;
    document.body.classList.toggle('is-admin', admin);
    if (!admin) return;
    bar.appendChild(h('div', { class: 'abtns' }, [
      btn('Pengaturan', 'ghost sm', { onclick: settingsDialog }),
      btn('Salin data', 'ghost sm', { onclick: copyDialog }),
      btn('Keluar', 'ghost sm', { onclick: exitAdmin })
    ]));
    bar.appendChild(btn(saving ? 'Menyimpan...' : (dirty ? 'Simpan ke GitHub' : 'Tidak ada perubahan'), 'pri', { disabled: saving || !dirty, onclick: save }));
  }

  function enterAdmin() {
    admin = true;
    dirty = false;
    $('adminlink').hidden = true;
    renderAll();
    window.scrollTo(0, 0);
  }

  function exitAdmin() {
    if (dirty && !window.confirm('Ada perubahan yang belum disimpan. Keluar dan buang perubahan?')) return;
    admin = false;
    dirty = false;
    token = '';
    fileSha = null;
    clearCred();
    loadPublic();
  }

  function adminEntry() {
    if (!me || me.peran !== 'admin') return;
    var c = readCred();
    if (!c) { loginDialog(); return; }
    repo = c.repo; token = c.token;
    toast('Membuka mode admin...');
    fetchRemote().then(function (data) {
      state = data;
      $('toast').hidden = true;
      enterAdmin();
    }).catch(function (e) {
      clearCred();
      token = '';
      toast(explain(e), true);
      loginDialog();
    });
  }

  window.addEventListener('beforeunload', function (ev) {
    if (admin && dirty) { ev.preventDefault(); ev.returnValue = ''; }
  });

  function start() {
    $('adminlink').addEventListener('click', adminEntry);
    me = cachedMe();
    loadPublic().then(function () { verifySession(); });
    window.addEventListener('hashchange', function () { renderView(); window.scrollTo(0, 0); });
    window.addEventListener('storage', function (e) {   // login/keluar dari LAPORAN CERMAT di tab lain
      if (e.key !== TOKEN_KEY) return;
      me = cachedMe(); renderAll(); if (getTok() && !me) verifySession();
    });
  }

  if (typeof document !== 'undefined' && document.getElementById('list')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})();
