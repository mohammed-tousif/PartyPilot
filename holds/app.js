// Application Data
let appData = {
  packages: [
    {
      id: 1,
      name: "Birthday Bash Basic",
      category: "Birthday",
      price: 999,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
      description: "Perfect starter package with colorful balloons, birthday banners, and basic decorations",
      items: ["20 Balloons", "Happy Birthday Banner", "Table Decoration", "Party Hats"],
      setup_time: "45 minutes",
      rating: 4.5
    },
    {
      id: 2,
      name: "Birthday Deluxe",
      category: "Birthday",
      price: 1499,
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400",
      description: "Premium birthday setup with balloons, backdrop, lighting and cake table",
      items: ["30 Balloons", "Photo Backdrop", "LED String Lights", "Cake Table Setup", "Party Props"],
      setup_time: "60 minutes",
      rating: 4.8
    },
    {
      id: 3,
      name: "Anniversary Romance",
      category: "Anniversary",
      price: 1299,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
      description: "Romantic anniversary setup with roses, candles, and elegant decorations",
      items: ["Rose Petals", "Scented Candles", "Romantic Backdrop", "Heart Balloons", "Photo Frame"],
      setup_time: "45 minutes",
      rating: 4.7
    },
    {
      id: 4,
      name: "Kids Theme Party",
      category: "Birthday",
      price: 1199,
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400",
      description: "Colorful kids theme party with cartoon decorations and fun elements",
      items: ["Theme Balloons", "Cartoon Banners", "Activity Props", "Colorful Streamers", "Party Favors"],
      setup_time: "50 minutes",
      rating: 4.6
    },
    {
      id: 5,
      name: "Surprise Party Special",
      category: "Surprise",
      price: 899,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
      description: "Quick surprise setup that creates maximum impact in minimum time",
      items: ["15 Balloons", "Surprise Banner", "Confetti", "Photo Props"],
      setup_time: "30 minutes",
      rating: 4.4
    }
  ],
  orders: [
    {
      id: "ORD001",
      customer_name: "Priya Sharma",
      package: "Birthday Deluxe",
      package_id: 2,
      address: "A-102, Green Park Society, HSR Layout, Bangalore - 560102",
      phone: "+91 9876543210",
      date: "2025-09-16",
      time_slot: "6:00 PM - 7:00 PM",
      status: "confirmed",
      price: 1499,
      partner_assigned: "Ravi Kumar",
      partner_id: 1,
      special_instructions: "Setup for 7-year-old, use cartoon theme",
      created_at: "2025-09-15T10:30:00Z"
    },
    {
      id: "ORD002",
      customer_name: "Amit Patel",
      package: "Anniversary Romance",
      package_id: 3,
      address: "301, Sunrise Apartments, Koramangala, Bangalore - 560095",
      phone: "+91 8765432109",
      date: "2025-09-17",
      time_slot: "7:00 PM - 8:00 PM",
      status: "in_transit",
      price: 1299,
      partner_assigned: "Sneha Singh",
      partner_id: 2,
      special_instructions: "Keep it very romantic, surprise for wife",
      created_at: "2025-09-15T14:15:00Z"
    }
  ],
  delivery_partners: [
    {
      id: 1,
      name: "Ravi Kumar",
      phone: "+91 9123456780",
      rating: 4.8,
      total_deliveries: 145,
      status: "active",
      current_location: "HSR Layout, Bangalore",
      earnings_today: 850,
      active_order: "ORD001"
    },
    {
      id: 2,
      name: "Sneha Singh",
      phone: "+91 9234567891",
      rating: 4.7,
      total_deliveries: 98,
      status: "active",
      current_location: "Koramangala, Bangalore",
      earnings_today: 1200,
      active_order: "ORD002"
    },
    {
      id: 3,
      name: "Arjun Reddy",
      phone: "+91 9345678902",
      rating: 4.9,
      total_deliveries: 201,
      status: "offline",
      current_location: "Electronic City, Bangalore",
      earnings_today: 0,
      active_order: null
    }
  ],
  admin_stats: {
    total_orders_today: 12,
    total_revenue_today: 15999,
    active_partners: 2,
    pending_orders: 3,
    completed_orders: 9,
    total_customers: 1250,
    growth_rate: 15.5
  },
  cart: [],
  currentUser: {
    name: "Priya Sharma",
    phone: "+91 9876543210",
    address: "A-102, Green Park Society, HSR Layout, Bangalore - 560102"
  },
  currentPartner: {
    id: 1,
    name: "Ravi Kumar"
  },
  currentPackage: null
};

