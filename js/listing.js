/* Hirevera job listing: render and filter the shared sample job data. */
(function () {
  'use strict';

  var sidebar = document.querySelector('[data-sidebar]');
  var grid = document.getElementById('job-grid');
  if (!sidebar || !grid) return;

  var jobs = window.HIREVERA_JOBS || {};
  var jobIds = Object.keys(jobs);
  var boxes = Array.prototype.slice.call(sidebar.querySelectorAll('input[type="checkbox"]'));
  var count = document.querySelector('[data-job-count]');
  var empty = document.getElementById('no-results');
  var clear = sidebar.querySelector('[data-clear-filters]');
  var search = document.querySelector('[data-job-search]');
  var filterToggle = document.querySelector('[data-filter-toggle]');

  function renderJob(id) {
    var job = jobs[id];
    var badges = (job.isNew ? '<span class="badge">New</span>' : '') +
      (job.easy ? '<span class="badge">Easy Apply</span>' : '');
    var logo = job.logoIcon
      ? '<i data-lucide="' + job.logoIcon + '"></i>'
      : (job.logoLetter || job.company.charAt(0));

    return '<article class="job-card" data-href="job-details.html?id=' + id + '" data-job-id="' + id + '" tabindex="0">' +
      '<div class="job-card__identity"><div class="logo-tile ' + job.logoClass + '">' + logo + '</div>' +
      '<div class="job-card__role"><h3 class="job-card__title">' + job.title + '</h3><p class="job-card__company">' + job.company + '</p></div>' +
      '<button class="bookmark" type="button" aria-label="Save ' + job.title + '" aria-pressed="false"><i data-lucide="bookmark" class="ic ic-20"></i></button></div>' +
      '<div class="job-card__row"><span class="location"><i data-lucide="map-pin" class="ic ic-14"></i>' + job.location + '</span><span class="tag">' + job.type + '</span></div>' +
      '<div class="job-card__row"><span class="salary">' + job.salary + ' <span class="muted">' + job.per + '</span></span><span class="badges">' + badges + '</span></div>' +
      '<div class="job-card__row"><span class="posted">' + job.posted + '</span><a class="btn btn--sm" href="job-details.html?id=' + id + '">View details <i data-lucide="arrow-right" class="ic ic-14"></i></a></div>' +
      '</article>';
  }

  grid.innerHTML = jobIds.map(renderJob).join('');
  if (window.lucide) window.lucide.createIcons();

  function selected(group) {
    return boxes.filter(function (box) {
      return box.getAttribute('data-group') === group && box.checked;
    }).map(function (box) { return box.value; });
  }

  function apply() {
    var types = selected('type');
    var modes = selected('mode');
    var query = search ? search.value.trim().toLowerCase() : '';
    var visible = 0;

    grid.querySelectorAll('.job-card').forEach(function (card) {
      var job = jobs[card.getAttribute('data-job-id')];
      var matches = (!types.length || types.indexOf(job.type) !== -1) &&
        (!modes.length || modes.indexOf(job.mode) !== -1) &&
        (!query || (job.title + ' ' + job.company + ' ' + job.location + ' ' + job.type).toLowerCase().indexOf(query) !== -1);
      card.classList.toggle('is-filtered-out', !matches);
      if (matches) visible++;
    });

    if (count) count.textContent = visible + (visible === 1 ? ' job' : ' jobs');
    if (empty) empty.style.display = visible ? 'none' : 'block';
  }

  boxes.forEach(function (box) { box.addEventListener('change', apply); });
  if (search) search.addEventListener('input', apply);

  if (clear) {
    clear.addEventListener('click', function () {
      boxes.forEach(function (box) { box.checked = false; });
      if (search) search.value = '';
      apply();
    });
  }

  if (filterToggle) {
    filterToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('filters-open');
      filterToggle.setAttribute('aria-expanded', open);
    });
  }

  grid.addEventListener('click', function (event) {
    var bookmark = event.target.closest('.bookmark');
    if (bookmark) {
      var saved = bookmark.classList.toggle('is-saved');
      bookmark.setAttribute('aria-pressed', saved);
      return;
    }
    var card = event.target.closest('[data-href]');
    if (card && !event.target.closest('a, button')) window.location.href = card.getAttribute('data-href');
  });

  grid.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.matches('[data-href]')) {
      window.location.href = event.target.getAttribute('data-href');
    }
  });

  apply();
})();