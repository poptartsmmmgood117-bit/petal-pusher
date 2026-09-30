// Help and move-progress cards live above the canvas; no HUD or save-schema changes.
const HomeUI = {
  installed: () => !!navigator.standalone || window.matchMedia('(display-mode: standalone)').matches,
  help(scene) {
    if (document.getElementById('home-overlay')) return;
    const previousFocus = document.activeElement;
    scene.scene.pause(); // keep the export snapshot, pending level-ups and coach timers stable
    const overlay = document.createElement('div');
    overlay.id = 'home-overlay';
    const card = document.createElement('section');
    card.className = 'home-card'; card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true'); card.setAttribute('aria-labelledby', 'home-title');
    overlay.append(card); document.body.append(overlay);
    // game.js suppresses context menus; allow native iOS Copy/Paste inside this card.
    overlay.addEventListener('contextmenu', e => e.stopPropagation());
    const fit = () => {
      const viewport = window.visualViewport;
      if (viewport) { overlay.style.top = viewport.offsetTop + 'px'; overlay.style.height = viewport.height + 'px'; }
    };
    fit(); window.visualViewport?.addEventListener('resize', fit);
    window.visualViewport?.addEventListener('scroll', fit);
    const close = () => {
      window.visualViewport?.removeEventListener('resize', fit);
      window.visualViewport?.removeEventListener('scroll', fit);
      overlay.remove(); scene.scene.resume(); previousFocus?.focus();
    };
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key !== 'Tab') return;
      const controls = [...card.querySelectorAll('button, textarea')].filter(el => !el.disabled);
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    const element = (tag, text, className) => {
      const el = document.createElement(tag); el.textContent = text;
      if (className) el.className = className;
      card.append(el); return el;
    };
    const heading = title => {
      card.replaceChildren(); card.scrollTop = 0;
      const h = element('h1', title); h.id = 'home-title'; h.tabIndex = -1; h.focus();
    };
    const button = (text, action, secondary = false) => {
      const b = element('button', text, secondary ? 'secondary' : '');
      b.type = 'button'; b.addEventListener('click', action); return b;
    };
    const note = text => element('p', text, 'home-note');
    const status = text => { const el = note(text); el.setAttribute('role', 'status'); return el; };
    const textBox = (label, value = '', readOnly = false) => {
      const l = element('label', label); l.htmlFor = 'progress-code';
      const box = element('textarea', ''); box.id = 'progress-code'; box.value = value;
      box.placeholder = 'Touch and hold here, then choose Paste';
      box.readOnly = readOnly; box.spellcheck = false; box.autocomplete = 'off';
      box.setAttribute('autocapitalize', 'off'); box.setAttribute('autocorrect', 'off');
      box.maxLength = 1000000; return box;
    };
    const help = () => {
      heading('How to play');
      const list = element('ul', '');
      for (const text of [
        '👆 Tap the shelf to drop a plant (1 ♥).',
        '🪴 The planter pushes plants toward the chute.',
        '💜 Plants off the front are yours, plus a heart back.',
        '🎁 Hold for a BIG Surprise Box (3 ♥).',
        '⚠️ Side gutters eat plants. Aim for the middle!',
        '🌸 Collect all 9 on your shelf to level up.',
        '👑 The Princess box hides in BIG drops.',
        '💧 Out of hearts? Wait a moment for a refill.',
      ]) { const li = document.createElement('li'); li.textContent = text; list.append(li); }
      button('Copy my progress', copy);
      button('Paste progress', paste, true);
      note('Moving to a new address or Home Screen icon? Copy here first, then paste there. Keep the code in Notes as a backup.');
      if (!HomeUI.installed()) note('On iPhone: Safari Share button → Add to Home Screen.');
      note(typeof Offline !== 'undefined' ? Offline.message : 'Open online once to prepare offline play.');
      button('Keep playing', close, true);
    };
    const copy = () => {
      let code;
      try { code = Transfer.encode(Save.data); } catch (e) { status(e.message); return; }
      // Called synchronously in the button tap: Safari clipboard permission needs this user activation.
      let copied;
      try { copied = navigator.clipboard?.writeText(code); } catch (e) { copied = null; }
      heading('Your progress code');
      note('Paste this into Notes, or open the new game and choose “Paste progress”. Your original save stays here.');
      const box = textBox('Your code — keep the whole thing', code, true);
      const message = status('Select the code below, then choose Copy.');
      const select = () => { box.focus(); box.select(); box.setSelectionRange(0, box.value.length); };
      button('Select whole code', select, true);
      if (copied) Promise.resolve(copied).then(() => {
        message.textContent = 'Copied! Your progress is ready to take with you.';
      }).catch(() => { message.textContent = 'Automatic copy was unavailable. Tap “Select whole code”, then choose Copy.'; select(); });
      button('Back to help', help, true);
    };
    const paste = () => {
      heading('Paste progress');
      note('Paste the whole code from your old game. We’ll show you what’s inside before changing anything.');
      const box = textBox('Progress code');
      const message = status('Your current progress is safe until you confirm.');
      button('Preview progress', () => {
        let data;
        try { data = Transfer.decode(box.value); } catch (e) { message.textContent = e.message; return; }
        heading('Restore this progress?');
        element('p', Transfer.preview(data), 'home-summary');
        note('Shelves, best score and settings come along. Hearts and the plants on the board start fresh, just like reopening the game.');
        note('This replaces progress on this device. It does not merge shelves. You can cancel and copy your current progress first.');
        const result = status('Nothing has changed yet.');
        button('Restore and reopen', () => {
          try { Transfer.restore(data); location.reload(); } catch (e) { result.textContent = e.message; }
        });
        button('Cancel', help, true);
      });
      button('Back to help', help, true);
    };
    help();
  },
};
