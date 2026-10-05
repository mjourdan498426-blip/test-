(function () {
  "use strict";

  var FICHES = window.FICHES || [];
  var STORAGE_KEY = "permisb-fiches-sues";
  var TYPE_LABEL = { VI: "Vérification intérieure", VE: "Vérification extérieure" };
  var MISSING = "Le document officiel ne donne pas de réponse pour cette vérification : la manipulation ou la réponse attendue se déduit de la question.";

  var $ = function (id) { return document.getElementById(id); };
  var current = null;
  var known = loadKnown();

  function loadKnown() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveKnown() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(known)); } catch (e) { /* stockage indisponible */ }
  }

  // Le PDF officiel numérote la 100e fiche « 00 ».
  function label(n) {
    return n === 100 ? "00 (100)" : String(n).padStart(2, "0");
  }

  function pool() {
    var type = $("filter-type").value;
    var onlyUnknown = $("filter-unknown").checked;
    return FICHES.filter(function (f) {
      if (type !== "all" && f.verification.type !== type) return false;
      if (onlyUnknown && known[f.numero]) return false;
      return true;
    });
  }

  function setAnswer(id, text) {
    var p = $(id);
    var box = p.parentNode;
    p.textContent = text || MISSING;
    box.classList.toggle("missing", !text);
  }

  function show(fiche) {
    current = fiche;
    $("fiche").hidden = false;
    $("fiche-titre").textContent = "Fiche n° " + label(fiche.numero);
    var badge = $("fiche-type");
    badge.textContent = fiche.verification.type;
    badge.className = "badge " + fiche.verification.type + (known[fiche.numero] ? " known" : "");
    $("verif-titre").textContent = TYPE_LABEL[fiche.verification.type] || "Vérification";

    $("verif-q").textContent = fiche.verification.question;
    $("qser-q").textContent = fiche.qser.question;
    $("ps-q").textContent = fiche.premiers_secours.question;
    setAnswer("verif-r", fiche.verification.reponse);
    setAnswer("qser-r", fiche.qser.reponse);
    setAnswer("ps-r", fiche.premiers_secours.reponse);

    setRevealed(false);
    $("btn-known").textContent = known[fiche.numero] ? "Remettre à réviser" : "Je la connais";
    $("goto").value = fiche.numero;
    try { history.replaceState(null, "", "#" + fiche.numero); } catch (e) { /* file:// sur certains navigateurs */ }
    $("fiche").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setRevealed(on) {
    document.querySelectorAll("#fiche .reponse").forEach(function (el) { el.hidden = !on; });
    $("btn-reveal").textContent = on ? "Masquer les réponses" : "Afficher les réponses";
  }

  function toggleReveal() {
    if (!current) return;
    setRevealed($("verif-r").parentNode.hidden);
  }

  function random() {
    var list = pool();
    if (!list.length) {
      $("progress").textContent = "Aucune fiche ne correspond aux filtres : toutes celles-ci sont marquées comme sues.";
      return;
    }
    // Évite de retomber sur la même fiche deux fois de suite.
    if (list.length > 1 && current) {
      list = list.filter(function (f) { return f.numero !== current.numero; });
    }
    show(list[Math.floor(Math.random() * list.length)]);
  }

  function byNumber(n) {
    var f = FICHES.find(function (x) { return x.numero === n; });
    if (f) show(f);
  }

  function step(delta) {
    var n = current ? current.numero + delta : 1;
    if (n < 1) n = 100;
    if (n > 100) n = 1;
    byNumber(n);
  }

  function toggleKnown() {
    if (!current) return;
    if (known[current.numero]) delete known[current.numero];
    else known[current.numero] = true;
    saveKnown();
    renderProgress();
    renderList();
    $("btn-known").textContent = known[current.numero] ? "Remettre à réviser" : "Je la connais";
    $("fiche-type").classList.toggle("known", !!known[current.numero]);
  }

  function renderProgress() {
    var n = Object.keys(known).length;
    $("progress").innerHTML = n + " fiche" + (n > 1 ? "s" : "") + " sur 100 marquée" + (n > 1 ? "s" : "") +
      " comme sue" + (n > 1 ? "s" : "") + (n ? ' · <button type="button" id="btn-reset">Tout remettre à zéro</button>' : "");
    var reset = $("btn-reset");
    if (reset) reset.addEventListener("click", function () {
      if (!confirm("Remettre toutes les fiches à réviser ?")) return;
      known = {};
      saveKnown();
      renderProgress();
      renderList();
      if (current) show(current);
    });
  }

  function renderList() {
    var ol = $("liste");
    ol.innerHTML = "";
    FICHES.forEach(function (f) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<span class="num"></span><span class="t ' + f.verification.type + '">' +
        f.verification.type + '</span><span class="q"></span>' + (known[f.numero] ? '<span class="ok">✓</span>' : "");
      b.querySelector(".num").textContent = label(f.numero);
      b.querySelector(".q").textContent = f.verification.question;
      b.addEventListener("click", function () { show(f); });
      li.appendChild(b);
      ol.appendChild(li);
    });
  }

  $("btn-random").addEventListener("click", random);
  $("btn-reveal").addEventListener("click", toggleReveal);
  $("btn-known").addEventListener("click", toggleKnown);
  $("btn-prev").addEventListener("click", function () { step(-1); });
  $("btn-next").addEventListener("click", function () { step(1); });
  $("btn-goto").addEventListener("click", function () {
    var n = parseInt($("goto").value, 10);
    if (n === 0) n = 100;
    if (n >= 1 && n <= 100) byNumber(n);
  });
  $("goto").addEventListener("keydown", function (e) {
    if (e.key === "Enter") $("btn-goto").click();
  });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === " " && tag !== "button" && tag !== "summary") { e.preventDefault(); random(); }
    else if (e.key === "r" || e.key === "R") toggleReveal();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  renderProgress();
  renderList();

  var fromHash = parseInt(location.hash.slice(1), 10);
  if (fromHash >= 1 && fromHash <= 100) byNumber(fromHash);
})();
