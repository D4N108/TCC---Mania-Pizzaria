
const STORAGE_KEY = 'pm_cart_final_v1';
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

function currency(v){ return 'R$ ' + Number(v).toFixed(2).replace('.',','); }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); renderCart(); updateCounts(); }

function addItem(id, name, price){
  if(!cart[id]) cart[id] = {id,name,price: Number(price), qty:0};
  cart[id].qty += 1;
  save();
  openCart();
}
// Função para destacar o link ativo no cabeçalho
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname; // ex: /cardapio.html
  const links = document.querySelectorAll(".mainnav a");

  links.forEach(link => {
    const href = link.getAttribute("href"); // ex: cardapio.html
    if (path.includes(href)) {
      link.classList.add("active");
    }
  });
});


function removeItem(id){ delete cart[id]; save(); }

function changeQty(id, delta){ if(!cart[id]) return; cart[id].qty += delta; if(cart[id].qty<=0) removeItem(id); else save(); }

function cartTotal(){ return Object.values(cart).reduce((s,it)=>s + it.price*it.qty,0); }
function cartCount(){ return Object.values(cart).reduce((s,it)=>s + it.qty,0); }

// render cart
function renderCart(){
  const el = document.getElementById('cartItems');
  if(!el) return;
  el.innerHTML = '';
  const items = Object.values(cart);
  if(items.length === 0){ el.innerHTML = '<p style=\"padding:18px;color:#888\">Seu carrinho está vazio.</p>'; }
  else {
    items.forEach(it=>{
      const r = document.createElement('div'); r.className = 'cart-row';
      r.innerHTML = `<img src=\"${thumb(it.id)}\" alt=\"\"><div style=\"flex:1\"><h5>${escapeHtml(it.name)}</h5><div style=\"color:#888\">${currency(it.price)} cada</div><div class=\"qty-controls\"><button data-action=\"dec\" data-id=\"${it.id}\">-</button><div style=\"padding:0 10px;font-weight:800\">${it.qty}</div><button data-action=\"inc\" data-id=\"${it.id}\">+</button><button data-action=\"rem\" data-id=\"${it.id}\" style=\"margin-left:8px;background:transparent;border:none;color:var(--red);font-weight:800;cursor:pointer\">Remover</button></div></div><div style=\"font-weight:900\">${currency(it.price*it.qty)}</div>`;
      el.appendChild(r);
    });
  }
  const totalEl = document.getElementById('cartTotal'); if(totalEl) totalEl.textContent = currency(cartTotal());
}
function thumb(id){ const map = {combo1:'https://images.unsplash.com/photo-1601924582971-d69f1d6a5e8c?auto=format&fit=crop&w=600&q=60', combo2:'https://images.unsplash.com/photo-1548365328-8d1fdd1f1e20?auto=format&fit=crop&w=600&q=60', combo3:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=60'}; return map[id]||'https://images.unsplash.com/photo-1601924582971-d69f1d6a5e8c?auto=format&fit=crop&w=600&q=60'; }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }
function updateCounts(){ document.querySelectorAll('.cart-count').forEach(e=>e.textContent = cartCount()); const f = document.getElementById('floatCount'); if(f) f.textContent = cartCount(); }

// handlers
document.addEventListener('click', (ev)=>{
  const add = ev.target.closest('.add'); if(add){ addItem(add.dataset.id, add.dataset.name, add.dataset.price); return; }
  const btn = ev.target.closest('button[data-action]'); if(btn){
    const action = btn.dataset.action, id = btn.dataset.id;
    if(action==='dec') changeQty(id,-1); else if(action==='inc') changeQty(id,1); else if(action==='rem') removeItem(id);
    return;
  }
  if(ev.target.matches('#cartBtn') || ev.target.closest('#cartBtn')) openCart();
  if(ev.target.matches('#closeCart') || ev.target.closest('#closeCart')) closeCart();
  if(ev.target.matches('#floatOrder')||ev.target.closest('#floatOrder')) openCart();
  if(ev.target.matches('#checkoutBtn')||ev.target.closest('#checkoutBtn')){
    if(Object.keys(cart).length===0){ alert('Seu carrinho está vazio.'); return; }
    alert('Simulação de checkout. Total: '+currency(cartTotal())); cart={}; save(); closeCart();
  }
});

function openCart(){ const p = document.getElementById('cartPanel'); if(p) p.classList.add('open'); save(); }
function closeCart(){ const p = document.getElementById('cartPanel'); if(p) p.classList.remove('open'); }

// smooth scroll for data-scroll anchors (works on same page)
document.querySelectorAll('[data-scroll]').forEach(a=> a.addEventListener('click',(e)=>{
  const sel = a.getAttribute('data-scroll'); if(!sel) return;
  const target = document.querySelector(sel); if(!target) return;
  e.preventDefault();
  const headerOffset = 88;
  const rect = target.getBoundingClientRect(); const scrollTop = window.pageYOffset || document.documentElement.scrollTop; const top = rect.top+scrollTop-headerOffset;
  window.scrollTo({top, behavior:'smooth'});
}));

// review submission (local simulation)
function submitReview(formId){
  const t = document.getElementById(formId); if(!t) return;
  const name = t.querySelector('[name=name]').value||'Anônimo'; const msg = t.querySelector('[name=msg]').value||'';
  if(!msg.trim()){ alert('Digite sua avaliação antes de enviar.'); return; }
  const reviews = JSON.parse(localStorage.getItem('pm_reviews')||'[]'); reviews.unshift({name, msg, date:new Date().toISOString()}); localStorage.setItem('pm_reviews', JSON.stringify(reviews));
  t.reset(); alert('Avaliação enviada. Obrigado!'); // optionally re-render reviews
}

// init on load
window.addEventListener('load', ()=>{ renderCart(); updateCounts(); });


