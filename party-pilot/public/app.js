// ------- GLOBAL STATE -------
const state = {
  currentApp: "customer",
  currentUser: { name: "Priya Sharma", phone: "+91 9876543210" },
  currentPartner: null, // filled after fetch
  cart: [],
  packages: []
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// ------- INIT -------
document.addEventListener("DOMContentLoaded", async () => {
  bindNav();
  await loadPackages();
  await loadCustomerOrders();
  await loadPartnerBasics();
  await loadAdmin();
  setMinDeliveryDate();
});

// ------- NAV -------
function bindNav() {
  $$(".nav-switch").forEach(b => b.addEventListener("click", () => switchApp(b.dataset.app)));
  $$(".filter-btn").forEach(b => b.addEventListener("click", () => filterPackages(b.dataset.category)));
}

function switchApp(app) {
  state.currentApp = app;
  $$(".app-container").forEach(c => c.classList.remove("active"));
  $(`#${app}-app`).classList.add("active");
  $$(".nav-switch").forEach(b => b.classList.toggle("active", b.dataset.app === app));
}

// ------- PACKAGES -------
async function loadPackages() {
  const res = await fetch("/api/packages");
  state.packages = await res.json();
  renderPackages(state.packages);
}

function renderPackages(list) {
  const el = $("#packages-grid");
  el.innerHTML = list.map(p => `
    <div class="package-card">
      <div class="package-image" style="background-image:url('${p.image || ""}')"></div>
      <div class="package-content">
        <div class="package-header"><h3 class="package-title">${p.name}</h3><span class="package-price">₹${p.price}</span></div>
        <p class="package-description">${p.description || ""}</p>
        <div class="package-actions">
          <button class="btn btn--primary btn--sm" onclick="addToCart(${JSON.stringify(p._id).replace(/"/g,'&quot;')}, ${p.price}, '${p.name.replace(/'/g,"&#39;")}')"><i class="fas fa-plus"></i> Add to Cart</button>
          <button class="btn btn--outline btn--sm" onclick="toast('info','${p.name}','Setup: ${p.setup_time || '—'}')">View Details</button>
        </div>
      </div>
    </div>`).join("");
}

function filterPackages(cat) {
  $$(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.category === cat));
  if (cat === "all") return renderPackages(state.packages);
  renderPackages(state.packages.filter(p => p.category === cat));
}

// ------- CART -------
function addToCart(packageId, price, name) {
  state.cart = [{ packageId, price, name, quantity: 1 }];
  updateCartCount();
  toast("success", "Added to cart", name);
}
function updateCartCount() {
  $(".cart-count").textContent = state.cart.reduce((n, i) => n + i.quantity, 0);
}
function toggleCart() {
  const m = $("#cart-modal");
  if (m.classList.contains("hidden")) {
    const items = $("#cart-items");
    if (state.cart.length === 0) {
      items.innerHTML = `<div class="muted">Your cart is empty</div>`;
      $("#checkout-btn").disabled = true;
      $("#cart-total").textContent = "Total: ₹0";
    } else {
      const it = state.cart[0];
      items.innerHTML = `
        <div class="row"><div><b>${it.name}</b><div class="muted">Qty: ${it.quantity}</div></div><div>₹${it.price}</div></div>`;
      $("#checkout-btn").disabled = false;
      $("#cart-total").textContent = `Total: ₹${it.price * it.quantity}`;
    }
    m.classList.remove("hidden");
  } else m.classList.add("hidden");
}

function proceedToCheckout(){ toggleCart(); $("#checkout-modal").classList.remove("hidden"); }
function closeCheckout(){ $("#checkout-modal").classList.add("hidden"); }
function setMinDeliveryDate(){
  const el = $("#delivery-date"); if(!el) return;
  const d = new Date(); d.setDate(d.getDate()+1);
  el.min = d.toISOString().slice(0,10); el.value = el.min;
}

