
/* Hirevera · interactions for the web view */
(function () {
  'use strict';

  function icons() {
    if (window.lucide) window.lucide.createIcons();
  }
  icons();

  /* Show / hide password */
  document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-toggle-password'));
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.innerHTML = '<i data-lucide="' + (show ? 'eye-off' : 'eye') + '" class="ic ic-20"></i>';
      icons();
    });
  });

  /* Auth forms continue to the next screen */
  document.querySelectorAll('form[data-next]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var invalidGroups = [];
      form.querySelectorAll('.field-group').forEach(function (group) {
        var input = group.querySelector('input[required]');
        var error = group.querySelector('.field-error');
        if (!input || !error) return;

        var missing = !input.value.trim();
        input.setAttribute('aria-invalid', missing ? 'true' : 'false');
        error.hidden = !missing;
        group.classList.remove('is-invalid');
        if (missing) {
          void group.offsetWidth;
          group.classList.add('is-invalid');
          invalidGroups.push(group);
        }
      });

      if (invalidGroups.length) {
        invalidGroups[0].querySelector('input[required]').focus();
        return;
      }

      window.location.href = form.getAttribute('data-next');
    });
  });

  document.querySelectorAll('.field-group input[required]').forEach(function (input) {
    input.addEventListener('input', function () {
      if (!input.value.trim()) return;
      var group = input.closest('.field-group');
      var error = group.querySelector('.field-error');
      group.classList.remove('is-invalid');
      input.setAttribute('aria-invalid', 'false');
      error.hidden = true;
    });
  });

  /* Bookmark toggle */
  document.querySelectorAll('.bookmark').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var saved = btn.classList.toggle('is-saved');
      btn.setAttribute('aria-pressed', saved);
    });
  });

  /* Filter chips */
  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('is-active');
    });
  });

  /* Live search on the job listing */
  var search = document.querySelector('[data-job-search]');
  if (search) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.job-card'));
    var empty = document.getElementById('no-results');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var match = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    });
  }

  /* Whole job card is a link to the details screen */
  document.querySelectorAll('[data-href]').forEach(function (card) {
    function go() { window.location.href = card.getAttribute('data-href'); }
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      go();
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target === card) go();
    });
  });

  /* Details tabs scroll to their section */
  document.querySelectorAll('.tabs__tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tabs__tab').forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var target = document.getElementById(tab.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Share */
  document.querySelectorAll('[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var data = { title: document.title, url: window.location.href };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(data.url);
      }
    });
  });
})();