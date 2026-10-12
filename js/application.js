/* Candidate application form: validate and save a local demo submission. */
(function () {
  'use strict';

  var form = document.getElementById('application-form');
  if (!form) return;

  var jobs = window.HIREVERA_JOBS || {};
  var params = new URLSearchParams(window.location.search);
  var jobId = params.get('id') || '2';
  if (!jobs[jobId]) jobId = '2';
  var job = jobs[jobId];
  var fileInput = document.getElementById('resume-file');
  var errorSummary = document.getElementById('application-error');
  var fileError = document.getElementById('resume-error');
  var consent = document.getElementById('application-consent');
  var consentError = document.getElementById('consent-error');
  var nameInput = document.getElementById('applicant-name');
  var emailInput = document.getElementById('applicant-email');
  var portfolioInput = document.getElementById('applicant-portfolio');
  var maxFileSize = 5 * 1024 * 1024;

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; });
  }

  if (job) {
    document.title = 'Apply for ' + job.title + ' · Hirevera';
    document.getElementById('application-job-id').value = jobId;
    document.querySelector('[data-job-link]').href = 'job-details.html?id=' + jobId;
    setText('[data-role-title]', job.title);
    setText('[data-company]', job.company);
    setText('[data-company-name]', job.company);
    setText('[data-location]', job.location);
    setText('[data-salary]', job.salary + ' ' + job.per);
    var logo = document.getElementById('application-logo');
    logo.className = 'logo-tile ' + job.logoClass;
    logo.innerHTML = job.logoIcon ? '<i data-lucide="' + job.logoIcon + '"></i>' : (job.logoLetter || job.company.charAt(0));
    if (window.lucide) window.lucide.createIcons();
  }

  function clearValidation() {
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.application-field__error').forEach(function (message) { message.hidden = true; });
    errorSummary.hidden = true;
  }

  function markInvalid(field, message) {
    field.setAttribute('aria-invalid', 'true');
    var feedback = document.getElementById(field.getAttribute('aria-describedby'));
    if (feedback) feedback.hidden = false;
    if (message) message.hidden = false;
  }

  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (!file) return;
    document.querySelector('[data-resume-name]').textContent = file.name;
    document.querySelector('[data-resume-meta]').textContent = Math.max(1, Math.round(file.size / 1024)) + ' KB · Selected';
    document.getElementById('resume-dropzone').classList.add('has-file');
    fileInput.removeAttribute('aria-invalid');
    fileError.hidden = true;
  });

  var coverLetter = document.getElementById('cover-letter');
  coverLetter.addEventListener('input', function () {
    document.querySelector('[data-character-count]').textContent = coverLetter.value.length;
  });

  [nameInput, emailInput, portfolioInput].forEach(function (field) {
    field.addEventListener('input', function () {
      field.removeAttribute('aria-invalid');
      var feedback = document.getElementById(field.getAttribute('aria-describedby'));
      if (feedback) feedback.hidden = true;
    });
  });

  consent.addEventListener('change', function () {
    consent.removeAttribute('aria-invalid');
    consentError.hidden = true;
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearValidation();
    var invalid = [];
    var file = fileInput.files && fileInput.files[0];
    var validFile = file && /\.(pdf|doc|docx)$/i.test(file.name) && file.size <= maxFileSize;

    if (nameInput.value.trim().length < 2) {
      markInvalid(nameInput);
      invalid.push(nameInput);
    }
    if (!emailInput.value.trim() || !emailInput.validity.valid) {
      markInvalid(emailInput);
      invalid.push(emailInput);
    }
    if (portfolioInput.value.trim() && !portfolioInput.validity.valid) {
      markInvalid(portfolioInput, document.getElementById('portfolio-error'));
      invalid.push(portfolioInput);
    }
    if (!validFile) {
      fileInput.setAttribute('aria-invalid', 'true');
      fileError.hidden = false;
      invalid.push(fileInput);
    }
    if (!consent.checked) {
      consent.setAttribute('aria-invalid', 'true');
      consentError.hidden = false;
      invalid.push(consent);
    }

    if (invalid.length) {
      errorSummary.textContent = 'Please review the highlighted fields and try again.';
      errorSummary.hidden = false;
      errorSummary.focus();
      invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var reference = 'HV-APP-' + (Math.floor(Math.random() * 900000) + 100000);
    var submission = {
      reference: reference,
      jobId: jobId,
      title: job.title,
      company: job.company,
      location: job.location,
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      resumeName: file.name,
      submittedAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem('hirevera_latest_application', JSON.stringify(submission));
      var applications = JSON.parse(localStorage.getItem('hirevera_applications') || '[]');
      if (!Array.isArray(applications)) applications = [];
      applications.unshift(submission);
      localStorage.setItem('hirevera_applications', JSON.stringify(applications.slice(0, 50)));
    } catch (storageError) {
      errorSummary.textContent = 'This browser could not save your application. Please enable local storage and try again.';
      errorSummary.hidden = false;
      errorSummary.focus();
      return;
    }

    window.location.href = 'confirmation.html?id=' + encodeURIComponent(jobId) + '&ref=' + encodeURIComponent(reference);
  });
})();