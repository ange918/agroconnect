(function () {
  const CFG = window.MAFOYA_CONFIG, DATA = window.MAFOYA_DATA, I18N = window.MAFOYA_I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const app = $("#app");
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } },
  };
  let lang = store.get("mafoya_lang", (navigator.language || "fr").startsWith("en") ? "en" : "fr");
  let cart = store.get("mafoya_cart", []);

  const t = (k) => I18N[lang][k];
  const L = (o) => (o && o[lang]) || "";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(n) + " " + CFG.currency;
  const num = (n) => new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(n);
  const byId = (id) => DATA.products.find((p) => p.id === id);

  function totalStock(p) { return p.type === "fabric" ? p.stock : Object.values(p.sizes).reduce((a, b) => a + b, 0); }
  function statusOf(p) {
    if (p.status === "soon") return "soon";
    return totalStock(p) <= 0 ? "soldout" : "available";
  }
  function badge(p) {
    const s = statusOf(p);
    const low = s === "available" && p.type === "garment" && totalStock(p) <= 3;
    return s === "available" && !low ? "" : `<span class="badge ${s}">${t(low ? "low_stock" : s)}</span>`;
  }
  const IMG = DATA.images || {};
  function slot(key, pattern, cls, label) {
    const inner = IMG[key] ? `<img src="${esc(IMG[key])}" alt="${esc(label || "")}" loading="lazy">` : `<div class="swatch ${pattern}" role="img" aria-label="${esc(label || "")}"></div>`;
    return `<div class="slot ${cls || ""}">${inner}</div>`;
  }
  const ICONS = {
    card: '<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><rect x="6" y="10" width="108" height="62" rx="8"/><path d="M22 36h22M22 50h30M84 36h12"/><rect x="62" y="56" width="40" height="30" rx="6" fill="var(--bg)"/><path d="M70 56V46a12 12 0 0 1 24 0v10"/></svg>',
    thread: '<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M10 80 70 20l14 14-60 60-14-14Z" transform="translate(6 -6)"/><path d="M80 24l16-16 16 16-16 16"/><path d="M30 70l16 16M50 50l16 16"/></svg>',
    box: '<svg viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"><path d="M60 8 14 28v48l46 18 46-18V28L60 8Z"/><path d="M14 28l46 18 46-18M60 46v48"/><circle cx="92" cy="76" r="20" fill="var(--bg)"/><path d="m82 76 7 7 12-14"/></svg>',
  };
  function visual(p) { return `<div class="swatch ${p.pattern}" role="img" aria-label="${esc(L(p.name))}"></div>`; }
  function card(p) {
    const unit = p.type === "fabric" ? " " + t("per_meter") : "";
    return `<a class="card" href="#/product/${p.id}">
      <div class="card-visual">${visual(p)}${badge(p)}</div>
      <h3>${esc(L(p.name))}</h3><p class="price">${money(p.price)}${unit}</p></a>`;
  }

  /* ---------- Vues ---------- */
  const views = {
    home() {
      const tiles = [
        ["homme", "#/shop/homme", t("cat_men"), "batik-indigo"], ["femme", "#/shop/femme", t("cat_women"), "terracotta"],
        ["teint", "#/fabrics/teint", L(DATA.fabricFamilies[0]), "batik-indigo"], ["kanvo", "#/fabrics/kanvo", L(DATA.fabricFamilies[1]), "kanvo"],
      ].map(([k, h, label, pat]) => `<a class="cat-card" href="${h}">${slot(k, pat, "tall", label)}<span>${label}</span></a>`).join("");
      const news = DATA.products.filter((p) => p.collection === "nouveautes").map(card).join("");
      const reassure = [["card", "re1"], ["thread", "re2"], ["box", "re3"]].map(([i, k]) => `<div class="reassure"><div class="r-icon">${ICONS[i]}</div><h3>${t(k + "_t")}</h3><p>${t(k + "_p")}</p></div>`).join("");
      const values = t("values").map(([h, p]) => `<div class="value"><h3>${h}</h3><p>${p}</p></div>`).join("");
      return `<a href="#/shop" class="hero-link" aria-label="${t("hero_cta")}">${slot("hero", "batik-indigo", "hero", "MAFOYA")}</a>
        <section class="block"><div class="cat-grid">${tiles}</div></section>
        <section class="block"><div class="section-head"><h2>${t("home_new")}</h2><a href="#/collections">${t("see_all")}</a></div><div class="grid">${news}</div></section>
        <section class="block reassure-block">${reassure}</section>
        <section class="block story">${slot("story", "kanvo", "wide", t("story_home_t"))}
          <h2 class="big">${t("story_home_t")}</h2><p>${t("home_story_text")}</p><a class="btn" href="#/story">${t("read_story")}</a></section>
        <section class="block vision"><h2 class="big">${t("vision_t")}</h2><p class="lead">${t("vision_p")}</p><div class="values">${values}</div></section>
        <section class="block story">${slot("creator", "terracotta", "wide", t("creator_name"))}
          <h2 class="big">${t("creator_t")}</h2><p>${t("creator_name")}</p><a class="btn" href="#/creator">${t("creator_cta")}</a></section>`;
    },
    creator() {
      return `<section class="section narrow"><h1>${t("creator_t")}</h1>${slot("creator", "terracotta", "tall portrait", t("creator_name"))}
        <h2>${t("creator_name")}</h2><p>${t("creator_p")}</p><p class="muted small">${t("creator_todo")}</p>
        <p class="quote">${t("story_p3")}</p><a class="btn" href="#/story">${t("read_story")}</a></section>`;
    },
    shop(cat, qs) {
      const q = (qs.get("q") || "").toLowerCase(), sort = qs.get("sort") || "";
      let list = DATA.products.filter((p) => p.type === "garment" && (!cat || p.cat === cat) && (!q || L(p.name).toLowerCase().includes(q)));
      if (sort === "asc") list.sort((a, b) => a.price - b.price);
      if (sort === "desc") list.sort((a, b) => b.price - a.price);
      const cats = DATA.categories.concat(CFG.accessoriesEnabled ? [{ id: "accessoires", fr: "Accessoires", en: "Accessories" }] : []);
      const filters = [`<a class="chip ${!cat ? "on" : ""}" href="#/shop">${t("all")}</a>`].concat(cats.map((c) => `<a class="chip ${cat === c.id ? "on" : ""}" href="#/shop/${c.id}">${L(c)}</a>`)).join("");
      return `<section class="section"><h1>${t("shop_title")}</h1>
        <div class="filters"><div class="chips">${filters}</div>
        <form class="tools" data-filter-form data-base="#/shop${cat ? "/" + cat : ""}">
          <input type="search" name="q" value="${esc(qs.get("q") || "")}" placeholder="${t("search")}" aria-label="${t("search")}">
          <select name="sort" aria-label="${t("sort")}">
            <option value="">${t("sort_default")}</option>
            <option value="asc" ${sort === "asc" ? "selected" : ""}>${t("sort_asc")}</option>
            <option value="desc" ${sort === "desc" ? "selected" : ""}>${t("sort_desc")}</option></select>
        </form></div>
        ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<p class="muted">${t("no_result")}</p>`}</section>`;
    },
    fabrics(fam) {
      const list = DATA.products.filter((p) => p.type === "fabric" && (!fam || p.family === fam));
      const chips = [`<a class="chip ${!fam ? "on" : ""}" href="#/fabrics">${t("all")}</a>`].concat(DATA.fabricFamilies.map((f) => `<a class="chip ${fam === f.id ? "on" : ""}" href="#/fabrics/${f.id}">${L(f)}</a>`)).join("");
      return `<section class="section"><h1>${t("fabrics_title")}</h1><p class="muted">${t("fabrics_intro")}</p>
        <div class="chips">${chips}</div><div class="grid">${list.map(card).join("")}</div></section>`;
    },
    collections() {
      return `<section class="section"><h1>${t("collections_title")}</h1>` + DATA.collections.map((c) => {
        const items = DATA.products.filter((p) => p.collection === c.id).map(card).join("");
        return `<h2>${L(c)}</h2><div class="grid">${items}</div>`;
      }).join("") + `</section>`;
    },
    product(id) {
      const p = byId(id);
      if (!p) return views.shop();
      const s = statusOf(p), can = s === "available", fab = p.type === "fabric";
      const back = fab ? `#/fabrics/${p.family}` : `#/shop/${p.cat}`;
      let opts;
      if (fab) {
        opts = `<p class="muted">${t("color")} : ${esc(p.color)}${p.width ? " · " + t("width") + " : " + esc(p.width) : ""}</p>
          <p class="muted">${t("min_length")} : ${num(p.min)} ${t("meters")}</p>
          <label>${t("length")} (${t("meters")})<input type="number" id="qty" min="${p.min}" step="${p.step}" value="${p.min}" max="${p.stock}"></label>
          <p class="muted small">${t("batch_note")}</p>`;
      } else {
        const sizes = Object.entries(p.sizes).map(([k, v]) => `<option value="${k}" ${v <= 0 ? "disabled" : ""}>${k}${v <= 0 ? " — " + t("soldout") : ""}</option>`).join("");
        opts = `<label>${t("color")}<select id="color">${p.colors.map((c) => `<option>${esc(c)}</option>`).join("")}</select></label>
          <label>${t("size")}<select id="size"><option value="">${t("select_size")}</option>${sizes}</select></label>
          <label>${t("qty")}<input type="number" id="qty" min="1" step="1" value="1"></label>`;
      }
      return `<section class="section product"><a class="back" href="${back}">← ${t("back")}</a>
        <div class="product-grid"><div class="product-visual">${visual(p)}</div>
        <div><h1>${esc(L(p.name))}</h1><p class="price big">${money(p.price)}${fab ? " " + t("per_meter") : ""}</p>
          <p>${badge(p) || `<span class="badge available">${t("available")}</span>`}</p>
          <p>${esc(L(p.desc))}</p><p class="muted small">${t("sku")} ${p.sku}</p>
          <form id="buy" data-id="${p.id}">${opts}
            <div class="actions"><button class="btn" data-act="add" ${can ? "" : "disabled"}>${t("add_cart")}</button>
            <button class="btn wa" data-act="wa" ${can ? "" : "disabled"}>${t("order_wa")}</button></div></form>
          <p class="muted small">${t("delivery_info")}</p></div></div></section>`;
    },
    story() {
      return `<section class="section narrow"><h1>${t("story_title")}</h1><p>${t("story_p1")}</p><p>${t("story_p2")}</p><p class="quote">${t("story_p3")}</p></section>`;
    },
    faq() {
      const wa = `https://wa.me/${CFG.whatsappNumber}`;
      return `<section class="section narrow"><h1>${t("faq_title")}</h1>` +
        t("faq").map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("") +
        `<h2>${t("contact_title")}</h2><p><a class="btn wa" href="${wa}" target="_blank" rel="noopener">${t("contact_wa")}</a></p>
         <p class="muted">${t("contact_email")} : <a href="mailto:${CFG.email}">${CFG.email}</a></p></section>`;
    },
    legal() {
      return `<section class="section narrow"><h1>${t("legal_title")}</h1><p>${t("legal_text")}</p><ul>${t("legal_links").map((l) => `<li>${l}</li>`).join("")}</ul></section>`;
    },
    cart() {
      if (!cart.length) return `<section class="section narrow"><h1>${t("cart_title")}</h1><p class="muted">${t("cart_empty")}</p><a class="btn" href="#/shop">${t("hero_cta")}</a></section>`;
      const rows = cart.map((it, i) => {
        const p = byId(it.id), fab = p.type === "fabric";
        const meta = fab ? `${num(it.qty)} ${t("meters")}` : `${esc(it.color)} · ${it.size} · ×${it.qty}`;
        return `<li class="line"><div class="line-visual">${visual(p)}</div><div class="line-info"><strong>${esc(L(p.name))}</strong><span class="muted">${meta}</span></div>
          <div class="line-price">${money(p.price * it.qty)}<button class="link" data-remove="${i}">${t("remove")}</button></div></li>`;
      }).join("");
      return `<section class="section narrow"><h1>${t("cart_title")}</h1><ul class="lines">${rows}</ul>
        <div class="totals"><div><span>${t("subtotal")}</span><strong>${money(cartTotal())}</strong></div><div class="muted"><span>${t("shipping")}</span><span>${t("shipping_tbd")}</span></div></div>
        <h2>${t("checkout")}</h2>
        <form id="checkout" class="form">
          <label>${t("f_name")}<input name="name" required autocomplete="name"></label>
          <label>${t("f_phone")}<input name="phone" type="tel" required autocomplete="tel"></label>
          <label>${t("f_email")}<input name="email" type="email" autocomplete="email"></label>
          <label>${t("f_country")}<input name="country" autocomplete="country-name"></label>
          <label>${t("f_address")}<textarea name="address" rows="2" required></textarea></label>
          <label>${t("f_note")}<textarea name="note" rows="2"></textarea></label>
          <div class="actions"><button type="button" class="btn" disabled="${CFG.onlinePaymentEnabled ? "" : "disabled"}" ${CFG.onlinePaymentEnabled ? "" : "disabled"}>${CFG.onlinePaymentEnabled ? t("pay_online") : t("pay_online_off")}</button>
          <button type="submit" class="btn wa">${t("pay_wa")}</button></div>
        </form></section>`;
    },
  };

  /* ---------- Panier ---------- */
  const cartTotal = () => cart.reduce((a, it) => a + byId(it.id).price * it.qty, 0);
  const cartCount = () => cart.length;
  function saveCart() { store.set("mafoya_cart", cart); $("#cart-count").textContent = cartCount(); }
  function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); }

  function readBuy(form) {
    const p = byId(form.dataset.id), fab = p.type === "fabric";
    const qty = parseFloat($("#qty", form).value);
    if (!(qty > 0)) return null;
    if (fab) {
      if (qty < p.min || qty > p.stock || Math.abs((qty / p.step) - Math.round(qty / p.step)) > 1e-9) { $("#qty", form).reportValidity(); return null; }
      return { id: p.id, qty };
    }
    const size = $("#size", form).value;
    if (!size) { $("#size", form).focus(); toast(t("select_size")); return null; }
    if (qty > p.sizes[size] || !Number.isInteger(qty)) { toast(t("low_stock")); return null; }
    return { id: p.id, qty, size, color: $("#color", form).value };
  }
  function lineText(it) {
    const p = byId(it.id);
    const d = p.type === "fabric" ? `${num(it.qty)} ${t("meters")}` : `${it.color}, ${it.size}, ×${it.qty}`;
    return `• ${L(p.name)} [${p.sku}] — ${d} — ${money(p.price * it.qty)}`;
  }
  function openWhatsApp(lines, total, customer) {
    let msg = `${t("wa_intro")}\n${lines.join("\n")}\n${t("total_known")}: ${money(total)}`;
    if (customer) msg += `\n\n${t("wa_customer")}\n${customer}`;
    window.open(`https://wa.me/${CFG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  /* ---------- Routeur & rendu ---------- */
  function renderFooter() {
    const wa = `https://wa.me/${CFG.whatsappNumber}`;
    $("#footer").innerHTML = `<div class="foot-inner">
      <div class="brand-name">MAFOYA</div><p class="brand-tag">${t("tagline")}</p>
      <h3>${t("f_find")}</h3><p>${t("f_find_p")}</p>
      <h3>${t("f_contacts")}</h3>
      <p>💬 <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a></p>
      <p>✉ <a href="mailto:${CFG.email}">${CFG.email}</a></p>
      <p class="muted small">${t("f_collab")} : ${CFG.email}</p>
      <h3>${t("journal_t")}</h3><p class="muted">${t("journal_p")}</p>
      <form class="journal" id="journal"><input type="email" placeholder="${t("journal_ph")}" aria-label="${t("journal_ph")}" required><button aria-label="OK">→</button></form>
      <p class="muted small"><a href="#/legal">${t("legal_title")}</a> · <a href="#/faq">${t("nav_faq")}</a></p></div>
      <div class="foot-line"><p>${t("f_line")}</p><p>${t("f_house")}</p>
      <label class="lang-select"><span>${t("f_lang")}</span><select id="lang-footer" aria-label="${t("f_lang")}"><option value="fr" ${lang === "fr" ? "selected" : ""}>Français</option><option value="en" ${lang === "en" ? "selected" : ""}>English</option></select></label>
      <p class="muted small">${t("footer_note")}</p><p class="muted small">© ${new Date().getFullYear()} MAFOYA</p></div>`;
  }
  function renderChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $("#lang-drawer").value = lang; $("#drawer-lang-label").textContent = t("f_lang");
    $("#search-link").setAttribute("aria-label", t("search_label"));
    $("#fab").href = `https://wa.me/${CFG.whatsappNumber}`;
    const links = [["", "nav_home"], ["shop", "nav_shop"], ["fabrics", "nav_fabrics"], ["collections", "nav_collections"], ["story", "nav_story"], ["creator", "nav_creator"], ["faq", "nav_faq"]];
    const cur = (location.hash.replace(/^#\/?/, "").split(/[/?]/)[0]) || "";
    $("#nav").innerHTML = links.map(([h, k]) => `<a href="#/${h}" class="${cur === h ? "on" : ""}">${t(k)}</a>`).join("");
    $("#cart-count").textContent = cartCount();
    renderFooter();
  }
  function setDrawer(open) {
    $("#drawer").classList.toggle("open", open); $("#overlay").classList.toggle("open", open);
    $("#burger").setAttribute("aria-expanded", open);
  }
  function route() {
    const [path, query] = location.hash.replace(/^#\/?/, "").split("?");
    const [name, arg] = path.split("/");
    const qs = new URLSearchParams(query || "");
    const view = views[name || "home"] || views.home;
    app.innerHTML = view(arg, qs);
    document.title = "MAFOYA — " + t("tagline");
    renderChrome();
    setDrawer(false);
    window.scrollTo(0, 0);
    if (qs.get("focus")) { const i = $("input[name=q]"); if (i) i.focus(); }
  }

  document.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove]");
    if (rm) { cart.splice(+rm.dataset.remove, 1); saveCart(); route(); return; }
    const act = e.target.closest("[data-act]");
    if (act) {
      e.preventDefault();
      const item = readBuy(act.closest("form"));
      if (!item) return;
      if (act.dataset.act === "add") {
        const same = cart.find((c) => c.id === item.id && c.size === item.size && c.color === item.color);
        same ? (same.qty += item.qty) : cart.push(item);
        saveCart(); renderChrome(); toast(t("added"));
      } else openWhatsApp([lineText(item)], byId(item.id).price * item.qty);
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "checkout") {
      e.preventDefault();
      const f = new FormData(e.target), g = (k) => (f.get(k) || "").toString().trim();
      if (!g("name") || !g("phone") || !g("address")) { toast(t("fill_required")); return; }
      const customer = [g("name"), g("phone"), g("email"), g("country"), g("address"), g("note")].filter(Boolean).join("\n");
      openWhatsApp(cart.map(lineText), cartTotal(), customer);
    } else if (e.target.id === "journal") {
      e.preventDefault(); toast(t("journal_off"));
    } else if (e.target.dataset.filterForm !== undefined) {
      e.preventDefault();
    }
  });
  document.addEventListener("input", (e) => {
    const f = e.target.closest("[data-filter-form]");
    if (!f) return;
    const p = new URLSearchParams(new FormData(f));
    [...p.keys()].forEach((k) => !p.get(k) && p.delete(k));
    const focusSearch = e.target.name === "q";
    location.hash = f.dataset.base.slice(1) + (p.toString() ? "?" + p : "");
    if (focusSearch) { const i = $("input[name=q]"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  });
  function setLang(v) { lang = v; store.set("mafoya_lang", lang); route(); }
  $("#lang-drawer").addEventListener("change", (e) => setLang(e.target.value));
  document.addEventListener("change", (e) => { if (e.target.id === "lang-footer") setLang(e.target.value); });
  $("#burger").addEventListener("click", () => setDrawer(true));
  $("#drawer-close").addEventListener("click", () => setDrawer(false));
  $("#overlay").addEventListener("click", () => setDrawer(false));
  window.addEventListener("hashchange", route);
  route();
})();