// ------- PLACE ORDER -------
async function placeOrder(){
  if(state.cart.length===0) return toast("error","Cart empty","Add a package");
  const date = $("#delivery-date").value;
  const time_slot = $("#time-slot").value;
  const address = $("#delivery-address").value.trim();
  const special_instructions = $("#special-instructions").value.trim();
  if(!date || !time_slot || !address) return toast("error","Fill all fields","Date, time, address");

  const it = state.cart[0];

  // find price and name (safety)
  const pkg = state.packages.find(p=>p._id===it.packageId) || {};
  const res = await fetch("/api/orders", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      customer_name: state.currentUser.name,
      phone: state.currentUser.phone,
      address,
      package_id: it.packageId,
      date, time_slot, special_instructions
    })
  });
  if(!res.ok){ toast("error","Error", "Could not place order"); return; }
  state.cart = []; updateCartCount(); closeCheckout();
  toast("success","Order placed","We’ll keep you posted");
  await loadCustomerOrders();
  await loadAdmin();
}

// ------- CUSTOMER ORDERS -------
async function loadCustomerOrders(){
  const res = await fetch(`/api/orders?customer_name=${encodeURIComponent(state.currentUser.name)}`);
  const orders = await res.json();
  const el = $("#customer-orders-list");
  if(orders.length===0) { el.innerHTML = `<div class="muted">No orders</div>`; return; }
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-header">
        <div><b>${o.package}</b> <span class="muted">(${o.date} • ${o.time_slot})</span></div>
        <span class="order-status ${o.status}">${o.status.toUpperCase()}</span>
      </div>
      <div class="muted">Deliver to: ${o.address}</div>
      <div>Total: ₹${o.price}</div>
      ${o.partner_assigned ? `<div class="muted">Partner: ${o.partner_assigned}</div>` : ``}
${o.status==="confirmed" ? `<button class="btn btn--outline btn--sm" onclick="cancelOrder('${o._id}')">Cancel Order</button>` : ``}

    </div>`).join("");
}

// ------- PARTNER -------
async function loadPartnerBasics(){
  // pick Ravi as current partner
  const res = await fetch("/api/partners");
  const list = await res.json();
  state.currentPartner = list.find(p=>p.name==="Ravi Kumar") || list[0];

  await loadAvailableOrders();
  await updatePartnerActiveDelivery();
}

async function loadAvailableOrders(){
  const res = await fetch("/api/orders/available/partner");
  const orders = await res.json();
  const el = $("#available-orders");
  el.innerHTML = orders.length ? orders.map(o => `
    <div class="order-card">
      <div class="order-header"><div><b>${o.package}</b></div><span class="order-status confirmed">NEW ORDER</span></div>
      <div class="muted">${o.customer_name} • ${o.date} • ${o.time_slot}</div>
      <div class="muted">₹${o.price} • ${o.address}</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="btn btn--primary" onclick="acceptOrder('${o._id}')"><i class="fas fa-check"></i> Accept</button>
        <button class="btn btn--outline" onclick="declineOrder('${o._id}')"><i class="fas fa-times"></i> Decline</button>
      </div>
    </div>`).join("") : `<div class="muted">No available orders</div>`;
}

async function acceptOrder(orderId){
  const res = await fetch(`/api/orders/${orderId}/accept`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ partner_id: state.currentPartner._id })
  });
  if(!res.ok){ toast("error","Failed","Could not accept order"); return; }
  toast("success","Accepted","Order assigned to you");
  await loadAvailableOrders();
  await updatePartnerActiveDelivery();
}

async function declineOrder(orderId){
  await fetch(`/api/orders/${orderId}/decline`, { method:"POST" });
  toast("info","Declined","Order declined");
}

async function updatePartnerActiveDelivery(){
  const res = await fetch(`/api/partners/${state.currentPartner._id}/active`);
  const data = await res.json();
  const box = $("#active-delivery");
  if(!data.active_order){ box.innerHTML = `<div class="muted">No active delivery</div>`; return; }
  const o = data.active_order;
  box.innerHTML = `
     <div class="order-card">
    <div class="order-header"><b>${o.package}</b><span class="order-status ${o.status}">${o.status.toUpperCase()}</span></div>
    <div class="muted">${o.address}</div>
    <div>₹${o.price} • ${o.date} • ${o.time_slot}</div>


       ${o.status==="accepted" ? `<button class="btn btn--primary" onclick="setOrderStatus('${o._id}','in_transit')">Start Delivery</button>`:""}
    ${o.status==="in_transit" ? `<button class="btn btn--primary" onclick="setOrderStatus('${o._id}','completed')">Complete Delivery</button>`:""}
    </div>`;
}

// ------- ADMIN -------
async function loadAdmin(){
  // Stats
  const s = await (await fetch("/api/admin/stats")).json();
  $("#admin-stats").innerHTML = `
    <div class="stat">Orders Today: <b>${s.total_orders_today}</b></div>
    <div class="stat">Revenue Today: <b>₹${s.total_revenue_today}</b></div>
    <div class="stat">Active Partners: <b>${s.active_partners}</b></div>
    <div class="stat">Total Customers: <b>${s.total_customers}</b></div>`;

  // Packages
  const pkgs = await (await fetch("/api/admin/packages")).json();
  $("#admin-packages-table").innerHTML = pkgs.map(p => `
    <div class="row"><div><b>${p.name}</b> <span class="muted">• ${p.category}</span></div><div>₹${p.price}</div><div class="muted">${p.setup_time || ""}</div></div>`).join("");

  // Orders
  const orders = await (await fetch("/api/admin/orders")).json();

 /* $("#admin-orders-table").innerHTML = orders.map(o => `
    <div class="row"><div><b>${o.package}</b> <span class="muted">by ${o.customer_name}</span></div><div>₹${o.price}</div><div><span class="order-status ${o.status}">${o.status}</span></div></div>`).join("");
*/
$("#admin-orders-table").innerHTML = orders.map(o => `
  <div class="row">
    <div><b>${o.package}</b> <span class="muted">by ${o.customer_name}</span></div>
    <div>₹${o.price}</div>
    <div><button class="btn btn--outline btn--sm" onclick="openStatusModal('${o._id}','${o.status}')">${o.status}</button></div>
  </div>`).join("");

  // Partners
  const partners = await (await fetch("/api/admin/partners")).json();
  $("#admin-partners-table").innerHTML = partners.map(p => `
    <div class="row"><div><b>${p.name}</b> <span class="muted">(${p.status})</span></div><div>⭐ ${p.rating}</div><div class="muted">${p.total_deliveries} deliveries</div></div>`).join("");
}

// ------- TOAST -------
let toastTimer;
function toast(type,title,msg){
  clearTimeout(toastTimer);
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<b>${title}</b><div class="muted">${msg||""}</div>`;
  document.body.appendChild(el);
  toastTimer = setTimeout(()=> el.remove(), 1800);
}

