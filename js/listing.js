/* Hirevera · sidebar filters for the job listing */
(function () {
  'use strict';

  var sidebar = document.querySelector('[data-sidebar]');
  if (!sidebar) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll('.job-card'));
  var boxes = Array.prototype.slice.call(sidebar.querySelectorAll('input[type="checkbox"]'));
  var count = document.querySelector('[data-job-count]');
  var empty = document.getElementById('no-results');
  var clear = sidebar.querySelector('[data-clear-filters]');
  var search = document.querySelector('[data-job-search]');

  function selected(group) {
    return boxes
      .filter(function (b) { return b.getAttribute('data-group') === group && b.checked; })
      .map(function (b) { return b.value.toLowerCase(); });
  }

  function matchesAny(card, values) {
    if (!values.length) return true;
    var text = card.textContent.toLowerCase();
    return values.some(function (v) { return text.indexOf(v) !== -1; });
  }

  function apply() {
    var types = selected('type');
    var modes = selected('mode');
    var visible = 0;

    cards.forEach(function (card) {
      var ok = matchesAny(card, types) && matchesAny(card, modes);
      card.classList.toggle('is-filtered-out', !ok);
      if (ok && card.style.display !== 'none') visible++;
    });

    if (count) count.textContent = visible + (visible === 1 ? ' job' : ' jobs');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  }

  boxes.forEach(function (b) { b.addEventListener('change', apply); });

  if (clear) {
    clear.addEventListener('click', function () {
      boxes.forEach(function (b) { b.checked = false; });
      apply();
    });
  }

  /* Keep the count in step with the live search (script.js runs first). */
  if (search) search.addEventListener('input', apply);
})();
