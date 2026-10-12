/* Shared candidate dashboard navigation and home-page job recommendations. */
(function () {
  'use strict';

  var sidebar = document.querySelector('[data-dashboard-sidebar]');
  if (sidebar) {
    var toggles = document.querySelectorAll('[data-sidebar-toggle]');
    var closeButton = document.querySelector('[data-sidebar-close]');

    function setOpen(open) {
      document.body.classList.toggle('sidebar-open', open);
      toggles.forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', open);
      });
    }

    function setDesktopState() {
      var collapsed = document.body.classList.contains('sidebar-collapsed');
      var headerToggle = document.querySelector('.dashboard-topbar [data-sidebar-toggle]');
      if (headerToggle) {
        headerToggle.setAttribute('aria-expanded', !collapsed);
        headerToggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
      }
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 900px)').matches) {
          setOpen(!document.body.classList.contains('sidebar-open'));
        } else {
          document.body.classList.toggle('sidebar-collapsed');
          setDesktopState();
        }
      });
    });

    if (closeButton) closeButton.addEventListener('click', function () { setOpen(false); });
    if (window.matchMedia('(max-width: 900px)').matches) setOpen(false);
    else setDesktopState();
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 900px)').matches) {
        setOpen(false);
        setDesktopState();
      }
    });
  }

  var jobs = window.HIREVERA_JOBS || {};
  var recommendationList = document.querySelector('[data-home-jobs]');
  var jobCount = document.querySelector('[data-home-job-count]');
  if (jobCount) jobCount.textContent = Object.keys(jobs).length;

  if (recommendationList) {
    recommendationList.innerHTML = Object.keys(jobs).slice(0, 4).map(function (id) {
      var job = jobs[id];
      var logo = job.logoIcon ? '<i data-lucide="' + job.logoIcon + '"></i>' : (job.logoLetter || job.company.charAt(0));
      return '<a class="row" href="job-details.html?id=' + id + '"><span class="logo-tile ' + job.logoClass + '">' + logo +
        '</span><span class="row__main"><span class="row__title">' + job.title + '</span><span class="row__sub">' + job.company + ' · ' + job.location + '</span></span>' +
        '<span class="row__time">' + job.salary + '</span></a>';
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }
})();