// Application State
let currentApp = 'customer';
let currentView = {
  customer: 'browse',
  partner: 'orders',
  admin: 'dashboard'
};


// Persistence helpers
function saveState() {
  try {
    const state = {
      orders: appData.orders,
      packages: appData.packages,
      delivery_partners: appData.delivery_partners,
      admin_stats: appData.admin_stats,
      cart: appData.cart
    };
    localStorage.setItem('partyPilotState', JSON.stringify(state));
  } catch (e) { /* ignore quota errors */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem('partyPilotState');
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.orders) appData.orders = state.orders;
    if (state.packages) appData.packages = state.packages;
    if (state.delivery_partners) appData.delivery_partners = state.delivery_partners;
    if (state.admin_stats) appData.admin_stats = state.admin_stats;
    if (state.cart) appData.cart = state.cart;
  } catch (e) { /* ignore parse errors */ }
}
// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  loadState();
  initializeApp();
  loadCustomerPackages();
  loadCustomerOrders();
  loadPartnerOrders();
  loadAdminDashboard();
  loadAdminPackages();
  loadAdminOrders();
  loadAdminPartners();
  updateCartCount();
  setMinDeliveryDate();
});

// App Initialization
function initializeApp() {
  // App switching functionality
  const appSwitches = document.querySelectorAll('.nav-switch');
  appSwitches.forEach(button => {
    button.addEventListener('click', () => switchApp(button.dataset.app));
  });

  // Tab navigation for each app
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  // Category filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => filterPackages(btn.dataset.category));
  });
}

// Set minimum delivery date (tomorrow)

function setMinDeliveryDate() {
  const deliveryDateInput = document.getElementById('delivery-date');
  if (!deliveryDateInput) return;
  const dt = new Date();
  dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate() + 1);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth()+1).padStart(2,'0');
  const dd = String(dt.getDate()).padStart(2,'0');
  const localDate = `${yyyy}-${mm}-${dd}`;
  deliveryDateInput.min = localDate;
  if (!deliveryDateInput.value) {
    deliveryDateInput.value = localDate;
  }
}

// App Switching
function switchApp(appName) {
  // Update navigation
  document.querySelectorAll('.nav-switch').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-app="${appName}"]`).classList.add('active');

  // Switch app containers
  document.querySelectorAll('.app-container').forEach(container => {
    container.classList.remove('active');
  });
  document.getElementById(`${appName}-app`).classList.add('active');

  currentApp = appName;
  
  // Load app-specific data
  if (appName === 'partner') {
    loadPartnerOrders();
    updatePartnerActiveDelivery();
  } else if (appName === 'admin') {
    loadAdminDashboard();
  }
}

// View Switching within apps
function switchView(viewName) {
  const app = currentApp;
  
  // Update navigation
  document.querySelectorAll(`#${app}-app .nav-tab`).forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`#${app}-app [data-view="${viewName}"]`).classList.add('active');

  // Switch views
  document.querySelectorAll(`#${app}-app .${app}-view`).forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`${app}-${viewName}`).classList.add('active');

  currentView[app] = viewName;
}

