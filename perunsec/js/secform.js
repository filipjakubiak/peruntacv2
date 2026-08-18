/* PERUN SEC - enquiry form.
   Frontend-only stage, same as the Perun Tac booking form: the submit builds a
   structured mailto so nothing is silently lost while there is no backend.
   Swap this handler for a POST once a mail endpoint exists - the fields and
   validation already match what the team needs to receive. */
(function () {
  "use strict";

  var form = document.getElementById("secForm");
  if (!form) return;

  var sent = document.getElementById("secFormSent");
  var PL = (document.documentElement.lang || "en").toLowerCase().indexOf("pl") === 0;
  var MAILTO = "info@perunsec.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    var fd = new FormData(form);
    var none = PL ? "brak" : "none";
    var body = PL
      ? "ZAPYTANIE - PERUN SEC\n" +
        "======================\n" +
        "IMIĘ I NAZWISKO: " + fd.get("name") + "\n" +
        "FIRMA / ORGANIZACJA: " + (fd.get("company") || none) + "\n" +
        "E-MAIL: " + fd.get("email") + "\n" +
        "TELEFON: " + (fd.get("phone") || none) + "\n" +
        "ZAKRES: " + fd.get("scope") + "\n\n" +
        "WIADOMOŚĆ:\n" + fd.get("message") + "\n"
      : "ENQUIRY - PERUN SEC\n" +
        "====================\n" +
        "FULL NAME: " + fd.get("name") + "\n" +
        "COMPANY / ORGANISATION: " + (fd.get("company") || none) + "\n" +
        "E-MAIL: " + fd.get("email") + "\n" +
        "PHONE: " + (fd.get("phone") || none) + "\n" +
        "SCOPE: " + fd.get("scope") + "\n\n" +
        "MESSAGE:\n" + fd.get("message") + "\n";

    location.href = "mailto:" + MAILTO +
      "?subject=" + encodeURIComponent(PL ? "Zapytanie - Perun Sec" : "Enquiry - Perun Sec") +
      "&body=" + encodeURIComponent(body);

    if (sent) sent.classList.add("is-on");
  });
})();