$("#add-package-btn").addEventListener("click", openAddPackage);
function openAddPackage(){ $("#add-package-modal").classList.remove("hidden"); }
function closeAddPackage(){ $("#add-package-modal").classList.add("hidden"); }

async function savePackage() {
  const body = {
    name: $("#pkg-name").value.trim(),
    category: $("#pkg-category").value,
    price: Number($("#pkg-price").value),
    image: $("#pkg-image").value,
    description: $("#pkg-desc").value,
    items: $("#pkg-items").value.split(",").map(i=>i.trim()),
    setup_time: $("#pkg-setup").value
  };
  const res = await fetch("/api/packages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  if(!res.ok) return toast("error","Failed","Could not save package");
  closeAddPackage();
  toast("success","Added","Package created");
  await loadAdmin();
}

async function cancelOrder(id) {
  await fetch(`/api/orders/${id}/status`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ status:"cancelled" })
  });
  toast("info","Cancelled","Order cancelled");
  loadCustomerOrders();
  loadAdmin();
}

async function setOrderStatus(orderId, status){
  await fetch(`/api/orders/${orderId}/status`, {
    method: "POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ status })
  });
  toast("success","Updated",`Order marked as ${status}`);
  await updatePartnerActiveDelivery();
  await loadAdmin();
}

let selectedOrderId = null;

function openStatusModal(id,current){
  selectedOrderId = id;
  $("#new-status").value = current;
  $("#status-modal").classList.remove("hidden");
}
function closeStatusModal(){ $("#status-modal").classList.add("hidden"); }

async function applyStatusChange(){
  const status = $("#new-status").value;
  await fetch(`/api/orders/${selectedOrderId}/status`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({status})
  });
  closeStatusModal();
  toast("success","Status Updated",status);
  loadAdmin();
}
