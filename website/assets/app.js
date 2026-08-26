  var events = [
    ['14:02:11', 'info', 'WAZUH', 'Agent 0042 checked in'],
    ['14:02:19', 'ok', 'AUTH', 'MFA challenge succeeded'],
    ['14:02:34', 'warn', 'FIM', 'Integrity change — /etc/passwd'],
    ['14:02:41', 'info', 'NET', 'Outbound connection — TLS 1.3'],
    ['14:02:55', 'crit', 'IDS', 'SQLi attempt blocked'],
    ['14:03:02', 'ok', 'SHUFFLE', 'Playbook isolate-host completed'],
    ['14:03:14', 'info', 'VULN', 'Scan started — 214 hosts'],
    ['14:03:27', 'warn', 'LOGIN', '5 failed attempts — 203.0.113.44'],
    ['14:03:39', 'crit', 'HONEYPOT', 'SSH brute-force on decoy host'],
    ['14:03:52', 'ok', 'PATCH', 'CVE-2026-11029 deployed'],
    ['14:04:08', 'info', 'REPORT', 'Weekly summary generated'],
    ['14:04:20', 'warn', 'FW', 'Port scan detected — rate-limited'],
    ['14:04:33', 'info', 'DNS', 'Known-bad domain blocked'],
    ['14:04:47', 'ok', 'BACKUP', 'Nightly snapshot verified'],
    ['14:05:01', 'warn', 'EDR', 'Encoded PowerShell flagged'],
    ['14:05:16', 'crit', 'EXFIL', 'Large outbound transfer — 2.4 GB'],
    ['14:05:29', 'ok', 'SHUFFLE', 'Endpoint quarantined'],
    ['14:05:44', 'info', 'ASSET', 'New device — inventory updated']
  ];

  function buildLog() {
    var track = document.getElementById('logTrack');
    if (!track) { return; }
    var html = events.concat(events).map(function (e) {
      return '<div class="log' + (e[1] === 'crit' ? ' critical' : '') + '">' +
             '<span class="t">' + e[0] + '</span>' +
             '<span class="tag ' + e[1] + '">' + e[1].toUpperCase() + '</span>' +
             '<span class="m">[' + e[2] + '] ' + e[3] + '</span>' +
             '</div>';
    }).join('');
    track.innerHTML = html;
  }
  buildLog();

  // The delivery address is assembled at runtime from separate pieces, so the plain
  // string never appears in the page source for address-harvesting bots to scrape.
  var inbox = ["aaron", "data-frames.com"].join(String.fromCharCode(64));
  var contactForm = document.getElementById("contactForm");
  contactForm.action = "https://formsubmit.co/" + inbox;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = this;
    var status = document.getElementById('formStatus');
    var button = form.querySelector('.form-submit');

    function fail(detail) {
      status.classList.add('error');
      status.textContent = "Sorry, that didn't send. Please try again in a moment.";
      if (detail && window.console) { console.error('Contact form failed:', detail); }
    }

    status.classList.remove('error');
    status.textContent = 'Sending…';
    status.style.display = 'block';
    button.disabled = true;

    fetch("https://formsubmit.co/ajax/" + inbox, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams(new FormData(form))
    })
      .then(function (res) {
        if (!res.ok) { throw new Error('Server returned ' + res.status); }
        return res.json();
      })
      .then(function (data) {
        // FormSubmit answers with HTTP 200 even when it refuses the message,
        // flagging it as the string "false" in the body. Trust the body, not the status.
        if (!data || String(data.success) !== 'true') {
          throw new Error((data && data.message) || 'Delivery was refused.');
        }
        status.textContent = "Thanks — we'll be in touch shortly.";
        form.reset();
      })
      .catch(function (err) { fail(err && err.message ? err.message : ''); })
      .then(function () { button.disabled = false; });
  });