// Customer App Functions
function loadCustomerPackages() {
  const packagesGrid = document.getElementById('packages-grid');
  if (!packagesGrid) return;

  packagesGrid.innerHTML = appData.packages.map(package => `
    <div class="package-card" onclick="showPackageDetails(${package.id})">
      <div class="package-image" style="background-image: url('${package.image}')">
        <div class="package-badge">${package.category}</div>
      </div>
      <div class="package-content">
        <div class="package-header">
          <h3 class="package-title">${package.name}</h3>
          <span class="package-price">₹${package.price}</span>
        </div>
        <p class="package-description">${package.description}</p>
        <div class="package-rating">
          <i class="fas fa-star"></i>
          <span>${package.rating}</span>
          <span class="setup-time">• ${package.setup_time}</span>
        </div>
        <div class="package-actions">
          <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); addToCartDirect(${package.id})">
            <i class="fas fa-plus"></i> Add to Cart
          </button>
          <button class="btn btn--outline btn--sm" onclick="event.stopPropagation(); showPackageDetails(${package.id})">
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPackages(category) {
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-category="${category}"]`).classList.add('active');

  // Filter packages
  const packages = category === 'all' ? appData.packages : appData.packages.filter(pkg => pkg.category === category);
  
  const packagesGrid = document.getElementById('packages-grid');
  packagesGrid.innerHTML = packages.map(package => `
    <div class="package-card" onclick="showPackageDetails(${package.id})">
      <div class="package-image" style="background-image: url('${package.image}')">
        <div class="package-badge">${package.category}</div>
      </div>
      <div class="package-content">
        <div class="package-header">
          <h3 class="package-title">${package.name}</h3>
          <span class="package-price">₹${package.price}</span>
        </div>
        <p class="package-description">${package.description}</p>
        <div class="package-rating">
          <i class="fas fa-star"></i>
          <span>${package.rating}</span>
          <span class="setup-time">• ${package.setup_time}</span>
        </div>
        <div class="package-actions">
          <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); addToCartDirect(${package.id})">
            <i class="fas fa-plus"></i> Add to Cart
          </button>
          <button class="btn btn--outline btn--sm" onclick="event.stopPropagation(); showPackageDetails(${package.id})">
            View Details
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function showPackageDetails(packageId) {
  const package = appData.packages.find(p => p.id === packageId);
  if (!package) return;

  appData.currentPackage = package;

  const modal = document.getElementById('package-modal');
  const title = document.getElementById('package-modal-title');
  const body = document.getElementById('package-modal-body');
  const addBtn = document.getElementById('add-to-cart-btn');

  title.textContent = package.name;
  addBtn.textContent = `Add to Cart - ₹${package.price}`;
  addBtn.onclick = () => addToCart();

  body.innerHTML = `
    <div class="package-detail-image" style="background-image: url('${package.image}')"></div>
    <div class="package-detail-header">
      <div>
        <h4>${package.name}</h4>
        <span class="package-badge">${package.category}</span>
      </div>
      <div class="package-detail-price">₹${package.price}</div>
    </div>
    <p>${package.description}</p>
    
    <div class="package-info-grid">
      <div class="package-info-item">
        <i class="fas fa-clock"></i>
        <span>Setup Time: ${package.setup_time}</span>
      </div>
      <div class="package-info-item">
        <i class="fas fa-star"></i>
        <span>Rating: ${package.rating}/5</span>
      </div>
    </div>

    <div class="package-items">
      <h4>What's Included:</h4>
      <div class="items-list">
        ${package.items.map(item => `<div class="item-tag">${item}</div>`).join('')}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closePackageModal() {
  document.getElementById('package-modal').classList.add('hidden');
}


function addToCartDirect(packageId) {
  const pkg = appData.packages.find(p => p.id === packageId);
  if (!pkg) return;
  // Enforce single-item cart for consistency with order model
  const existingItem = appData.cart.find(item => item.id === packageId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Replace cart with the selected package as a single line item
    appData.cart = [{
      id: packageId,
      name: pkg.name,
      price: pkg.price,
      quantity: 1
    }];
  }
  updateCartCount();
  showToast('success', 'Added to Cart', `${pkg.name} added to cart`);
  saveState();
}

function addToCart() {
  if (!appData.currentPackage) return;
  
  addToCartDirect(appData.currentPackage.id);
  closePackageModal();
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const totalItems = appData.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  const isHidden = modal.classList.contains('hidden');
  
  if (isHidden) {
    loadCartItems();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function loadCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (appData.cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    cartTotal.textContent = 'Total: ₹0';
    checkoutBtn.disabled = true;
    return;
  }

  cartItemsContainer.innerHTML = appData.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <div class="cart-item-price">₹${item.price * item.quantity}</div>
    </div>
  `).join('');

  const total = appData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `Total: ₹${total}`;
  checkoutBtn.disabled = false;
}

function proceedToCheckout() {
  toggleCart();
  setMinDeliveryDate(); // Ensure minimum date is set
  document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function placeOrder() {
  // Get form elements
  const deliveryDate = document.getElementById('delivery-date').value;
  const timeSlot = document.getElementById('time-slot').value;
  const address = document.getElementById('delivery-address').value;
  const specialInstructions = document.getElementById('special-instructions').value;

  // Validate required fields manually
  if (!deliveryDate) {
    showToast('error', 'Validation Error', 'Please select a delivery date');
    return;
  }
  
  if (!timeSlot) {
    showToast('error', 'Validation Error', 'Please select a time slot');
    return;
  }
  
  if (!address.trim()) {
    showToast('error', 'Validation Error', 'Please enter your delivery address');
    return;
  }

  // Validate date is not in the past
  const selectedDate = new Date(deliveryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showToast('error', 'Invalid Date', 'Delivery date cannot be in the past');
    return;
  }

  // Create new order
  const newOrder = {
    id: `ORD${String(appData.orders.length + 1).padStart(3, '0')}`,
    customer_name: appData.currentUser.name,
    package: appData.cart[0].name, // For simplicity, taking first item
    package_id: appData.cart[0].id,
    address: address.trim(),
    phone: appData.currentUser.phone,
    date: deliveryDate,
    time_slot: timeSlot,
    status: 'confirmed',
    price: appData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    partner_assigned: null,
    partner_id: null,
    special_instructions: specialInstructions.trim(),
    created_at: new Date().toISOString()
  };

  
  appData.cart = [];
  saveState();
  
  // Update stats
  appData.admin_stats.total_orders_today++;
  appData.admin_stats.total_revenue_today += newOrder.price;
  appData.admin_stats.pending_orders++;

  showLoading();
  setTimeout(() => {
    hideLoading();
    closeCheckout();
    updateCartCount();
    loadCustomerOrders();
    showToast('success', 'Order Placed', 'Your order has been placed successfully!');
    
    // Refresh other apps if they're viewing relevant data
    if (currentApp === 'admin') {
      loadAdminOrders();
      loadAdminDashboard();
    } else if (currentApp === 'partner') {
      loadPartnerOrders();
    }
  }, 2000);
}

function loadCustomerOrders() {
  const ordersList = document.getElementById('customer-orders-list');
  if (!ordersList) return;

  const customerOrders = appData.orders.filter(order => order.customer_name === appData.currentUser.name);

  if (customerOrders.length === 0) {
    ordersList.innerHTML = '<div class="empty-cart">No orders found</div>';
    return;
  }

  ordersList.innerHTML = customerOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">${order.id}</span>
        <span class="order-status ${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span>
      </div>
      <div class="order-details">
        <div class="order-detail">
          <label>Package</label>
          <span>${order.package}</span>
        </div>
        <div class="order-detail">
          <label>Date & Time</label>
          <span>${order.date} • ${order.time_slot}</span>
        </div>
        <div class="order-detail">
          <label>Address</label>
          <span>${order.address}</span>
        </div>
        <div class="order-detail">
          <label>Total Amount</label>
          <span>₹${order.price}</span>
        </div>
        ${order.partner_assigned ? `
          <div class="order-detail">
            <label>Delivery Partner</label>
            <span>${order.partner_assigned}</span>
          </div>
        ` : ''}
      </div>
      ${order.status === 'confirmed' ? `
        <div class="order-actions">
          <button class="btn btn--outline btn--sm">Track Order</button>
          <button class="btn btn--secondary btn--sm">Cancel Order</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// Partner App Functions
function loadPartnerOrders() {
  const ordersList = document.getElementById('available-orders');
  if (!ordersList) return;

  // Show orders that don't have assigned partners
  const availableOrders = appData.orders.filter(order => 
    !order.partner_assigned && order.status === 'confirmed'
  );

  if (availableOrders.length === 0) {
    ordersList.innerHTML = '<div class="empty-cart">No available orders</div>';
    return;
  }

  ordersList.innerHTML = availableOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">${order.id}</span>
        <span class="order-status ${order.status}">NEW ORDER</span>
      </div>
      <div class="order-details">
        <div class="order-detail">
          <label>Package</label>
          <span>${order.package}</span>
        </div>
        <div class="order-detail">
          <label>Customer</label>
          <span>${order.customer_name}</span>
        </div>
        <div class="order-detail">
          <label>Date & Time</label>
          <span>${order.date} • ${order.time_slot}</span>
        </div>
        <div class="order-detail">
          <label>Address</label>
          <span>${order.address}</span>
        </div>
        <div class="order-detail">
          <label>Amount</label>
          <span>₹${order.price}</span>
        </div>
        <div class="order-detail">
          <label>Estimated Earnings</label>
          <span>₹${Math.round(order.price * 0.15)}</span>
        </div>
      </div>
      <div class="order-actions">
        <button class="btn btn--primary" onclick="acceptOrder('${order.id}')">
          <i class="fas fa-check"></i> Accept Order
        </button>
        <button class="btn btn--secondary" onclick="declineOrder('${order.id}')">
          <i class="fas fa-times"></i> Decline
        </button>
      </div>
    </div>
  `).join('');
}

function acceptOrder(orderId) {
  const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  const partner = appData.delivery_partners.find(p => p.id === appData.currentPartner.id);
  
  order.partner_assigned = partner.name;
  order.partner_id = partner.id;
  order.status = 'accepted';
  partner.active_order = orderId;

  showLoading();
  setTimeout(() => {
    hideLoading();
    loadPartnerOrders();
    updatePartnerActiveDelivery();
    showToast('success', 'Order Accepted', `Order ${orderId} has been accepted!`);
    
    // Update admin view if active
    if (currentApp === 'admin') {
      loadAdminOrders();
    }
  }, 1500);
}

function declineOrder(orderId) {
  showToast('info', 'Order Declined', `Order ${orderId} has been declined.`);
  // In a real app, this would remove the order from this partner's available list
}

function updatePartnerActiveDelivery() {
  const activeDeliveryContainer = document.getElementById('active-delivery');
  if (!activeDeliveryContainer) return;

  const partner = appData.delivery_partners.find(p => p.id === appData.currentPartner.id);
  const activeOrder = appData.orders.find(o => o.id === partner.active_order);

  if (!activeOrder) {
    activeDeliveryContainer.innerHTML = '<div class="empty-cart">No active delivery</div>';
    return;
  }

  activeDeliveryContainer.innerHTML = `
    <div class="order-header">
      <span class="order-id">${activeOrder.id}</span>
      <span class="order-status ${activeOrder.status}">${activeOrder.status.replace('_', ' ').toUpperCase()}</span>
    </div>
    
    <div class="delivery-progress">
      <div class="progress-step ${getStepStatus(activeOrder.status, 'accepted')}">
        <div class="progress-icon"><i class="fas fa-check"></i></div>
        <div class="progress-label">Accepted</div>
      </div>
      <div class="progress-step ${getStepStatus(activeOrder.status, 'picked_up')}">
        <div class="progress-icon"><i class="fas fa-box"></i></div>
        <div class="progress-label">Picked Up</div>
      </div>
      <div class="progress-step ${getStepStatus(activeOrder.status, 'in_transit')}">
        <div class="progress-icon"><i class="fas fa-truck"></i></div>
        <div class="progress-label">In Transit</div>
      </div>
      <div class="progress-step ${getStepStatus(activeOrder.status, 'delivered')}">
        <div class="progress-icon"><i class="fas fa-home"></i></div>
        <div class="progress-label">Delivered</div>
      </div>
      <div class="progress-step ${getStepStatus(activeOrder.status, 'setup_complete')}">
        <div class="progress-icon"><i class="fas fa-star"></i></div>
        <div class="progress-label">Setup Complete</div>
      </div>
    </div>

    <div class="order-details">
      <div class="order-detail">
        <label>Customer</label>
        <span>${activeOrder.customer_name}</span>
      </div>
      <div class="order-detail">
        <label>Package</label>
        <span>${activeOrder.package}</span>
      </div>
      <div class="order-detail">
        <label>Address</label>
        <span>${activeOrder.address}</span>
      </div>
      <div class="order-detail">
        <label>Phone</label>
        <span>${activeOrder.phone}</span>
      </div>
      <div class="order-detail">
        <label>Time Slot</label>
        <span>${activeOrder.time_slot}</span>
      </div>
      ${activeOrder.special_instructions ? `
        <div class="order-detail">
          <label>Special Instructions</label>
          <span>${activeOrder.special_instructions}</span>
        </div>
      ` : ''}
    </div>

    <div class="order-actions">
      ${getNextActionButton(activeOrder.status, activeOrder.id)}
    </div>
  `;
}

function getStepStatus(currentStatus, stepStatus) {
  const statusOrder = ['accepted', 'picked_up', 'in_transit', 'delivered', 'setup_complete'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(stepStatus);
  
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return '';
}

function getNextActionButton(status, orderId) {
  switch (status) {
    case 'accepted':
      return `<button class="btn btn--primary" onclick="updateOrderStatus('${orderId}', 'picked_up')">
        <i class="fas fa-box"></i> Mark as Picked Up
      </button>`;
    case 'picked_up':
      return `<button class="btn btn--primary" onclick="updateOrderStatus('${orderId}', 'in_transit')">
        <i class="fas fa-truck"></i> Start Delivery
      </button>`;
    case 'in_transit':
      return `<button class="btn btn--primary" onclick="updateOrderStatus('${orderId}', 'delivered')">
        <i class="fas fa-home"></i> Mark as Delivered
      </button>`;
    case 'delivered':
      return `<button class="btn btn--primary" onclick="updateOrderStatus('${orderId}', 'setup_complete')">
        <i class="fas fa-star"></i> Setup Complete
      </button>`;
    case 'setup_complete':
      return `<button class="btn btn--success" disabled>
        <i class="fas fa-check"></i> Order Complete
      </button>`;
    default:
      return '';
  }
}

function updateOrderStatus(orderId, newStatus) {
  
  // persist before UI updates
  saveState();
const order = appData.orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  saveState();

  // Update partner earnings if order is completed
  if (newStatus === 'setup_complete') {
    const partner = appData.delivery_partners.find(p => p.id === appData.currentPartner.id);
    const earnings = Math.round(order.price * 0.15);
    partner.earnings_today += earnings;
    partner.total_deliveries += 1;
    partner.active_order = null;
    
    // Update admin stats
    appData.admin_stats.completed_orders++;
    appData.admin_stats.pending_orders = Math.max(0, appData.admin_stats.pending_orders - 1);
  }

  showLoading();
  setTimeout(() => {
    hideLoading();
    updatePartnerActiveDelivery();
    showToast('success', 'Status Updated', `Order status updated to ${newStatus.replace('_', ' ')}`);
    
    // Update other app views
    if (currentApp === 'admin') {
      loadAdminOrders();
      loadAdminDashboard();
    }
    loadCustomerOrders();
  }, 1500);
}

// Admin App Functions
function loadAdminDashboard() {
  // Stats are already loaded from appData.admin_stats
  // The HTML template handles the display
}

function loadAdminPackages() {
  const packagesTable = document.getElementById('admin-packages-table');
  if (!packagesTable) return;

  packagesTable.innerHTML = `
    <div class="table-header">
      <h3>All Packages</h3>
    </div>
    ${appData.packages.map(package => `
      <div class="table-row">
        <div class="order-details">
          <div class="order-detail">
            <label>Package Name</label>
            <span>${package.name}</span>
          </div>
          <div class="order-detail">
            <label>Category</label>
            <span>${package.category}</span>
          </div>
          <div class="order-detail">
            <label>Price</label>
            <span>₹${package.price}</span>
          </div>
          <div class="order-detail">
            <label>Rating</label>
            <span>${package.rating}/5</span>
          </div>
          <div class="order-detail">
            <label>Setup Time</label>
            <span>${package.setup_time}</span>
          </div>
        </div>
        <div class="order-actions">
          <button class="btn btn--outline btn--sm" onclick="editPackage(${package.id})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn--secondary btn--sm" onclick="deletePackage(${package.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('')}
  `;
}

function loadAdminOrders() {
  const ordersTable = document.getElementById('admin-orders-table');
  if (!ordersTable) return;

  ordersTable.innerHTML = `
    <div class="table-header">
      <h3>All Orders</h3>
    </div>
    ${appData.orders.map(order => `
      <div class="table-row">
        <div class="order-header">
          <span class="order-id">${order.id}</span>
          <span class="order-status ${order.status}">${order.status.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="order-details">
          <div class="order-detail">
            <label>Customer</label>
            <span>${order.customer_name}</span>
          </div>
          <div class="order-detail">
            <label>Package</label>
            <span>${order.package}</span>
          </div>
          <div class="order-detail">
            <label>Date & Time</label>
            <span>${order.date} • ${order.time_slot}</span>
          </div>
          <div class="order-detail">
            <label>Amount</label>
            <span>₹${order.price}</span>
          </div>
          <div class="order-detail">
            <label>Partner</label>
            <span>${order.partner_assigned || 'Not Assigned'}</span>
          </div>
        </div>
        <div class="order-actions">
          <button class="btn btn--outline btn--sm" onclick="viewOrderDetails('${order.id}')">
            <i class="fas fa-eye"></i> View
          </button>
          ${!order.partner_assigned ? `
            <button class="btn btn--primary btn--sm" onclick="assignPartner('${order.id}')">
              <i class="fas fa-user-plus"></i> Assign Partner
            </button>
          ` : ''}
        </div>
      </div>
    `).join('')}
  `;
}

function loadAdminPartners() {
  const partnersTable = document.getElementById('admin-partners-table');
  if (!partnersTable) return;

  partnersTable.innerHTML = `
    <div class="table-header">
      <h3>Delivery Partners</h3>
    </div>
    ${appData.delivery_partners.map(partner => `
      <div class="table-row">
        <div class="order-header">
          <span class="order-id">${partner.name}</span>
          <span class="order-status ${partner.status}">${partner.status.toUpperCase()}</span>
        </div>
        <div class="order-details">
          <div class="order-detail">
            <label>Phone</label>
            <span>${partner.phone}</span>
          </div>
          <div class="order-detail">
            <label>Rating</label>
            <span>${partner.rating}/5</span>
          </div>
          <div class="order-detail">
            <label>Total Deliveries</label>
            <span>${partner.total_deliveries}</span>
          </div>
          <div class="order-detail">
            <label>Today's Earnings</label>
            <span>₹${partner.earnings_today}</span>
          </div>
          <div class="order-detail">
            <label>Location</label>
            <span>${partner.current_location}</span>
          </div>
          <div class="order-detail">
            <label>Active Order</label>
            <span>${partner.active_order || 'None'}</span>
          </div>
        </div>
        <div class="order-actions">
          <button class="btn btn--outline btn--sm" onclick="viewPartnerDetails(${partner.id})">
            <i class="fas fa-eye"></i> View Details
          </button>
          <button class="btn btn--secondary btn--sm" onclick="togglePartnerStatus(${partner.id})">
            <i class="fas fa-power-off"></i> ${partner.status === 'active' ? 'Suspend' : 'Activate'}
          </button>
        </div>
      </div>
    `).join('')}
  `;
}

// Modal Functions
function openAddPackageModal() {
  document.getElementById('add-package-modal').classList.remove('hidden');
}

function closeAddPackageModal() {
  document.getElementById('add-package-modal').classList.add('hidden');
  document.getElementById('add-package-form').reset();
}

function addPackage() {
  const form = document.getElementById('add-package-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const newPackage = {
    id: Math.max(...appData.packages.map(p => p.id)) + 1,
    name: document.getElementById('package-name').value,
    category: document.getElementById('package-category').value,
    price: parseInt(document.getElementById('package-price').value),
    description: document.getElementById('package-description').value,
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400", // Default image
    items: ["Package Items"], // Simplified for demo
    setup_time: "45 minutes",
    rating: 4.5
  };

  appData.packages.push(newPackage);
  saveState();

  showLoading();
  setTimeout(() => {
    hideLoading();
    closeAddPackageModal();
    loadAdminPackages();
    loadCustomerPackages(); // Update customer view if active
    showToast('success', 'Package Added', `${newPackage.name} has been added successfully!`);
  }, 1500);
}

// Utility Functions
function editPackage(packageId) {
  showToast('info', 'Feature Coming Soon', 'Package editing will be available soon!');
}

function deletePackage(packageId) {
  if (confirm('Are you sure you want to delete this package?')) {
    appData.packages = appData.packages.filter(p => p.id !== packageId);
  saveState();
    loadAdminPackages();
    loadCustomerPackages();
    showToast('success', 'Package Deleted', 'Package has been deleted successfully!');
  }
}

function viewOrderDetails(orderId) {
  showToast('info', 'Feature Coming Soon', 'Detailed order view will be available soon!');
}

function assignPartner(orderId) {
  showToast('info', 'Feature Coming Soon', 'Manual partner assignment will be available soon!');
}

function viewPartnerDetails(partnerId) {
  showToast('info', 'Feature Coming Soon', 'Detailed partner view will be available soon!');
}

function togglePartnerStatus(partnerId) {
  const partner = appData.delivery_partners.find(p => p.id === partnerId);
  if (partner) {
    partner.status = partner.status === 'active' ? 'offline' : 'active';
  saveState();
    if (partner.status === 'active') {
      appData.admin_stats.active_partners++;
    } else {
      appData.admin_stats.active_partners = Math.max(0, appData.admin_stats.active_partners - 1);
    }
    
    saveState();
  loadAdminPartners();
    loadAdminDashboard();
    showToast('success', 'Status Updated', `Partner status updated to ${partner.status}`);
  }
}

function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

function showToast(type, title, message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle'
  };

  toast.innerHTML = `
    <i class="toast-icon ${iconMap[type]}"></i>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  // Remove toast after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 4000);
}

// Global ESC handler to close open modals without changing UI
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const modals = [
    document.getElementById('cart-modal'),
    document.getElementById('checkout-modal'),
    document.getElementById('package-details-modal'),
    document.getElementById('add-package-modal')
  ];
  let closed = false;
  modals.forEach(m => {
    if (m && !m.classList.contains('hidden')) {
      m.classList.add('hidden');
      closed = true;
    }
  });
  if (closed) {
    showToast('info', 'Closed', 'Dialog closed');
  }
});
