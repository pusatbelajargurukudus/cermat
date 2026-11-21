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
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    close: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    pdf: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
    offline: '<path d="M7 18a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19 11a3.5 3.5 0 0 1-1 7z"/><path d="M9.5 13.5l2 2 3.5-3.5"/>'
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
    var fid = ok && me ? driveFolderId(l.url) : '';
    if (fid) { MAT_JUDUL[fid] = l.title; return h('a', { class: cls, href: '#/materi/' + fid }, kids); }   // daftar file tampil di dalam CERMAT
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
    'Berpikir Komputasional (Bagian 2): Menerapkan dalam Pembelajaran', 'Manajemen Kelas yang Efektif dalam Pembelajaran Matematika',
    'Penyusunan Asesmen HOTS', 'Menyusun RPM (Rencana Pembelajaran Mendalam) yang Berkualitas', 'Review RPM Kelas 1 dan 2', 'Review RPM Kelas 3 dan 4',
    'Review RPM Kelas 5 dan 6', 'Pembuatan Alat Peraga CPA berbasis CT', 'Micro Teaching Kelas 1 dan 2', 'Micro Teaching Kelas 3 dan 4', 'Micro Teaching Kelas 5 dan 6',
    'Observasi Pembelajaran dan Coaching Kelas 1 dan 2', 'Observasi Pembelajaran dan Coaching Kelas 3 dan 4', 'Observasi Pembelajaran dan Coaching Kelas 5 dan 6',
    'Sekolah Ramah Numerasi', 'Konsep Festival Numerasi', 'Festival Numerasi'];
  var JENIS_LBL = { pre: 'Pretes', post: 'Postes', ref: 'Refleksi' };
  var tesData = null, tesErr = '', tesBusy = false, tesTimer = null, tesAct = {}, tesWas = false;

  function tesHomeCard() {
    return h('a', { class: 'card', href: '#/tes' }, [
      h('div', { class: 'chipicon' }, [ic('soal', 26)]),
      h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: 'Pretes, Postes & Refleksi' }), h('div', { class: 'meta' }, [h('span', { text: 'Tes P1–P7 · refleksi setiap pendampingan' })])]),
      h('div', { class: 'go' }, [ic('arrow', 18, 2)])
    ]);
  }

  function onTes() { return !!me && !admin && location.hash === '#/tes'; }

  /* =========================================================
   * MATERI (#/materi/<folderId>) — isi folder Drive kartu Modul, Lembar Kerja, Bahan Tayang
   * tampil di dalam CERMAT. Guru & kepsek hanya bisa membuka materi pendampingan yang sudah
   * ditampilkan fasilitator. PDF bisa disimpan di perangkat untuk dibaca tanpa internet.
   * ========================================================= */
  var MAT_JUDUL = {}, MAT = { fid: '', data: null, err: '', busy: false, sid: '', offline: false };
  var OFF_CACHE = 'cermat-materi', OFF_IDX = 'cermat_materi_offline';
  function onMateri() { return !!me && !admin && /^#\/materi\/[A-Za-z0-9_-]{10,}$/.test(location.hash); }
  function driveFolderId(u) { var m = String(u || '').match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]{10,})/); return m ? m[1] : ''; }
  function staf() { return me && (me.peran === 'admin' || me.peran === 'fasilitator' || me.peran === 'pemantau'); }
  function offIdx() { try { return JSON.parse(localStorage.getItem(OFF_IDX) || '{}'); } catch (e) { return {}; } }
  function offSet(id, v) { var x = offIdx(); if (v) x[id] = v; else delete x[id]; try { localStorage.setItem(OFF_IDX, JSON.stringify(x)); } catch (e) { /* penuh */ } }
  function offKey(id) { return new URL('__materi_offline/' + id + '.pdf', location.href).href; }

  function bukaMateri(fid) {
    if (MAT.fid !== fid) { MAT = { fid: fid, data: null, err: '', busy: false, sid: MAT.sid, offline: false }; }
    renderMateri();
    if (!MAT.data && !MAT.busy) muatMateri(false);
  }
  function muatMateri(segar) {
    var fid = MAT.fid;
    MAT.busy = true; MAT.err = ''; renderMateri();
    api('materiList', { folderId: fid, segar: !!segar }).then(function (d) {
      if (MAT.fid !== fid) return;
      MAT.data = d; MAT.offline = false;
      try { localStorage.setItem('cermat_materi_' + fid, JSON.stringify(d)); } catch (e) { /* penuh */ }
    }).catch(function (e) {
      if (MAT.fid !== fid) return;
      var simpan = null;
      try { simpan = JSON.parse(localStorage.getItem('cermat_materi_' + fid) || 'null'); } catch (x) { simpan = null; }
      if (e.offline && simpan) { MAT.data = simpan; MAT.offline = true; }
      else MAT.err = e.message;
      if (e.code === 'AUTH') { clearSession(); renderAll(); }
    }).then(function () { if (MAT.fid === fid) { MAT.busy = false; if (onMateri()) renderMateri(); } });
  }

  var FASE_P = [[1, 7], [8, 16], [17, 22]];
  function grupMateri(files) {
    var g = {};
    files.forEach(function (f) {
      var k = f.dari === null || f.dari === undefined ? 'u' : (f.dari === f.sampai ? 'p' : 'r') + ('0' + f.dari).slice(-2) + '-' + ('0' + f.sampai).slice(-2);
      (g[k] = g[k] || { key: k, dari: f.dari, sampai: f.sampai, files: [] }).files.push(f);
    });
    return Object.keys(g).sort(function (a, b) {
      if (a === 'u') return 1; if (b === 'u') return -1;
      return (g[a].dari - g[b].dari) || (g[a].sampai - g[b].sampai);
    }).map(function (k) { return g[k]; });
  }
  function judulGrup(gr, satu) {
    if (gr.key === 'u') return satu ? 'Semua file' : 'Umum';
    if (gr.dari === gr.sampai) return 'P' + gr.dari + ' · ' + (TES_JUDUL[gr.dari - 1] || '');
    var f = FASE_P.map(function (x) { return x[0] === gr.dari && x[1] === gr.sampai; }).indexOf(true);
    return 'P' + gr.dari + '–P' + gr.sampai + (f >= 0 ? ' · Fase ' + (f + 1) : '');
  }
  function grupTerbuka(gr, nos) {
    if (gr.key === 'u') return true;
    for (var n = gr.dari; n <= gr.sampai; n++) if (nos.indexOf(n) >= 0) return true;
    return false;
  }
  var MIME = {
    'application/pdf': ['PDF', 'pdf'], 'application/vnd.google-apps.presentation': ['Google Slides', 'tayang'], 'application/vnd.google-apps.document': ['Google Docs', 'template'],
    'application/vnd.google-apps.spreadsheet': ['Google Sheets', 'chart'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['PowerPoint', 'tayang'], 'application/vnd.ms-powerpoint': ['PowerPoint', 'tayang'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['Word', 'template'], 'application/msword': ['Word', 'template'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['Excel', 'chart']
  };
  function jenisFile(f) { var m = MIME[f.mime]; if (m) return m; if (/^image\//.test(f.mime)) return ['Gambar', 'foto']; if (/^video\//.test(f.mime)) return ['Video', 'tayang']; return ['File', 'folder']; }
  function ukuranTeks(b) { b = Number(b) || 0; if (!b) return ''; return b >= 1048576 ? (b / 1048576).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function namaTampil(n) { return String(n || '').replace(/\.(pdf|docx?|pptx?|xlsx?)$/i, ''); }
  function unduhUrl(f) {
    if (f.mime === 'application/vnd.google-apps.presentation') return 'https://docs.google.com/presentation/d/' + f.id + '/export/pptx';
    if (f.mime === 'application/vnd.google-apps.document') return 'https://docs.google.com/document/d/' + f.id + '/export?format=docx';
    if (f.mime === 'application/vnd.google-apps.spreadsheet') return 'https://docs.google.com/spreadsheets/d/' + f.id + '/export?format=xlsx';
    return 'https://drive.google.com/uc?export=download&id=' + f.id;
  }

  function renderMateri() {
    var tv = $('tesview'); if (!tv || !me) return;
    var d = MAT.data, peran = me.peran, peserta = peran === 'guru' || peran === 'kepsek';
    tv.textContent = '';
    tv.appendChild(h('div', { class: 'teshead' }, [
      h('a', { class: 'btn ghost sm', href: '#/' }, [ic('back', 16, 2.2), h('span', { text: 'Folder utama' })]),
      h('span', { class: 'spacer' }),
      btn(MAT.busy ? 'Memuat…' : 'Muat ulang', 'ghost sm', { disabled: MAT.busy, onclick: function () { muatMateri(staf()); } })
    ]));
    var judul = (d && d.kartu) || MAT_JUDUL[MAT.fid] || 'Materi';
    var sub = peserta ? 'Ketuk file untuk membukanya. Materi pendampingan terbuka setelah ditampilkan fasilitator.'
      : peran === 'fasilitator' ? 'Ketuk file untuk membukanya. Tampilkan materi setiap pendampingan untuk guru dan kepala sekolah sekolah binaan Anda; materi juga tampil otomatis saat pretes diaktifkan.'
      : 'Ketuk file untuk membukanya. Status menunjukkan materi yang sudah ditampilkan untuk sekolah terpilih.';
    tv.appendChild(h('div', { class: 'label' }, [h('h2', { text: judul }), h('p', { class: 'sub', text: sub })]));
    if (MAT.err) { tv.appendChild(h('div', { class: 'empty-note', text: MAT.err })); return; }
    if (!d) { for (var i = 0; i < 3; i++) tv.appendChild(h('div', { class: 'skel' })); return; }
    if (MAT.offline) tv.appendChild(h('div', { class: 'notice mnote' }, [h('strong', { text: 'Tanpa internet' }), h('span', { text: 'Daftar dari penyimpanan perangkat. Hanya file bertanda "Tersimpan" yang bisa dibuka.' })]));
    var sks = d.sekolah || [];
    if (!MAT.sid || !sks.some(function (x) { return x.id === MAT.sid; })) MAT.sid = sks.length ? sks[0].id : '';
    if (staf() && sks.length > 1) {
      var sel = h('select', { class: 'msel', 'aria-label': 'Sekolah' }, sks.map(function (x) { return h('option', { value: x.id, text: x.nama, selected: x.id === MAT.sid }); }));
      sel.addEventListener('change', function () { MAT.sid = sel.value; renderMateri(); });
      tv.appendChild(h('label', { class: 'mselw' }, [h('span', { text: 'Status untuk sekolah' }), sel]));
    }
    var sk = sks.filter(function (x) { return x.id === MAT.sid; })[0];
    var nos = ((d.buka || {})[MAT.sid]) || [];
    var bisaAtur = (peran === 'fasilitator' || peran === 'admin') && !!sk && !MAT.offline;
    var grup = grupMateri(d.files || []);
    if (!grup.length) { tv.appendChild(h('div', { class: 'empty-note', text: 'Folder ini masih kosong.' })); return; }
    var off = offIdx();
    grup.forEach(function (gr) {
      var terbuka = grupTerbuka(gr, nos), satuP = gr.key.charAt(0) === 'p';
      var kepala = [h('div', { class: 'mgt' }, [h('b', { text: judulGrup(gr, grup.length === 1) }), h('span', { text: gr.files.length + ' file' })])];
      var status = null, aksi = null;
      if (gr.key === 'u') status = grup.length > 1 ? tag('pub', null, 'Selalu terbuka') : null;
      else if (peserta) status = terbuka ? null : tag('hid', 'lock', 'Terkunci');
      else if (sk) {
        status = terbuka ? tag('open', 'check', satuP ? 'Tampil untuk guru' : 'Terbuka untuk guru') : tag('hid', 'lock', satuP ? 'Terkunci untuk guru' : 'Terbuka setelah P' + gr.dari + '–P' + gr.sampai + ' ditampilkan');
        if (bisaAtur && satuP) aksi = btn(MAT.act === gr.dari ? '…' : (terbuka ? 'Sembunyikan' : 'Tampilkan'), terbuka ? 'ghost sm' : 'pri sm', { disabled: !!MAT.act, onclick: function () { aturMateri(sk, gr.dari, !terbuka); } });
      }
      kepala.push(h('div', { class: 'mgs' }, [status, aksi]));
      var rows = gr.files.map(function (f) {
        var j = jenisFile(f), kunci = !!f.kunci || !f.id, ofl = off[f.id];
        var meta = [j[0], ukuranTeks(f.ukuran), f.folder && f.folder.indexOf(' / ') > 0 ? f.folder.split(' / ').slice(1).join(' / ') : ''].filter(Boolean).join(' · ');
        var kids = [h('span', { class: 'mfi' }, [ic(j[1], 20, 1.8)]), h('span', { class: 'mft' }, [h('b', { text: namaTampil(f.nama) }), h('span', { text: meta })]),
          ofl ? h('span', { class: 'tag open moff' }, [ic('offline', 12, 2), 'Tersimpan']) : null];
        if (kunci) return h('div', { class: 'mfile lock', 'aria-disabled': 'true' }, kids.concat([ic('lock', 16, 2)]));
        var b = h('button', { type: 'button', class: 'mfile', onclick: function () { lihatFile(f); } }, kids);
        if (peran === 'admin' && gr.key.charAt(0) !== 'p' && !MAT.offline) {
          return h('div', { class: 'mrow' }, [b, h('button', { type: 'button', class: 'mrng', title: 'Atur rentang pendampingan file ini', onclick: function () { rentangDialog(f); } }, [h('span', { text: f.dari ? 'P' + f.dari + (f.sampai !== f.dari ? '–P' + f.sampai : '') : 'Rentang' })])]);
        }
        return b;
      });
      var body = [h('div', { class: 'mgh' }, kepala)];
      if (peserta && !terbuka) body.push(h('p', { class: 'tesnote', text: 'Dibuka fasilitator saat pendampingan.' }));
      body.push(h('div', { class: 'mfiles' }, rows));
      tv.appendChild(h('div', { class: 'card mgrp' + (peserta && !terbuka ? ' empty' : '') }, body));
    });
  }
  function aturMateri(sk, no, tampil) {
    MAT.act = no; renderMateri();
    api('materiSet', { sekolahId: sk.id, no: no, tampil: tampil }).then(function (r) {
      MAT.data.buka = Object.assign({}, MAT.data.buka || {}, r.buka);
      if (!r.buka[sk.id]) MAT.data.buka[sk.id] = [];
      toast('Materi P' + no + (tampil ? ' ditampilkan untuk guru & kepala sekolah ' : ' disembunyikan dari ') + sk.nama + '.');
    }).catch(function (e) { toast(e.message, true); }).then(function () { MAT.act = 0; renderMateri(); });
  }
  function rentangDialog(f) {
    var opsi = function (v) { return [h('option', { value: '', text: '—' })].concat(TES_JUDUL.map(function (t, i) { return h('option', { value: String(i + 1), text: 'P' + (i + 1), selected: Number(v) === i + 1 }); })); };
    var a = h('select', {}, opsi(f.dari)), b = h('select', {}, opsi(f.sampai)), err = errBox();
    var simpan = btn('Simpan', 'pri', { onclick: function () {
      var x = a.value ? Number(a.value) : '', y = b.value ? Number(b.value) : x;
      if (x !== '' && y < x) { showErr(err, 'P akhir tidak boleh sebelum P awal.'); return; }
      simpan.disabled = true;
      api('materiPeta', x === '' ? { fileId: f.id, hapus: true } : { fileId: f.id, dari: x, sampai: y }).then(function () { dd.close(); toast('Rentang disimpan.'); muatMateri(true); })
        .catch(function (e) { showErr(err, e.message); simpan.disabled = false; });
    } });
    var dd = openDialog('Rentang pendampingan', [
      h('p', { class: 'dnote', text: '“' + namaTampil(f.nama) + '” terbuka untuk guru dan kepala sekolah begitu salah satu pendampingan di rentang ini ditampilkan fasilitator. Kosongkan agar selalu terbuka.' }),
      h('div', { class: 'mrgrid' }, [field('Dari', a), field('Sampai', b)]), err], [btn('Batal', 'ghost', { onclick: function () { dd.close(); } }), simpan]);
    dd.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
  }

  /* ---------- penampil file ---------- */
  function lihatFile(f) {
    var adaOff = !!offIdx()[f.id], pdf = f.mime === 'application/pdf';
    var wrap = h('div', { class: 'mview', role: 'dialog', 'aria-modal': 'true', 'aria-label': namaTampil(f.nama) });
    var body = h('div', { class: 'mvb' });
    var tutup = function () { if (wrap.parentNode) { wrap.parentNode.removeChild(wrap); document.body.classList.remove('noscroll'); window.removeEventListener('popstate', onPop); document.removeEventListener('keydown', onKey); } };
    var onPop = function () { tutup(); };
    var onKey = function (ev) { if (ev.key === 'Escape') history.back(); };
    var offBtn = null;
    if (pdf && !MAT.offline) {
      offBtn = btn(adaOff ? 'Tersimpan' : 'Simpan offline', 'ghost sm moffbtn', { title: adaOff ? 'Hapus dari perangkat' : 'Simpan untuk dibaca tanpa internet', onclick: function () {
        if (offIdx()[f.id]) { hapusOffline(f).then(function () { offBtn.lastChild.textContent = 'Simpan offline'; toast('File dihapus dari perangkat.'); renderMateri(); }); return; }
        simpanOffline(f, offBtn).then(function () { offBtn.lastChild.textContent = 'Tersimpan'; renderMateri(); }).catch(function (e) { offBtn.lastChild.textContent = 'Simpan offline'; offBtn.disabled = false; toast(e.message, true); });
      } });
      offBtn.insertBefore(ic('offline', 16, 2), offBtn.firstChild);
      offBtn.lastChild && (offBtn.lastChild.nodeType === 3) && (offBtn.replaceChild(h('span', { text: offBtn.lastChild.textContent }), offBtn.lastChild));
    }
    var bar = h('div', { class: 'mvh' }, [
      h('button', { type: 'button', class: 'ib', 'aria-label': 'Tutup', title: 'Tutup', onclick: function () { history.back(); } }, [ic('close', 20, 2)]),
      h('div', { class: 'mvt' }, [h('b', { text: namaTampil(f.nama) }), h('span', { text: [jenisFile(f)[0], ukuranTeks(f.ukuran)].filter(Boolean).join(' · ') })]),
      h('div', { class: 'mva' }, [
        offBtn,
        MAT.offline ? null : h('a', { class: 'btn ghost sm', href: unduhUrl(f), target: '_blank', rel: 'noopener' }, [ic('download', 16, 2), h('span', { text: 'Unduh' })]),
        staf() && !MAT.offline ? h('a', { class: 'btn ghost sm', href: 'https://drive.google.com/file/d/' + f.id + '/view', target: '_blank', rel: 'noopener', title: 'Buka di Google Drive' }, [ic('external', 16, 2), h('span', { text: 'Drive' })]) : null
      ])
    ]);
    wrap.appendChild(bar); wrap.appendChild(body);
    document.body.appendChild(wrap); document.body.classList.add('noscroll');
    history.pushState({ mview: 1 }, ''); window.addEventListener('popstate', onPop); document.addEventListener('keydown', onKey);
    if (pdf && adaOff) { tampilPdfOffline(f, body); return; }
    if (!navigator.onLine || MAT.offline) { body.appendChild(h('div', { class: 'empty-note', text: 'Tidak ada internet. File ini belum disimpan untuk dibaca offline.' })); return; }
    body.appendChild(h('div', { class: 'mvload' }, [h('div', { class: 'skel' }), h('p', { class: 'dnote', text: 'Membuka file…' })]));
    var fr = h('iframe', { src: 'https://drive.google.com/file/d/' + f.id + '/preview', title: namaTampil(f.nama), allow: 'autoplay; fullscreen', allowfullscreen: true });
    fr.addEventListener('load', function () { var l = body.querySelector('.mvload'); if (l) l.remove(); });
    body.appendChild(fr);
  }

  /* ---------- simpan PDF untuk offline ---------- */
  function simpanOffline(f, b) {
    if (!('caches' in window)) return Promise.reject(new Error('Perangkat ini tidak mendukung penyimpanan offline.'));
    b.disabled = true;
    var bagian = [], parts = 1;
    var ambil = function (i) {
      b.lastChild.textContent = 'Menyimpan' + (parts > 1 ? ' ' + (i + 1) + '/' + parts : '') + '…';
      return api('materiPdf', { fileId: f.id, part: i }).then(function (r) {
        parts = r.parts;
        var bin = atob(r.b64), u = new Uint8Array(bin.length);
        for (var k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k);
        bagian.push(u);
        return i + 1 < parts ? ambil(i + 1) : null;
      });
    };
    return ambil(0).then(function () {
      var blob = new Blob(bagian, { type: 'application/pdf' });
      return caches.open(OFF_CACHE).then(function (c) { return c.put(offKey(f.id), new Response(blob, { headers: { 'Content-Type': 'application/pdf' } })); })
        .then(function () { offSet(f.id, { nama: f.nama, ukuran: blob.size, waktu: Date.now() }); b.disabled = false; toast('Tersimpan di perangkat. File ini bisa dibuka tanpa internet.'); muatPdfJs().catch(function () { /* nanti */ }); });
    });
  }
  function hapusOffline(f) {
    offSet(f.id, null);
    return 'caches' in window ? caches.open(OFF_CACHE).then(function (c) { return c.delete(offKey(f.id)); }) : Promise.resolve();
  }
  var pdfjsP = null;
  function muatPdfJs() {
    if (!pdfjsP) pdfjsP = import(new URL(LAPORAN + 'vendor/pdfjs/pdf.min.mjs', location.href).href).then(function (m) {
      m.GlobalWorkerOptions.workerSrc = new URL(LAPORAN + 'vendor/pdfjs/pdf.worker.min.mjs', location.href).href;
      fetch(m.GlobalWorkerOptions.workerSrc).catch(function () { /* disimpan service worker bila online */ });
      return m;
    }).catch(function (e) { pdfjsP = null; throw e; });
    return pdfjsP;
  }
  function tampilPdfOffline(f, body) {
    body.classList.add('pdfv');
    var pesan = h('p', { class: 'dnote', text: 'Membuka dari perangkat…' });
    body.appendChild(pesan);
    Promise.all([caches.open(OFF_CACHE).then(function (c) { return c.match(offKey(f.id)); }), muatPdfJs()]).then(function (r) {
      if (!r[0]) throw new Error('Salinan di perangkat tidak ditemukan. Simpan ulang file ini.');
      return r[0].arrayBuffer().then(function (buf) { return r[1].getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise; });
    }).then(function (doc) {
      pesan.remove();
      var lebar = Math.min(body.clientWidth - 16, 900), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var obs = 'IntersectionObserver' in window ? new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting && !en.target._ok) { en.target._ok = 1; gambar(en.target); } });
      }, { root: body, rootMargin: '600px 0px' }) : null;
      var gambar = function (box) {
        doc.getPage(box._n).then(function (pg) {
          var v0 = pg.getViewport({ scale: 1 }), sc = lebar / v0.width, v = pg.getViewport({ scale: sc * dpr });
          var cv = h('canvas', {}); cv.width = v.width; cv.height = v.height; cv.style.width = lebar + 'px'; cv.style.height = (v.height / dpr) + 'px';
          box.textContent = ''; box.style.height = ''; box.appendChild(cv);
          pg.render({ canvasContext: cv.getContext('2d'), viewport: v });
        });
      };
      for (var n = 1; n <= doc.numPages; n++) {
        var box = h('div', { class: 'pdfpg' }); box._n = n; box.style.width = lebar + 'px'; box.style.height = Math.round(lebar * 1.414) + 'px';
        body.appendChild(box);
        if (obs) obs.observe(box); else gambar(box);
      }
    }).catch(function (e) { pesan.textContent = e.message || 'PDF tidak bisa dibuka.'; });
  }

  function renderView() {
    var tv = $('tesview'), t = onTes(), mt = onMateri(), v = t || mt;
    if (!tv) return;
    tv.hidden = !v;
    if (me) ['list', 'addwrap'].forEach(function (id) { $(id).hidden = v; });
    var lb = document.querySelector('.label'); if (lb && me) lb.hidden = v;
    clearInterval(tesTimer); tesTimer = null;
    var masuk = t && !tesWas;
    tesWas = t;
    if (mt) { bukaMateri(location.hash.slice(9)); return; }
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
  /* Jabatan di form bisa jawaban singkat (diisi apa adanya) atau pilihan (dipilih yang cocok, mis. "Guru Kelas 2" -> "Guru Kelas") */
  function tesJabatanVal(t, jab) {
    if (!t.entJabatan || !jab) return '';
    var opsi = t.opsiJabatan || [];
    if (!opsi.length) return jab;
    var j = jab.toLowerCase();
    return opsi.filter(function (o) { return o.toLowerCase() === j; })[0]
      || opsi.filter(function (o) { var x = o.toLowerCase(); return j.indexOf(x) === 0 || x.indexOf(j) === 0; }).sort(function (a, b) { return b.length - a.length; })[0] || '';
  }
  function tesSrc(t, jenis) { return jenis === 'ref' ? (t.ref || {}) : t; }   // refleksi punya form sendiri
  function tesUrl(t, jenis, sk, orang) {
    var src = tesSrc(t, jenis);
    if (!src.url) return '';
    var q = [];
    if (jenis !== 'ref' && t.entJenis) q.push('entry.' + t.entJenis + '=' + encodeURIComponent(jenis === 'pre' ? t.optPre : t.optPost));
    var sv = tesSekolahVal(src, sk);
    if (sv) q.push('entry.' + src.entSekolah + '=' + encodeURIComponent(sv));
    if (orang && orang.nama && src.entNama) q.push('entry.' + src.entNama + '=' + encodeURIComponent(orang.nama));
    var jv = orang && tesJabatanVal(src, orang.jabatan);
    if (jv) q.push('entry.' + src.entJabatan + '=' + encodeURIComponent(jv));
    return src.url + (q.length ? (src.url.indexOf('?') < 0 ? '?' : '&') + 'usp=pp_url&' + q.join('&') : '');
  }
  /* "Pilih nama Anda": akun guru dipakai bersama, jadi nama dipilih dari Data guru sekolah sebelum form dibuka */
  function pilihNamaDialog(t, jenis, sk, orang) {
    var lbl = JENIS_LBL[jenis];
    var KEY = 'cermat_tes_nama_' + sk.id, akhir = '';
    try { akhir = localStorage.getItem(KEY) || ''; } catch (e) { /* penyimpanan tidak tersedia */ }
    var daftar = orang.slice().sort(function (a, b) { return (b.nama === akhir) - (a.nama === akhir); });
    var pilih = null;   // objek orang, atau {lain:true}
    var cari = h('input', { type: 'text', placeholder: 'Cari nama…', autocomplete: 'off', 'aria-label': 'Cari nama' });
    var list = h('div', { class: 'pnlist', role: 'radiogroup', 'aria-label': 'Nama peserta' });
    var go = h('a', { class: 'btn pri pngo', target: '_blank', rel: 'noopener', 'aria-disabled': 'true' }, [h('span', { text: 'Pilih nama dulu' })]);
    var tutup = btn('Batal', 'ghost', { onclick: function () { dd.close(); } });
    var setGo = function () {
      if (!pilih) { go.removeAttribute('href'); go.setAttribute('aria-disabled', 'true'); go.firstChild.textContent = 'Pilih nama dulu'; return; }
      go.removeAttribute('aria-disabled');
      go.href = tesUrl(t, jenis, sk, pilih.lain ? null : pilih);
      go.firstChild.textContent = pilih.lain ? 'Lanjut ke ' + lbl + ' (isi nama sendiri)' : 'Lanjut ke ' + lbl + ' sebagai ' + pilih.nama;
    };
    var item = function (o, lain) {
      var b = h('button', { type: 'button', class: 'pn' + (lain ? ' lain' : ''), role: 'radio', 'aria-checked': 'false' }, [
        h('span', { class: 'pnn', text: lain ? 'Nama saya tidak ada di daftar' : o.nama }),
        h('span', { class: 'pnj', text: lain ? 'Form dibuka dengan nama kosong, ketik sendiri' : (o.jabatan || '') + (o.nama === akhir ? (o.jabatan ? ' · ' : '') + 'terakhir dipilih di perangkat ini' : '') })]);
      b.addEventListener('click', function () {
        [].forEach.call(list.querySelectorAll('.pn'), function (x) { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('on'); b.setAttribute('aria-checked', 'true');
        pilih = lain ? { lain: true } : o; setGo();
      });
      b._cari = lain ? '' : o.nama.toLowerCase();
      return b;
    };
    daftar.forEach(function (o) { list.appendChild(item(o)); });
    list.appendChild(item(null, true));
    cari.addEventListener('input', function () {
      var q = cari.value.trim().toLowerCase();
      [].forEach.call(list.querySelectorAll('.pn'), function (x) { x.hidden = !!q && x._cari !== '' && x._cari.indexOf(q) < 0; });
    });
    go.addEventListener('click', function (ev) {
      if (!pilih) { ev.preventDefault(); return; }
      try { if (!pilih.lain) localStorage.setItem(KEY, pilih.nama); } catch (e) { /* abaikan */ }
      if (jenis === 'post') tandaiPostes(t, sk, pilih.lain ? null : pilih);
      setTimeout(function () { dd.close(); }, 50);
    });
    var dd = openDialog('Pilih nama Anda', [
      h('p', { class: 'dnote', text: lbl + ' P' + t.no + ' · ' + sk.nama + '. Nama Anda terisi otomatis di form, jadi tidak perlu diketik.' }),
      cari, list], [tutup, go]);
    dd.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    dd.dlg.classList.add('pnd');
  }

  /* Tawaran refleksi: setelah membuka form postes, saat kembali ke CERMAT muncul "Lanjut isi Refleksi" (bila refleksi dibuka) */
  var TAWAR = 'cermat_tawar_refleksi';
  function tandaiPostes(t, sk, orang) {
    if (!(t.ref && t.ref.ada)) return;
    try { localStorage.setItem(TAWAR, JSON.stringify({ no: t.no, sid: sk.id, orang: orang || null, at: Date.now() })); } catch (e) { /* abaikan */ }
  }
  function cekTawaran() {
    if (document.visibilityState !== 'visible' || !me) return;
    var p = null;
    try { p = JSON.parse(localStorage.getItem(TAWAR) || 'null'); } catch (e) { p = null; }
    if (!p || Date.now() - p.at < 3000) return;
    try { localStorage.removeItem(TAWAR); } catch (e) { /* abaikan */ }
    if (Date.now() - p.at > 6 * 3600e3 || document.querySelector('dialog[open]')) return;
    api('tesList').then(function (d) {
      tesData = d; if (onTes()) renderTes();
      var t = (d.tes || []).filter(function (x) { return x.no === p.no; })[0];
      var sk = (d.sekolah || []).filter(function (x) { return x.id === p.sid; })[0];
      var st = t && sk ? ((t.status || {})[sk.id] || {}) : {};
      if (!t || !sk || !st.ref || !(t.ref && t.ref.url)) return;
      var orang = p.orang || (me.peran === 'kepsek' ? d.saya : null);
      var pilihDulu = !orang && me.peran === 'guru' && t.ref.entNama && (d.orang || []).length;
      var nanti = btn('Nanti', 'ghost', { onclick: function () { dd.close(); } });
      var isi = pilihDulu
        ? btn('Isi refleksi sekarang', 'pri', { onclick: function () { dd.close(); pilihNamaDialog(t, 'ref', sk, d.orang); } })
        : h('a', { class: 'btn pri pngo', href: tesUrl(t, 'ref', sk, orang), target: '_blank', rel: 'noopener', onclick: function () { setTimeout(function () { dd.close(); }, 50); } }, [h('span', { text: 'Isi refleksi sekarang' + (orang ? ' sebagai ' + orang.nama : '') })]);
      var dd = openDialog('Postes selesai?', [
        h('p', { class: 'dnote', text: 'Lanjut isi Refleksi P' + t.no + ' · ' + (TES_JUDUL[t.no - 1] || '') + '. Bila belum sempat, refleksi tetap bisa diisi lewat tombol Isi Refleksi sampai ditutup fasilitator.' })], [nanti, isi]);
      dd.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    }).catch(function () { /* diam: tawaran hanya pelengkap */ });
  }
  document.addEventListener('visibilitychange', cekTawaran);

  function jamTutup(st) { try { return new Date(st.sampai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.'); } catch (e) { return '23.59'; } }

  function tesSet(t, sk, jenis, buka) {
    var k = t.no + jenis + sk.id;
    if (tesAct[k]) return;
    var preBuka = !!((t.status || {})[sk.id] || {}).pre;
    tesAct[k] = true; renderTes();
    api('tesSet', { sekolahId: sk.id, no: t.no, jenis: jenis, buka: buka }).then(function (d) {
      tesData = d;
      var pesan = JENIS_LBL[jenis] + ' P' + t.no + (buka ? ' dibuka untuk ' + sk.nama + ' sampai pukul 23.59.' : ' ditutup.');
      if (buka && jenis === 'pre') pesan += ' Materi P' + t.no + ' ikut ditampilkan.';
      if (buka && jenis === 'post' && preBuka) pesan += ' Pretes otomatis ditutup.';
      if (buka && jenis === 'post' && t.ref && t.ref.ada) pesan += ' Refleksi ikut dibuka.';
      toast(pesan);
    }).catch(function (e) { toast(e.message, true); }).then(function () { delete tesAct[k]; renderTes(); });
  }

  /* Tombol untuk guru & kepala sekolah: terkunci sampai dibuka fasilitator */
  function tombolPeserta(t, j, sk, st, d) {
    var lbl = JENIS_LBL[j], src = tesSrc(t, j), verb = j === 'ref' ? 'Isi ' : 'Kerjakan ';
    if (!(st[j] && src.url)) return h('span', { class: 'btn lockd', 'aria-disabled': 'true' }, [ic('lock', 15, 2.2), h('span', { text: lbl + ' belum dibuka' })]);
    // guru: pilih nama dulu supaya nama di form sama persis dengan data; kepala sekolah: namanya langsung terisi
    if (me.peran === 'guru' && src.entNama && (d.orang || []).length) return btn(verb + lbl, 'pri', { onclick: function () { pilihNamaDialog(t, j, sk, d.orang); } });
    var saya = me.peran === 'kepsek' ? d.saya : null;
    var a = h('a', { class: 'btn pri', href: tesUrl(t, j, sk, saya), target: '_blank', rel: 'noopener' }, [h('span', { text: verb + lbl })]);
    if (j === 'post') a.addEventListener('click', function () { tandaiPostes(t, sk, saya); });
    return a;
  }

  function renderTes() {
    var tv = $('tesview'); if (!tv || !me) return;
    var peran = me.peran, d = tesData;
    var peserta = peran === 'guru' || peran === 'kepsek';
    var sub = peserta ? 'Ketuk tes yang sudah dibuka fasilitator. Tombol yang terkunci akan terbuka saat pendampingan.'
      : peran === 'fasilitator' ? 'Buka tes untuk sekolah binaan Anda saat pendampingan. Membuka postes otomatis menutup pretes dan membuka refleksi. Semua tertutup sendiri pukul 23.59 hari itu.'
      : peran === 'admin' ? 'Isi tautan Google Form tes dan refleksi tiap pendampingan lewat Atur tautan. Status menunjukkan yang sedang dibuka di setiap sekolah.'
      : 'Tes dan refleksi yang sedang dibuka di setiap sekolah.';
    tv.textContent = '';
    var head = h('div', { class: 'teshead' }, [
      h('a', { class: 'btn ghost sm', href: '#/' }, [ic('back', 16, 2.2), h('span', { text: 'Folder utama' })]),
      h('span', { class: 'spacer' }),
      peran === 'admin' ? btn('Atur tautan', 'pri sm', { onclick: tesLinksDialog }) : null,
      btn(tesBusy ? 'Memuat…' : 'Muat ulang', 'ghost sm', { disabled: tesBusy, onclick: function () { loadTes(); } })
    ]);
    tv.appendChild(head);
    tv.appendChild(h('div', { class: 'label' }, [h('h2', { text: 'Pretes, Postes & Refleksi' }), h('p', { class: 'sub', text: sub })]));
    if (tesErr) { tv.appendChild(h('div', { class: 'empty-note', text: tesErr })); return; }
    if (!d) { var g0 = h('div', { class: 'tesgrid' }); for (var i = 0; i < 4; i++) g0.appendChild(h('div', { class: 'skel' })); tv.appendChild(g0); return; }
    var sks = d.sekolah || [];
    if (!sks.length && peran !== 'admin' && peran !== 'pemantau') { tv.appendChild(h('div', { class: 'empty-note', text: peserta ? 'Akun ini belum terhubung ke sekolah. Hubungi admin.' : 'Anda belum dipasangkan ke sekolah binaan. Hubungi admin.' })); return; }
    var grid = h('div', { class: 'tesgrid' });
    d.tes.forEach(function (t) {
      var adaRef = !!(t.ref && t.ref.ada);
      var jenisAda = (t.ada ? ['pre', 'post'] : []).concat(adaRef ? ['ref'] : []);
      if (!jenisAda.length && (t.no > 7 || peserta) && peran !== 'admin') return;   // pendampingan tanpa form: tidak ditampilkan
      var kids = [h('div', { class: 'teshd' }, [h('span', { class: 'tesno', text: 'P' + t.no }), h('div', { class: 'txt' }, [h('span', { class: 'ttl', text: 'Pendampingan ' + t.no }), h('span', { class: 'meta', text: TES_JUDUL[t.no - 1] || '' })])])];
      if (!jenisAda.length) kids.push(h('p', { class: 'tesnote', text: t.no > 7 ? 'Tautan form refleksi belum diisi admin.' : 'Tautan Google Form belum diisi admin.' }));
      else if (peserta) {
        var sk = sks[0], st = (t.status || {})[sk && sk.id] || {};
        kids.push(h('div', { class: 'tesbtns' }, jenisAda.map(function (j) { return tombolPeserta(t, j, sk, st, d); })));
        var open = jenisAda.filter(function (j) { return st[j]; });
        if (open.length) kids.push(h('p', { class: 'tesnote ok', text: 'Dibuka sampai pukul ' + jamTutup(st[open[0]]) + '.' }));
      } else if (peran === 'fasilitator') {
        sks.forEach(function (sk) {
          var st = (t.status || {})[sk.id] || {};
          var rows = jenisAda.map(function (j) {
            var lbl = JENIS_LBL[j], on = !!st[j], busy = tesAct[t.no + j + sk.id], u = tesUrl(t, j, sk);
            return h('div', { class: 'tesrow' }, [
              h('b', { text: lbl }),
              h('span', { class: 'tag ' + (on ? 'open' : 'hid'), title: on ? 'Dibuka sampai pukul ' + jamTutup(st[j]) : '', text: on ? 'Dibuka' : 'Tertutup' }),
              h('span', { class: 'spacer' }),
              btn(busy ? '…' : (on ? 'Tutup' : 'Aktifkan'), on ? 'ghost sm' : 'pri sm', { disabled: !!busy, onclick: function () { tesSet(t, sk, j, !on); } }),
              u ? h('a', { class: 'ib', href: u, target: '_blank', rel: 'noopener', title: 'Buka form ' + lbl, 'aria-label': 'Buka form ' + lbl }, [ic('link', 16, 2)]) : null
            ]);
          });
          if (sks.length > 1) kids.push(h('div', { class: 'tessk', text: sk.nama }));
          kids.push(h('div', { class: 'tesrows' }, rows));
        });
        kids.push(h('div', { class: 'tesbtns' }, [t.ada ? hasilBtn(t) : null, adaRef ? refBtn(t) : null]));
      } else {
        var aktif = [];
        sks.forEach(function (sk) { var st = (t.status || {})[sk.id]; if (st) { var on = ['pre', 'post', 'ref'].filter(function (j) { return st[j]; }); if (on.length) aktif.push(sk.nama + ': ' + on.map(function (j) { return JENIS_LBL[j].toLowerCase(); }).join(' & ')); } });
        if (jenisAda.length) kids.push(h('div', { class: 'tesnote' + (aktif.length ? ' ok' : '') }, aktif.length ? aktif.map(function (x) { return h('div', { text: 'Dibuka · ' + x }); }) : [h('span', { text: 'Tidak ada sekolah yang sedang membuka form ini.' })]));
        kids.push(h('div', { class: 'tesbtns' }, [
          t.ada ? hasilBtn(t) : null, adaRef ? refBtn(t) : null,
          peran === 'admin' && t.url ? h('a', { class: 'btn ghost sm', href: tesUrl(t, 'pre'), target: '_blank', rel: 'noopener' }, [h('span', { text: 'Lihat form tes' })]) : null,
          peran === 'admin' && adaRef && t.ref.url ? h('a', { class: 'btn ghost sm', href: tesUrl(t, 'ref'), target: '_blank', rel: 'noopener' }, [h('span', { text: 'Lihat form refleksi' })]) : null]));
      }
      grid.appendChild(h('div', { class: 'card tes' + (jenisAda.length ? '' : ' empty') }, kids));
    });
    tv.appendChild(grid);
  }

  /* ---------- Lihat hasil: nilai langsung dari jawaban Google Form ----------
   * Aturan sama dengan impor di LAPORAN CERMAT (memakai js/importer.js milik LAPORAN): kolom dikenali otomatis,
   * kiriman terakhir per nama & jenis tes yang dipakai, nama sekolah dicocokkan termasuk ejaan lain. */
  function hasilBtn(t) {
    return btn('Lihat hasil', 'ghost sm hasilbtn', { onclick: function () { hasilDialog(t); } });
  }
  function refBtn(t) {
    return btn('Lihat refleksi', 'ghost sm hasilbtn', { onclick: function () { refleksiDialog(t); } });
  }
  /* Siapa saja yang sudah mengisi refleksi, per sekolah. Rangkuman analisis jawaban ada di laporan (LAPORAN CERMAT). */
  function refleksiDialog(t) {
    var body = h('div', { class: 'hasil' }, [h('div', { class: 'skel' }), h('p', { class: 'dnote', text: 'Membaca jawaban Google Form…' })]);
    var d = openDialog('Refleksi P' + t.no + ' · ' + (TES_JUDUL[t.no - 1] || ''), [body], [btn('Tutup', 'ghost', { onclick: function () { d.close(); } })]);
    d.dlg.classList.add('wide');
    d.form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    var sks = (tesData && tesData.sekolah) || [];
    var semua = me.peran === 'admin' || me.peran === 'pemantau';
    Promise.all([loadImporter(), api('tesResponses', semua ? { no: t.no, jenis: 'ref' } : { no: t.no, jenis: 'ref', sekolahId: (sks[0] || {}).id })]).then(function (r) {
      var I = r[0], res = r[1];
      body.textContent = '';
      body.appendChild(h('p', { class: 'dnote', text: 'Langsung dari Google Form "' + (res.judul || '') + '" · ' + res.jumlah + ' jawaban. Rangkuman analisis jawaban ada di laporan pendampingan (LAPORAN CERMAT → langkah Lampiran).' }));
      if (!res.jumlah) { body.appendChild(h('div', { class: 'empty-note', text: 'Belum ada yang mengisi.' })); return; }
      var an = I.analyze(res.rows), c = an.cols;
      if (c.nama < 0 || c.sekolah < 0) throw new Error('Pertanyaan Nama atau Asal sekolah tidak ditemukan di form refleksi.');
      var nilai = I.distinct(an.body, c.sekolah), dipakai = {};
      var per = sks.map(function (sk) {
        var vals = nilai.filter(function (v) { return I.schoolMatch(v.value, sk); }).map(function (v) { dipakai[v.value] = true; return v.value; });
        var plist = (res.peserta || []).filter(function (p) { return p.sekolahId === sk.id; });
        var orang = {}, asing = [];
        an.body.forEach(function (row) {
          if (vals.indexOf(String(row[c.sekolah] || '').trim()) < 0 && vals.indexOf(row[c.sekolah]) < 0) return;
          var nm = String(row[c.nama] || '').trim(); if (!nm) return;
          var o = kenaliNama(I, nm, plist, asing); orang[o.key] = o.nama;
        });
        var sudah = Object.keys(orang).map(function (k) { return orang[k]; }).sort(function (a, b) { return a.localeCompare(b, 'id'); });
        var belum = plist.filter(function (p) { return !orang['p:' + p.id]; }).map(function (p) { return p.nama; }).sort(function (a, b) { return a.localeCompare(b, 'id'); });
        return { sk: sk, sudah: sudah, belum: belum, terdaftar: plist.length };
      });
      var daftar = function (x) {
        return h('div', { class: 'hgrid' }, [
          h('div', { class: 'hbox' }, [h('div', { class: 'hbt' }, [h('b', { text: 'Sudah mengisi' }), h('span', { text: x.sudah.length + ' orang' })]),
            h('ol', { class: 'rlist' }, x.sudah.map(function (n) { return h('li', { text: n }); }))]),
          h('div', { class: 'hbox' }, [h('div', { class: 'hbt' }, [h('b', { text: 'Belum mengisi' }), h('span', { text: x.belum.length + ' dari daftar guru' })]),
            x.belum.length ? h('ol', { class: 'rlist' }, x.belum.map(function (n) { return h('li', { text: n }); })) : h('p', { class: 'dnote', text: x.terdaftar ? 'Semua guru di daftar sudah mengisi.' : 'Daftar guru sekolah ini belum diisi.' })])]);
      };
      if (!semua) { body.appendChild(daftar(per[0])); return; }
      var detail = h('div', { class: 'hdetail' });
      var rows = per.map(function (x) {
        var tr = h('tr', { class: 'click', tabindex: '0', title: 'Lihat nama' }, [h('td', { text: x.sk.nama }), h('td', { class: 'num b', text: String(x.sudah.length) }), h('td', { class: 'num', text: String(x.terdaftar) }), h('td', { class: 'num', text: String(x.belum.length) })]);
        var buka = function () {
          [].forEach.call(tr.parentNode.children, function (r) { r.classList.remove('on'); }); tr.classList.add('on');
          detail.textContent = ''; detail.appendChild(h('h3', { text: x.sk.nama })); detail.appendChild(daftar(x));
          detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        tr.addEventListener('click', buka); tr.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); buka(); } });
        return tr;
      });
      var tot = per.reduce(function (a, x) { return [a[0] + x.sudah.length, a[1] + x.terdaftar, a[2] + x.belum.length]; }, [0, 0, 0]);
      rows.push(h('tr', { class: 'tot' }, [h('td', { text: 'Semua sekolah' })].concat(tot.map(function (v, i) { return h('td', { class: 'num' + (i ? '' : ' b'), text: String(v) }); }))));
      body.appendChild(h('div', { class: 'tscroll' }, [h('table', { class: 'htab sk' }, [
        h('thead', {}, [h('tr', {}, [h('th', { text: 'Sekolah' }), h('th', { class: 'num', text: 'Sudah mengisi' }), h('th', { class: 'num', text: 'Guru terdaftar' }), h('th', { class: 'num', text: 'Belum' })])]),
        h('tbody', {}, rows)])]));
      body.appendChild(h('p', { class: 'fh', text: 'Ketuk nama sekolah untuk melihat siapa yang sudah dan belum mengisi.' }));
      var lain = nilai.filter(function (v) { return !dipakai[v.value]; });
      if (lain.length) body.appendChild(h('div', { class: 'notice' }, [h('strong', { text: 'Asal sekolah tidak dikenali' }),
        h('span', { text: lain.map(function (v) { return '"' + v.value + '" (' + v.count + ' jawaban)'; }).join(', ') + '. Jawaban ini tidak dihitung.' })]));
      body.appendChild(detail);
    }).catch(function (e) {
      body.textContent = '';
      body.appendChild(h('div', { class: 'ferr', text: e.code === 'NOFORM' ? 'Tautan form refleksi P' + t.no + ' belum diisi admin.' : e.message }));
    });
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
  /* Satukan ejaan nama: nama resmi/ejaan yang diingat -> orang itu; mirip >= 90% dengan satu calon -> orang itu;
   * nama di luar daftar yang mirip satu sama lain -> satu orang. Hanya untuk tampilan (data tidak diubah). */
  function kenaliNama(I, nama, plist, asing) {
    if (I.cocokkan && plist.length) {
      var c = I.cocokkan(nama, plist);
      if (c.p) return { key: 'p:' + c.p.id, nama: c.p.nama };
      var sr = c.saran || [];
      if (sr.length && sr[0].skor >= 0.9 && (sr.length === 1 || sr[0].skor - sr[1].skor >= 0.03)) return { key: 'p:' + sr[0].p.id, nama: sr[0].p.nama };
    }
    var n = I.normName(nama);
    if (I.mirip) for (var i = 0; i < asing.length; i++) if (I.mirip(n, asing[i].n) >= 0.9) return asing[i].o;
    var o = { key: 'n:' + n, nama: nama };
    asing.push({ n: n, o: o });
    return o;
  }
  function olahHasil(I, rows, sks, no, peserta) {
    var an = I.analyze(rows), c = an.cols;
    var kurang = [['nama', 'Nama'], ['sekolah', 'Asal sekolah'], ['jenis', 'Jenis tes'], ['skor', 'Skor']].filter(function (k) { return c[k[0]] < 0; }).map(function (k) { return k[1]; });
    if (kurang.length) throw new Error('Kolom ' + kurang.join(', ') + ' tidak ditemukan di form.' + (c.skor < 0 ? ' Pastikan form diatur sebagai Kuis.' : ''));
    var nilai = I.distinct(an.body, c.sekolah);
    var dipakai = {};
    var per = sks.map(function (sk) {
      var vals = nilai.filter(function (v) { return I.schoolMatch(v.value, sk); }).map(function (v) { dipakai[v.value] = true; return v.value; });
      var ex = vals.length ? I.extract(an, c, vals, no).rows : [];
      var orang = {}, asing = [];
      var plist = (peserta || []).filter(function (p) { return p.sekolahId === sk.id; });
      // baris berurutan waktu kirim: ejaan berbeda milik orang yang sama -> nilai terakhir yang dipakai
      ex.forEach(function (r) { var o = kenaliNama(I, r.nama, plist, asing); (orang[o.key] = orang[o.key] || { nama: o.nama, pre: null, post: null })[r.jenis] = r.skor; });
      var daftar = Object.keys(orang).map(function (k) { return orang[k]; }).sort(function (a, b) { return a.nama.localeCompare(b.nama, 'id'); });
      var dari = function (j) { return daftar.filter(function (o) { return o[j] !== null; }).map(function (o) { return { nama: o.nama, skor: o[j] }; }); };
      return { sk: sk, daftar: daftar, pre: ringkas(dari('pre')), post: ringkas(dari('post')) };
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
      var o = olahHasil(I, res.rows, sks, t.no, res.peserta || []);
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
      var grup = '';
      links.forEach(function (L) {
        var g = L.ref ? 'ref' : 'tes';
        if (g !== grup) { grup = g; list.appendChild(h('h3', { class: 'lgrp', text: L.ref ? 'Refleksi (satu form per pendampingan)' : 'Pretes & Postes (satu form untuk pretes dan postes)' })); }
        var key = (L.ref ? 'R' : '') + L.no;
        var inp = h('input', { type: 'url', value: L.editUrl || '', placeholder: 'https://docs.google.com/forms/d/…/edit', autocomplete: 'off', spellcheck: 'false' });
        inputs[key] = inp;
        var n = h('span', { class: 'fh', text: L.pubUrl ? (L.catatan ? 'Tersimpan. Catatan: ' + L.catatan : 'Tersimpan, isian otomatis ' + (L.ref ? 'nama dan sekolah' : 'jenis tes dan sekolah') + ' aktif.') : 'Belum diisi.' });
        notes[key] = n;
        list.appendChild(h('label', { class: 'fld' }, [h('span', { class: 'fl', text: (L.ref ? 'Refleksi ' : '') + 'P' + L.no + ' · ' + (TES_JUDUL[L.no - 1] || '') }), inp, n]));
      });
      go.disabled = false;
    }
    api('tesLinks').then(fill).catch(function (e) { list.textContent = ''; showErr(err, e.message); });
    go.addEventListener('click', function () {
      var links = Object.keys(inputs).map(function (k) { var ref = k.charAt(0) === 'R'; return { no: Number(ref ? k.slice(1) : k), ref: ref, editUrl: inputs[k].value.trim() }; });
      var salah = links.filter(function (l) { return l.editUrl && !/\/forms\/d\/(?!e\/)[A-Za-z0-9_-]{20,}/.test(l.editUrl); });
      if (salah.length) { showErr(err, salah.map(function (l) { return (l.ref ? 'Refleksi ' : '') + 'P' + l.no; }).join(', ') + ': itu tautan untuk peserta. Tempel tautan EDIT (…/forms/d/…/edit).'); return; }
      showErr(err, ''); info.hidden = true; go.disabled = true; go.textContent = 'Memeriksa form…';
      api('tesSaveLinks', { links: links }).then(function (r) {
        fill(r.links);
        if (r.gagal && r.gagal.length) showErr(err, r.gagal.join(' '));
        info.textContent = 'Tautan disimpan.'; info.hidden = false;
        tesData = null; loadTes(true);
      }).catch(function (e) { showErr(err, e.message); }).then(function () { go.disabled = false; go.textContent = 'Simpan'; });
    });
    d = openDialog('Atur tautan Google Form', body, [btn('Tutup', 'ghost', { onclick: function () { d.close(); } }), go]);
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
