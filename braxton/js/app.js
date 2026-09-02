(function () {
  const KEY = "braxton_cart_v1";
  const PRODUCTS = {
    elite: { id: "elite", name: "Braxton EliteBook 13", base: 1799, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80" },
    "board-14": { id: "board-14", name: "Braxton Board 14", base: 1599, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" },
    "secure-15": { id: "secure-15", name: "Braxton Secure 15", base: 2099, img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" },
    "fleet-16": { id: "fleet-16", name: "Braxton Fleet 16", base: 1899, img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" },
    "brief-12": { id: "brief-12", name: "Braxton Brief 12", base: 1399, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80" }
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = (c) => localStorage.setItem(KEY, JSON.stringify(c));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const count = () => load().reduce((s, i) => s + i.qty, 0);
  const total = () => load().reduce((s, i) => s + i.price * i.qty, 0);
  function add(item) {
    const cart = load();
    const key = item.id + "|" + (item.config || "");
    const f = cart.find((x) => x.key === key);
    if (f) f.qty += item.qty || 1;
    else cart.push({ key, id: item.id, name: item.name, config: item.config || "Standard", price: item.price, img: item.img, qty: item.qty || 1 });
    save(cart); render();
  }
  function updateQty(key, qty) { save(load().map((i) => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); render(); if (window.renderCart) window.renderCart(); }
  function remove(key) { save(load().filter((i) => i.key !== key)); render(); if (window.renderCart) window.renderCart(); }
  function clear() { save([]); render(); }
  function openD() { document.getElementById("shade")?.classList.add("on"); document.getElementById("drawer")?.classList.add("on"); }
  function closeD() { document.getElementById("shade")?.classList.remove("on"); document.getElementById("drawer")?.classList.remove("on"); }
  function render() {
    document.querySelectorAll("[data-count]").forEach((e) => e.textContent = count());
    const b = document.getElementById("db");
    if (b) {
      const c = load();
      b.innerHTML = c.length ? c.map((i) => `<div style="display:grid;grid-template-columns:64px 1fr auto;gap:8px;margin-bottom:12px"><img src="${i.img}" style="width:64px;height:48px;object-fit:cover" alt=""><div><strong>${i.name}</strong><div>${i.config}</div>${money(i.price)} × ${i.qty}</div><button class="out" style="color:var(--navy);border-color:var(--line)" data-rm="${i.key}">x</button></div>`).join("") : "<p>No requisitions.</p>";
      b.querySelectorAll("[data-rm]").forEach((x) => x.onclick = () => remove(x.dataset.rm));
    }
    const t = document.getElementById("dt");
    if (t) t.textContent = money(total());
  }
  window.BX = { PRODUCTS, load, add, updateQty, remove, clear, money, count, total, openD, closeD, render };
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("menu")?.addEventListener("click", () => document.getElementById("nav")?.classList.toggle("open"));
    document.querySelectorAll("[data-bag]").forEach((b) => b.onclick = openD);
    document.getElementById("shade")?.addEventListener("click", closeD);
    document.getElementById("dclose")?.addEventListener("click", closeD);
    document.querySelectorAll("[data-add]").forEach((btn) => {
      btn.onclick = () => {
        const p = PRODUCTS[btn.dataset.add];
        add({ id: p.id, name: p.name, price: p.base, img: p.img, qty: 1, config: "Standard" });
        openD();
      };
    });
  });
})();
