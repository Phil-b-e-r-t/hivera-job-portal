/* Render a success receipt only for a completed application in this session. */
(function () {
  'use strict';

  var successState = document.querySelector('[data-success-state]');
  var errorState = document.querySelector('[data-error-state]');
  if (!successState || !errorState) return;

  var params = new URLSearchParams(window.location.search);
  var reference = params.get('ref');
  var submission = null;

  try {
    submission = JSON.parse(sessionStorage.getItem('hirevera_latest_application') || 'null');
  } catch (error) {
    submission = null;
  }

  if (!submission || !reference || submission.reference !== reference) {
    errorState.hidden = false;
    var jobId = params.get('id') || (submission && submission.jobId) || '2';
    document.querySelector('[data-retry-link]').href = 'application-form.html?id=' + encodeURIComponent(jobId);
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  var jobs = window.HIREVERA_JOBS || {};
  var job = jobs[submission.jobId] || {};
  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; });
  }

  var logo = document.querySelector('[data-confirm-logo]');
  logo.className = 'logo-tile ' + (job.logoClass || '');
  logo.innerHTML = job.logoIcon ? '<i data-lucide="' + job.logoIcon + '"></i>' : (job.logoLetter || submission.company.charAt(0));
  setText('[data-confirm-company]', submission.company);
  setText('[data-confirm-location]', submission.location);
  setText('[data-confirm-role]', submission.title);
  setText('[data-confirm-reference]', submission.reference);
  setText('[data-confirm-resume]', submission.resumeName);

  var submittedAt = new Date(submission.submittedAt);
  setText('[data-confirm-time]', isNaN(submittedAt.getTime()) ? 'Just now' : submittedAt.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }));
  successState.hidden = false;
  document.title = 'Application sent · Hirevera';
  if (window.lucide) window.lucide.createIcons();
})();