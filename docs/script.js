const STORAGE_KEY = 'pm_cart_final_v1';
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

const NUMERO_PIZZARIA = "5521983302435";

function currency(v){ 
    return 'R$ ' + Number(v).toFixed(2).replace('.',','); 
}

function save(){ 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); 
    renderCart(); 
    updateCounts(); 
}

/* 🔹 AGORA RECEBE IMG */
function addItem(id, name, price, img){
    if(!cart[id]) {
        cart[id] = {
            id,
            name,
            price: Number(price),
            qty: 0,
            img
        };
    }
    cart[id].qty += 1;
    save();
    openCart();
}

// Destacar link ativo
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const links = document.querySelectorAll(".mainnav a");

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (path.includes(href)) {
            link.classList.add("active");
        }
    });
});

function removeItem(id){ 
    delete cart[id]; 
    save(); 
}

function changeQty(id, delta){ 
    if(!cart[id]) return; 
    cart[id].qty += delta; 
    if(cart[id].qty <= 0) removeItem(id); 
    else save(); 
}

function cartTotal(){ 
    return Object.values(cart).reduce((s,it)=>s + it.price * it.qty, 0); 
}

function cartCount(){ 
    return Object.values(cart).reduce((s,it)=>s + it.qty, 0); 
}

function renderCart(){
    const el = document.getElementById('cartItems');
    if(!el) return;

    el.innerHTML = '';
    const items = Object.values(cart);

    if(items.length === 0){
        el.innerHTML = '<p style="padding:18px;color:#888">Seu carrinho está vazio.</p>';
    } else {
        items.forEach(it=>{
            const r = document.createElement('div'); 
            r.className = 'cart-row';
            r.innerHTML = `
                <img src="${it.img}" alt="${escapeHtml(it.name)}">
                <div style="flex:1">
                    <h5>${escapeHtml(it.name)}</h5>
                    <div style="color:#888">${currency(it.price)} cada</div>
                    <div class="qty-controls">
                        <button data-action="dec" data-id="${it.id}">-</button>
                        <div style="padding:0 10px;font-weight:800">${it.qty}</div>
                        <button data-action="inc" data-id="${it.id}">+</button>
                        <button data-action="rem" data-id="${it.id}" style="margin-left:8px;background:transparent;border:none;color:var(--red);font-weight:800;cursor:pointer">Remover</button>
                    </div>
                </div>
                <div style="font-weight:900">${currency(it.price * it.qty)}</div>`;
            el.appendChild(r);
        });
    }

    const totalEl = document.getElementById('cartTotal'); 
    if(totalEl) totalEl.textContent = currency(cartTotal());
}

function escapeHtml(s){ 
    return String(s).replace(/[&<>"']/g,m=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
    })[m]); 
}

function updateCounts(){ 
    document.querySelectorAll('.cart-count')
        .forEach(e=>e.textContent = cartCount()); 
}

// 🔥 PARTE MAIS IMPORTANTE
document.addEventListener('click', (ev)=>{
    const add = ev.target.closest('.add'); 
    if(add){ 
        const card = add.closest('.card');
        const imgEl = card?.querySelector('img');
        const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

        addItem(
            add.dataset.id,
            add.dataset.name,
            add.dataset.price,
            imgSrc
        );
        return; 
    }

    const btn = ev.target.closest('button[data-action]'); 
    if(btn){
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if(action==='dec') changeQty(id,-1); 
        else if(action==='inc') changeQty(id,1); 
        else if(action==='rem') removeItem(id);
        return;
    }

    if(ev.target.closest('#cartBtn')) openCart();
    if(ev.target.closest('#closeCart')) closeCart();

    if(ev.target.closest('#checkoutBtn')){
        ev.preventDefault();

        if(Object.keys(cart).length === 0){
            alert('Seu carrinho está vazio.');
            return;
        }

        let itensLista = Object.values(cart)
            .map(it => `${it.qty}x ${it.name}`)
            .join('\n');

        let totalFormatado = currency(cartTotal());

        let mensagem = 
`Olá, gostaria de pedir:
${itensLista}
Preço: ${totalFormatado}

Quais formas de pagamento? Cartão () Pix () Dinheiro ()`;

        let url = "https://wa.me/" + NUMERO_PIZZARIA + "?text=" + encodeURIComponent(mensagem);
        window.open(url, "_blank");

        cart = {};
        save();
        closeCart();
    }
});

function openCart(){ 
    const p = document.getElementById('cartPanel'); 
    if(p) p.classList.add('open'); 
}

function closeCart(){ 
    const p = document.getElementById('cartPanel'); 
    if(p) p.classList.remove('open'); 
}

window.addEventListener('load', ()=>{
    renderCart(); 
    updateCounts(); 
});
