import { api } from '../api.js';
import { toast } from '../main.js';

function token(){ return localStorage.getItem('token'); }
if(!token()) location.href = '/login-customer.html';

const cart = [];

let userId = null;

// socket connect after /profile/me
(async function init() {
  try {
    const me = await api('/api/profile/me');
    const user = me.user ?? me;
    userId = user.id || user._id;
    connectOrdersSocket(userId);

    if (!user.profile || !user.profile.fullName) {
      show('profile');
    } else {
      loadPackages();
      loadOrders();
    }
  } catch (e) {
    show('profile');
  }
})();

async function loadPackages() {
  const { packages } = await api('/api/packages');
  const grid = document.getElementById('pkgGrid');
  grid.innerHTML = '';
  packages.forEach((p) => {
    const el = document.createElement('div');
    el.className = 'card feature';
    el.innerHTML = `<h3>${p.title} – ₹${p.price}</h3><p class="muted">${p.description || ''}</p>
      <button class="btn" data-id="${p._id}">Add to Cart</button>`;
    grid.appendChild(el);
  });
  grid.addEventListener('click', (e) => {
    const id = e.target?.dataset?.id;
    if (!id) return;
    const pkg = packages.find((x) => x._id === id);
    cart.push({ packageId: id, qty: 1, title: pkg.title, price: pkg.price });
    renderCart();
  });
}

function renderCart() {
  const list = document.getElementById('cartList');
  if (!cart.length) { list.textContent = 'Cart is empty.'; return; }
  list.innerHTML = cart.map((c, i) => `<div>#${i + 1} ${c.title} – ₹${c.price}</div>`).join('');
}

async function loadOrders() {
  show('orders');
  const { orders } = await api('/api/orders/my');
  const list = document.getElementById('orderList');
  if (!orders.length) { list.textContent = 'No orders yet.'; return; }

  list.innerHTML = orders.map(renderOrderCard).join('');
  list.addEventListener('click', async (e) => {
    const readyBtn = e.target.closest('[data-ready]');
    if (readyBtn) {
      const id = readyBtn.dataset.ready;
      await api(`/api/orders/${id}/status`, { method: 'POST', body: { status: 'ready_for_pickup' } });
      toast('Marked ready for pickup');
      loadOrders();
    }
  }, { once: true });
}

function renderOrderCard(o) {
  const flow = ['received','accepted','partner_reached','setup_complete','ready_for_pickup','picked_up'];
  const timeline = flow.map(s => `<span class="badge ${o.status===s?'state-active':''}">${s.replaceAll('_',' ')}</span>`).join(' ➜ ');

  const readyAllowed = o.status === 'setup_complete';
  return `<div class="card">
    <div class="flex" style="justify-content:space-between;">
      <div><strong>Order</strong> ${o._id}</div>
      <div>Paid ₹${o.payment.amountPaid} / ₹${o.payment.totalAmount}</div>
    </div>
    <div class="timeline">${timeline}</div>
    ${readyAllowed ? `<button class="btn small" data-ready="${o._id}" style="margin-top:10px;">Mark Ready for Pickup</button>` : ''}
  </div>`;
}


document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());
  await api('/api/profile/customer', { method: 'POST', body });
  toast('Profile saved');
});

async function checkout(payPercent) {
  if (!cart.length) return toast('Add items first', 'error');
  const { total } = await api('/api/cart/price', { method: 'POST', body: { items: cart } });
  await api('/api/payments/mock', { method: 'POST', body: { totalAmount: total, payPercent } });
  const { order } = await api('/api/orders', { method: 'POST', body: { items: cart, payPercent } });
  toast('Order placed!');
  cart.length = 0; renderCart(); loadOrders();
}

document.getElementById('pay25')?.addEventListener('click', () => checkout(25));
document.getElementById('pay100')?.addEventListener('click', () => checkout(100));

loadPackages();
renderCart();
loadOrders();
