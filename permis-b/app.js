(function () {
  "use strict";

  var FICHES = window.FICHES || [];
  var KEY_KNOWN = "permisb-fiches-sues";
  var KEY_BEST = "permisb-meilleur-defi";
  var MISSING = "Le document officiel ne donne pas de réponse écrite : fais la manipulation ou montre l'élément demandé.";
  var TYPE_LABEL = { VI: "Intérieur", VE: "Extérieur" };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (id) { return document.getElementById(id); };
  var byNum = {};
  FICHES.forEach(function (f) { byNum[f.numero] = f; });

  var state = {
    filter: "all",
    onlyTodo: false,
    current: null,
    history: [],
    known: load(KEY_KNOWN, {}),
    best: load(KEY_BEST, null),
    size: 10,
    ch: null
  };

  // ---------- Utilitaires ----------
  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Le PDF officiel numérote la 100e fiche « 00 ».
  function label(n) { return n === 100 ? "00" : String(n).padStart(2, "0"); }
  function buzz(ms) { if (navigator.vibrate && !reduceMotion) navigator.vibrate(ms || 8); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function nextFrame(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }

  // ---------- Contrôles segmentés (pastille qui glisse) ----------
  function segmented(el, onChange) {
    var pill = el.querySelector(".seg-pill");
    var buttons = Array.prototype.slice.call(el.querySelectorAll("button"));
    var attr = buttons[0].getAttribute("role") === "tab" ? "aria-selected" : "aria-checked";
    function place() {
      var active = buttons.filter(function (b) { return b.getAttribute(attr) === "true"; })[0] || buttons[0];
      pill.style.width = active.offsetWidth + "px";
      pill.style.transform = "translateX(" + (active.offsetLeft - 3) + "px)";
    }
    function select(value, silent) {
      buttons.forEach(function (b) { b.setAttribute(attr, String(b.dataset.value === value)); });
      place();
      if (!silent) onChange(value);
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute(attr) === "true") return;
        buzz(5);
        select(b.dataset.value);
      });
    });
    window.addEventListener("resize", place);
    place();
    return { select: select, place: place };
  }

  // ---------- Compteur kilométrique ----------
  // Chaque chiffre est un tambour (0-9 répété 3 fois) qu'on fait tourner vers le haut.
  // La position de repos est toujours dans la copie du milieu (indices 10 à 19).
  function odometer(el, value) {
    el.classList.add("odo");
    el.innerHTML = '<span class="odo-tag">N°</span><span class="odo-win"></span>';
    var win = el.querySelector(".odo-win");
    var drums = [0, 1].map(function () {
      var d = document.createElement("span");
      d.className = "odo-d";
      var strip = document.createElement("span");
      strip.className = "odo-strip";
      var html = "";
      for (var i = 0; i < 30; i++) html += "<span>" + (i % 10) + "</span>";
      strip.innerHTML = html;
      d.appendChild(strip);
      win.appendChild(d);
      return { strip: strip, pos: 10 };
    });
    function place(drum, pos, duration) {
      drum.strip.style.transition = duration ? "transform " + duration + "ms cubic-bezier(.22, 1, .36, 1)" : "none";
      drum.strip.style.transform = "translateY(" + (-pos * 10 / 3) + "%)";
      drum.pos = pos;
    }
    function digits(n) { return label(n).split("").map(Number); }
    function set(n, spin) {
      digits(n).forEach(function (digit, i) {
        var drum = drums[i];
        var target = 10 + digit;
        if (reduceMotion) { place(drum, target, 0); return; }
        if (spin) {
          // Recule d'un tour complet sans animation, puis roule vers l'avant jusqu'au chiffre.
          place(drum, drum.pos - 10, 0);
          void drum.strip.offsetWidth;
          place(drum, target, 900 + i * 450);
        } else if (target !== drum.pos) {
          place(drum, target, 450);
        }
      });
      el.setAttribute("aria-label", "Fiche " + label(n));
    }
    function setDigits(text) {
      // Saisie en cours dans le pavé : affiche les chiffres tapés, cadrés à droite.
      var t = ("--" + text).slice(-2);
      t.split("").forEach(function (c, i) {
        var drum = drums[i];
        drum.strip.parentNode.classList.toggle("blank", c === "-");
        if (c !== "-") place(drum, 10 + Number(c), reduceMotion ? 0 : 380);
      });
    }
    digits(value || 100).forEach(function (d, i) { place(drums[i], 10 + d, 0); });
    return { set: set, setDigits: setDigits };
  }

  // ---------- Carte d'une fiche ----------
  function answerHtml(a, extra) {
    if (a) return '<div class="answer-inner">' + esc(a) + "</div>";
    if (!extra) return '<div class="answer-inner missing">' + esc(MISSING) + "</div>";
    // Réponse rédigée par l'auto-école + pictogramme, quand le document officiel n'en donne pas.
    var path = (window.ICONES || {})[extra.icone];
    return '<div class="answer-inner complement">' +
      (path ? '<span class="visual" style="--c:' + extra.couleur + '" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="' + path + '"/></svg></span>' : "") +
      '<span class="complement-txt">' + esc(extra.reponse) +
      '<small>Réponse de l\'auto-école · non officielle</small></span></div>';
  }

  function qaBlock(kind, icon, title, q, a, judge, extra) {
    return '<section class="qa" data-kind="' + kind + '">' +
      '<p class="qa-label"><span aria-hidden="true">' + icon + "</span>" + title + "</p>" +
      '<p class="qa-q">' + esc(q) + "</p>" +
      '<button type="button" class="reveal-btn">Voir la réponse</button>' +
      '<div class="answer"><div>' + answerHtml(a, extra) + "</div></div>" +
      (judge ? '<div class="judge"><button type="button" class="no">✗ À revoir</button><button type="button" class="yes">✓ Je savais</button></div>' : "") +
      "</section>";
  }

  function buildCard(f, judge, from, spin) {
    var el = document.createElement("article");
    el.className = "card fiche enter";
    el.dataset.num = f.numero;
    var t = f.verification.type;
    el.innerHTML =
      '<span class="swipe-hint prev">← Précédente</span><span class="swipe-hint next">Suivante →</span>' +
      '<div class="fiche-head"><span class="fiche-odo"></span>' +
      '<span class="chips">' + (state.known[f.numero] && !judge ? '<span class="chip ok">✓ Sue</span>' : "") +
      '<span class="chip ' + t + '">' + (t === "VI" ? "🚗 " : "🔧 ") + TYPE_LABEL[t] + "</span></span></div>" +
      qaBlock("verif", t === "VI" ? "🚗" : "🔧", "Vérification " + TYPE_LABEL[t].toLowerCase(), f.verification.question, f.verification.reponse, judge, (window.COMPLEMENTS || {})[f.numero]) +
      qaBlock("qser", "🛣️", "Sécurité routière", f.qser.question, f.qser.reponse, judge) +
      qaBlock("ps", "⛑️", "Premiers secours", f.premiers_secours.question, f.premiers_secours.reponse, judge);

    var odo = odometer(el.querySelector(".fiche-odo"), from || f.numero);
    el.rollIn = function () { odo.set(f.numero, spin); };

    el.querySelectorAll(".reveal-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        b.closest(".qa").classList.add("open");
        buzz(6);
      });
    });
    return el;
  }

  function swapCard(container, card, direction) {
    var old = container.querySelector(".card.fiche:not(.leave)");
    if (old) {
      old.classList.add("leave");
      var dx = direction === "prev" ? 1 : -1;
      old.style.transform = "translateX(" + (dx * 115) + "%) rotate(" + (dx * 8) + "deg)";
      old.style.opacity = "0";
      setTimeout(function () { old.remove(); }, reduceMotion ? 0 : 450);
    }
    container.appendChild(card);
    nextFrame(function () {
      card.classList.remove("enter");
      if (card.rollIn) card.rollIn();
    });
  }

  // ---------- Mode révision ----------
  var stack = $("stack");

  function pool() {
    return FICHES.filter(function (f) {
      if (state.filter !== "all" && f.verification.type !== state.filter) return false;
      if (state.onlyTodo && state.known[f.numero]) return false;
      return true;
    });
  }

  function show(f, direction, spin) {
    var from = state.current ? state.current.numero : 0;
    if (state.current && direction !== "prev") state.history.push(state.current.numero);
    if (state.history.length > 200) state.history.shift();
    state.current = f;
    var card = buildCard(f, false, from, spin);
    attachSwipe(card);
    swapCard(stack, card, direction);
    stack.classList.remove("is-empty");
    updateKnownButton();
    markCurrentTile();
    try { history.replaceState(null, "", "#" + f.numero); } catch (e) { /* file:// */ }
  }

  function next() {
    var list = pool();
    if (!list.length) {
      toast(state.onlyTodo ? "Bravo, tu connais toutes ces fiches ! 🎉" : "Aucune fiche pour ce filtre.");
      if (state.onlyTodo) confetti();
      return;
    }
    if (list.length > 1 && state.current) {
      list = list.filter(function (f) { return f.numero !== state.current.numero; });
    }
    buzz(6);
    var dice = document.querySelector("#btn-next .dice");
    if (dice) { dice.classList.remove("roll"); void dice.offsetWidth; dice.classList.add("roll"); }
    show(list[Math.floor(Math.random() * list.length)], "next", true);
  }

  function prev() {
    var n = state.history.pop();
    if (n) show(byNum[n], "prev");
    else toast("Pas de fiche précédente.");
  }

  function toggleKnown() {
    var f = state.current;
    if (!f) { next(); return; }
    var n = f.numero;
    if (state.known[n]) {
      delete state.known[n];
      toast("Fiche " + label(n) + " remise à revoir.");
    } else {
      state.known[n] = true;
      buzz([10, 40, 10]);
      toast("Fiche " + label(n) + " marquée comme sue.", "Annuler", function () {
        delete state.known[n];
        save(KEY_KNOWN, state.known);
        refreshKnown();
      });
      var count = Object.keys(state.known).length;
      if (count % 10 === 0) { confetti(); toast(count + " fiches sues, continue comme ça ! 🚀"); }
    }
    save(KEY_KNOWN, state.known);
    refreshKnown();
  }

  function refreshKnown() {
    updateRing();
    updateKnownButton();
    renderGrid();
    var card = stack.querySelector(".card.fiche:not(.leave)");
    if (card && state.current) {
      var chips = card.querySelector(".chips");
      var ok = chips.querySelector(".chip.ok");
      if (state.known[state.current.numero] && !ok) chips.insertAdjacentHTML("afterbegin", '<span class="chip ok">✓ Sue</span>');
      if (!state.known[state.current.numero] && ok) ok.remove();
    }
  }

  function updateKnownButton() {
    var on = !!(state.current && state.known[state.current.numero]);
    $("btn-known").classList.toggle("on", on);
    $("btn-known").setAttribute("aria-pressed", String(on));
    $("btn-known").setAttribute("aria-label", on ? "Fiche sue (toucher pour la remettre à revoir)" : "Je connais cette fiche");
  }

  function updateRing() {
    var n = Object.keys(state.known).length;
    $("ring-num").textContent = n;
    $("ring-fg").style.strokeDashoffset = String(97.4 * (1 - n / 100));
    $("ring").setAttribute("aria-label", n + " fiches sues sur 100. Voir toutes les fiches");
  }

  // ---------- Glisser la carte ----------
  function attachSwipe(card) {
    var startX = 0, startY = 0, dx = 0, active = false, locked = false, id = null;
    var hintNext = card.querySelector(".swipe-hint.next");
    var hintPrev = card.querySelector(".swipe-hint.prev");

    card.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button") || e.button > 0) return;
      active = true; locked = false; dx = 0; id = e.pointerId;
      startX = e.clientX; startY = e.clientY;
    });
    card.addEventListener("pointermove", function (e) {
      if (!active || e.pointerId !== id) return;
      var mx = e.clientX - startX, my = e.clientY - startY;
      if (!locked) {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        if (Math.abs(my) > Math.abs(mx)) { active = false; return; }
        locked = true;
        card.classList.add("dragging");
        try { card.setPointerCapture(id); } catch (err) { /* ignore */ }
      }
      dx = mx;
      // Résistance au-delà de 140 px, comme un élastique.
      var shown = Math.abs(dx) > 140 ? Math.sign(dx) * (140 + (Math.abs(dx) - 140) * 0.4) : dx;
      card.style.transform = "translateX(" + shown + "px) rotate(" + (shown / 22) + "deg)";
      hintNext.style.opacity = String(Math.min(1, Math.max(0, -dx / 90)));
      hintPrev.style.opacity = String(Math.min(1, Math.max(0, dx / 90)));
    });
    function end() {
      if (!active) return;
      active = false;
      card.classList.remove("dragging");
      hintNext.style.opacity = hintPrev.style.opacity = "0";
      if (!locked) return;
      if (dx < -90) next();
      else if (dx > 90 && state.history.length) prev();
      else card.style.transform = "";
    }
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  // ---------- Tiroir : toutes les fiches ----------
  var sheet = $("sheet"), backdrop = $("sheet-backdrop");

  function renderGrid() {
    var q = $("search").value.trim().toLowerCase();
    var grid = $("grid");
    grid.innerHTML = "";
    var shown = 0;
    FICHES.forEach(function (f) {
      if (q) {
        var text = (f.verification.question + " " + f.qser.question + " " + f.premiers_secours.question + " " + label(f.numero) + " " + f.numero).toLowerCase();
        if (text.indexOf(q) === -1) return;
      }
      shown++;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile " + f.verification.type + (state.known[f.numero] ? " ok" : "") +
        (state.current && state.current.numero === f.numero ? " current" : "");
      b.textContent = label(f.numero);
      b.title = f.verification.question;
      b.setAttribute("aria-label", "Fiche " + label(f.numero) + " : " + f.verification.question);
      b.addEventListener("click", function () {
        closeSheet();
        setTab("revise");
        show(f, "next");
      });
      grid.appendChild(b);
    });
    $("no-result").hidden = shown > 0;
  }

  function markCurrentTile() {
    document.querySelectorAll(".tile.current").forEach(function (t) { t.classList.remove("current"); });
  }

  var picker = $("picker");
  var openSheetEl = null;

  function openPanel(el) {
    if (openSheetEl && openSheetEl !== el) closePanel(true);
    openSheetEl = el;
    backdrop.hidden = false;
    el.setAttribute("aria-hidden", "false");
    nextFrame(function () {
      backdrop.classList.add("show");
      el.classList.add("open");
    });
    buzz(5);
  }
  function closePanel(keepBackdrop) {
    var el = openSheetEl;
    if (!el) return;
    openSheetEl = null;
    el.style.transform = "";
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    if (keepBackdrop === true) return;
    backdrop.classList.remove("show");
    setTimeout(function () { if (!openSheetEl) backdrop.hidden = true; }, 450);
  }
  function openSheet() { renderGrid(); openPanel(sheet); }
  function closeSheet() { closePanel(); }

  [sheet, picker].forEach(function (panel) {
    var handle = panel.querySelector(".sheet-handle"), startY = 0, dy = 0, dragging = false;
    handle.addEventListener("pointerdown", function (e) {
      dragging = true; startY = e.clientY; dy = 0;
      panel.classList.add("dragging");
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      panel.style.transform = "translateY(" + dy + "px)";
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove("dragging");
      if (dy > 100) closePanel(); else panel.style.transform = "";
    }
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  });
  backdrop.addEventListener("click", function () { closePanel(); });

  // ---------- Choisir une fiche par son numéro ----------
  var pickOdo = odometer($("pick-odo"), 100);
  var typed = "";

  function pickedNumber() {
    if (!typed) return null;
    var n = parseInt(typed, 10);
    if (n === 0) return typed.length === 2 ? 100 : null;
    return n >= 1 && n <= 99 ? n : null;
  }
  function renderPick() {
    pickOdo.setDigits(typed);
    var n = pickedNumber();
    var go = $("pick-go");
    go.disabled = !n;
    go.textContent = n ? "Voir la fiche " + label(n) : "Voir la fiche";
    $("pick-info").textContent = n
      ? byNum[n].verification.question
      : "Tape un numéro de 1 à 99, ou 00 pour la fiche 100.";
    $("pick-info").classList.toggle("has-q", !!n);
  }
  function openPicker() {
    typed = "";
    renderPick();
    openPanel(picker);
  }
  function pressKey(k) {
    if (k === "del") typed = typed.slice(0, -1);
    else if (k === "ok") { goPicked(); return; }
    else typed = (typed.length >= 2 ? "" : typed) + k;
    buzz(4);
    renderPick();
  }
  function goPicked() {
    var n = pickedNumber();
    if (!n) return;
    closePanel();
    setTab("revise");
    show(byNum[n], "next", true);
  }
  $("keypad").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) pressKey(b.dataset.k);
  });
  $("pick-go").addEventListener("click", goPicked);
  $("pick-grid").addEventListener("click", function () { renderGrid(); openPanel(sheet); });

  // ---------- Toasts ----------
  function toast(msg, actionLabel, action) {
    var list = $("toasts");
    var li = document.createElement("li");
    li.className = "toast in";
    li.innerHTML = '<span class="t-msg"></span>';
    li.querySelector(".t-msg").textContent = msg;
    if (actionLabel) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = actionLabel;
      b.addEventListener("click", function () { action(); dismiss(); });
      li.appendChild(b);
    }
    list.appendChild(li);
    layoutToasts();
    nextFrame(function () { li.classList.remove("in"); layoutToasts(); });
    var timer = setTimeout(dismiss, 3200);
    function dismiss() {
      clearTimeout(timer);
      if (li.classList.contains("out")) return;
      li.classList.add("out");
      setTimeout(function () { li.remove(); layoutToasts(); }, 400);
    }
  }
  function layoutToasts() {
    // Empile les toasts comme un paquet : le plus récent devant.
    var items = Array.prototype.slice.call(document.querySelectorAll(".toast:not(.out)")).reverse();
    items.forEach(function (t, i) {
      if (t.classList.contains("in")) return;
      t.style.transform = "translateY(" + (-i * 10) + "px) scale(" + (1 - i * 0.05) + ")";
      t.style.opacity = i > 2 ? "0" : String(1 - i * 0.15);
      t.style.zIndex = String(10 - i);
    });
  }

  // ---------- Confettis ----------
  function confetti() {
    if (reduceMotion) return;
    var c = $("confetti"), ctx = c.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    var colors = ["#358ed2", "#f5d92d", "#7c5cff", "#12a37a", "#e5484d"];
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 80,
        y: innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        w: 6 + Math.random() * 6,
        h: 3 + Math.random() * 4,
        c: colors[i % colors.length]
      });
    }
    var start = performance.now();
    (function frame(t) {
      var life = (t - start) / 2600;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += 0.35; p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (life < 1) requestAnimationFrame(frame);
      else ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.clearRect(0, 0, c.width, c.height);
    })(start);
  }

  // ---------- Mode défi ----------
  var chStack = $("ch-stack");

  function showBest() {
    $("ch-best").textContent = state.best
      ? "Ton record : " + state.best.score + " / " + state.best.total + " · série de " + state.best.streak + " 🔥"
      : "";
  }

  function startChallenge() {
    var list = shuffle(FICHES.slice()).slice(0, state.size);
    state.ch = { list: list, i: 0, score: 0, streak: 0, bestStreak: 0, perfect: 0, judged: 0 };
    $("ch-intro").hidden = true;
    $("ch-result").hidden = true;
    $("ch-run").hidden = false;
    chStack.innerHTML = "";
    showChallengeCard();
    buzz(10);
  }

  function showChallengeCard() {
    var ch = state.ch;
    var f = ch.list[ch.i];
    ch.judged = 0;
    ch.cardGood = 0;
    var from = ch.i > 0 ? ch.list[ch.i - 1].numero : 0;
    var card = buildCard(f, true, from, true);
    card.querySelectorAll(".qa").forEach(function (qa) {
      qa.querySelector(".yes").addEventListener("click", function () { judge(qa, true); });
      qa.querySelector(".no").addEventListener("click", function () { judge(qa, false); });
    });
    swapCard(chStack, card, "next");
    $("ch-next").disabled = true;
    $("ch-next").firstChild.textContent = ch.i === ch.list.length - 1 ? "Voir le résultat " : "Fiche suivante ";
    updateHud();
  }

  function judge(qa, good) {
    var ch = state.ch;
    if (qa.classList.contains("judged")) return;
    qa.classList.add("judged", good ? "judged-yes" : "judged-no");
    ch.judged++;
    if (good) {
      ch.score++; ch.cardGood++; ch.streak++;
      ch.bestStreak = Math.max(ch.bestStreak, ch.streak);
      buzz(12);
      var pt = document.createElement("span");
      pt.className = "float-pt";
      pt.textContent = "+1";
      pt.style.top = qa.offsetTop + "px";
      qa.parentNode.appendChild(pt);
      setTimeout(function () { pt.remove(); }, 900);
      if (ch.streak > 0 && ch.streak % 5 === 0) toast("Série de " + ch.streak + " ! 🔥");
    } else {
      ch.streak = 0;
      buzz([20, 30, 20]);
    }
    updateHud(true);
    if (ch.judged === 3) {
      if (ch.cardGood === 3) {
        ch.perfect++;
        state.known[ch.list[ch.i].numero] = true;
        save(KEY_KNOWN, state.known);
        updateRing();
      }
      $("ch-next").disabled = false;
      $("ch-next").focus({ preventScroll: true });
    } else {
      // Ouvre la question suivante pour garder le rythme.
      var nextQa = qa.nextElementSibling;
      if (nextQa && nextQa.classList.contains("qa")) {
        nextQa.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }
    }
  }

  function updateHud(bump) {
    var ch = state.ch;
    $("ch-step").textContent = "Fiche " + (ch.i + 1) + " / " + ch.list.length;
    $("ch-bar").style.width = (100 * (ch.i + ch.judged / 3) / ch.list.length) + "%";
    var s = $("ch-score"), st = $("ch-streak");
    s.textContent = ch.score + (ch.score > 1 ? " pts" : " pt");
    st.textContent = "🔥 " + ch.streak;
    st.classList.toggle("hot", ch.streak >= 3);
    if (bump) {
      [s, st].forEach(function (el) {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
      });
    }
  }

  function nextChallenge() {
    var ch = state.ch;
    if (ch.i < ch.list.length - 1) {
      ch.i++;
      showChallengeCard();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      finishChallenge();
    }
  }

  function finishChallenge() {
    var ch = state.ch;
    var total = ch.list.length * 3;
    var pct = Math.round(100 * ch.score / total);
    $("ch-run").hidden = true;
    $("ch-result").hidden = false;
    $("res-total").textContent = total;
    $("res-pct").textContent = pct + " %";
    $("res-streak").textContent = ch.bestStreak;
    $("res-perfect").textContent = ch.perfect;
    var rank = pct >= 90 ? ["🏆", "Champion !", "Tu es prêt pour l'examen. L'inspecteur n'a qu'à bien se tenir."]
      : pct >= 70 ? ["🚀", "Très bien !", "Encore quelques fiches à revoir et ce sera parfait."]
      : pct >= 50 ? ["👍", "Pas mal !", "Tu es sur la bonne route, continue à réviser."]
      : ["💪", "Courage !", "Relis les fiches en mode révision, puis retente le défi."];
    $("res-emoji").textContent = rank[0];
    $("res-title").textContent = rank[1];
    $("res-text").textContent = rank[2] + (ch.perfect ? " Les fiches parfaites sont marquées comme sues." : "");
    countUp($("res-score"), ch.score);
    var isRecord = !state.best || ch.score / total > state.best.score / state.best.total;
    if (isRecord) {
      state.best = { score: ch.score, total: total, streak: ch.bestStreak };
      save(KEY_BEST, state.best);
      if (ch.score > 0) toast("Nouveau record ! 🏅");
    }
    if (pct >= 70) confetti();
    renderGrid();
    window.scrollTo({ top: 0 });
  }

  function countUp(el, to) {
    if (reduceMotion || to === 0) { el.textContent = to; return; }
    var start = performance.now(), dur = 900;
    (function step(t) {
      var p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function backToIntro() {
    state.ch = null;
    $("ch-run").hidden = true;
    $("ch-result").hidden = true;
    $("ch-intro").hidden = false;
    showBest();
    sizeSeg.place();
  }

  // ---------- Onglets ----------
  var tabs = segmented($("tabs"), function (v) { setTab(v, true); });
  function setTab(v, fromControl) {
    if (!fromControl) tabs.select(v, true);
    $("view-revise").hidden = v !== "revise";
    $("view-challenge").hidden = v !== "challenge";
    if (v === "revise") filterSeg.place();
    else if (!state.ch) { showBest(); sizeSeg.place(); }
  }

  var filterSeg = segmented($("filter"), function (v) { state.filter = v; next(); });
  var sizeSeg = segmented($("ch-size"), function (v) { state.size = parseInt(v, 10); });

  // ---------- Événements ----------
  $("only-todo").addEventListener("change", function (e) {
    state.onlyTodo = e.target.checked;
    buzz(5);
    if (state.onlyTodo && state.current && state.known[state.current.numero]) next();
  });
  $("btn-next").addEventListener("click", next);
  $("btn-known").addEventListener("click", toggleKnown);
  $("btn-pick").addEventListener("click", openPicker);
  $("ring").addEventListener("click", openSheet);
  $("search").addEventListener("input", renderGrid);
  $("btn-reset").addEventListener("click", function () {
    if (!confirm("Remettre toutes les fiches à revoir ?")) return;
    state.known = {};
    save(KEY_KNOWN, state.known);
    refreshKnown();
    toast("Toutes les fiches sont à revoir.");
  });
  $("ch-start").addEventListener("click", startChallenge);
  $("ch-next").addEventListener("click", nextChallenge);
  $("ch-quit").addEventListener("click", function () {
    if (state.ch && state.ch.i > 0 && !confirm("Arrêter le défi en cours ?")) return;
    backToIntro();
  });
  $("res-again").addEventListener("click", startChallenge);
  $("res-back").addEventListener("click", backToIntro);

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "Escape" && openSheetEl) { closePanel(); return; }
    if (tag === "input" || tag === "textarea" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (openSheetEl === picker) {
      if (/^[0-9]$/.test(e.key)) pressKey(e.key);
      else if (e.key === "Backspace") pressKey("del");
      else if (e.key === "Enter") { e.preventDefault(); goPicked(); }
      return;
    }
    if (openSheetEl) return;
    if (e.key === "n" || e.key === "N" || e.key === "#") { openPicker(); return; }
    var revising = !$("view-revise").hidden;
    if (revising) {
      if (e.key === " " && tag !== "button") { e.preventDefault(); next(); }
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "k" || e.key === "K") toggleKnown();
    }
    if (e.key === "r" || e.key === "R") {
      var root = revising ? stack : chStack;
      var closed = root.querySelector(".card.fiche:not(.leave) .qa:not(.open) .reveal-btn");
      if (closed) closed.click();
    }
    if (e.key === "l" || e.key === "L") openSheet();
  });

  // ---------- Démarrage ----------
  updateRing();
  renderGrid();
  var fromHash = parseInt(location.hash.slice(1), 10);
  if (byNum[fromHash]) show(byNum[fromHash], "next");
  else next();
  // Les polices système peuvent changer la largeur des boutons après le premier rendu.
  window.addEventListener("load", function () { tabs.place(); filterSeg.place(); });
})();
