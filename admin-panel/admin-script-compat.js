// Firebase Configuration using Compat SDK
// Project: delivery-eb503
// Region: europe-west1

const firebaseConfig = {
    apiKey: "AIzaSyAzd7H7osMun82EqK37UHjEn-dpX2JM2rI",
    authDomain: "delivery-eb503.firebaseapp.com",
    databaseURL: "https://delivery-eb503-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "delivery-eb503",
    storageBucket: "delivery-eb503.firebasestorage.app",
    messagingSenderId: "708037846990",
    appId: "1:708037846990:web:8e6824ccdece44b7eeed9f",
    measurementId: "G-8HXQB157V7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// State Management
let categoriesData = {};
let venuesData = {};
let productsData = {};
let currentEditingId = null;

const currentState = {
    view: 'categories', // 'categories', 'venues', 'products'
    selectedCategory: null, // { id, name }
    selectedVenue: null // { id, name }
};

// DOM Elements
const breadcrumbEl = document.getElementById('breadcrumb');
const sectionTitleEl = document.getElementById('sectionTitle');
const searchInputEl = document.getElementById('searchInput');
const addBtnEl = document.getElementById('addBtn');
const dataGridEl = document.getElementById('dataGrid');
const connectionStatus = document.getElementById('connectionStatus');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupConnectionMonitoring();
    setupEventListeners();
    loadData();
});

function setupConnectionMonitoring() {
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            connectionStatus.innerHTML = '<i data-lucide="wifi"></i><span>Connected</span>';
            connectionStatus.classList.add('connected');
        } else {
            connectionStatus.innerHTML = '<i data-lucide="wifi-off"></i><span>Disconnected</span>';
            connectionStatus.classList.remove('connected');
        }
        lucide.createIcons();
    });
}

function setupEventListeners() {
    // Search
    searchInputEl.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterGrid(searchTerm);
    });

    // Add Button
    addBtnEl.addEventListener('click', () => {
        if (currentState.view === 'categories') openCategoryModal();
        else if (currentState.view === 'venues') openVenueModal();
        else if (currentState.view === 'products') openProductModal();
    });

    // Forms
    document.getElementById('categoryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCategory();
    });

    document.getElementById('venueForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveVenue();
    });

    document.getElementById('productForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
}

function loadData() {
    // Load all data initially
    database.ref('deliveryApp/categories').on('value', (snapshot) => {
        categoriesData = snapshot.val() || {};
        if (currentState.view === 'categories') renderView();
    });

    database.ref('deliveryApp/venues').on('value', (snapshot) => {
        venuesData = snapshot.val() || {};
        if (currentState.view === 'venues') renderView();
        updateProductVenueSelect(); // Update venue dropdown for products
    });

    database.ref('deliveryApp/products').on('value', (snapshot) => {
        productsData = snapshot.val() || {};
        if (currentState.view === 'products') renderView();
    });

    // Initial render
    renderView();
}

// Navigation Logic
window.navigateTo = function (view, id = null, name = null) {
    if (view === 'categories') {
        currentState.view = 'categories';
        currentState.selectedCategory = null;
        currentState.selectedVenue = null;
    } else if (view === 'venues') {
        currentState.view = 'venues';
        if (id) currentState.selectedCategory = { id, name };
        currentState.selectedVenue = null;
    } else if (view === 'products') {
        currentState.view = 'products';
        if (id) currentState.selectedVenue = { id, name };
    }

    renderView();
};

function renderBreadcrumb() {
    let html = `
        <div class="breadcrumb-item ${currentState.view === 'categories' ? 'active' : ''}" 
             onclick="navigateTo('categories')">
            Categories
        </div>
    `;

    if (currentState.selectedCategory) {
        html += `
            <i data-lucide="chevron-right" class="breadcrumb-separator"></i>
            <div class="breadcrumb-item ${currentState.view === 'venues' ? 'active' : ''}"
                 onclick="navigateTo('venues', '${currentState.selectedCategory.id}', '${currentState.selectedCategory.name}')">
                ${currentState.selectedCategory.name}
            </div>
        `;
    }

    if (currentState.selectedVenue) {
        html += `
            <i data-lucide="chevron-right" class="breadcrumb-separator"></i>
            <div class="breadcrumb-item active">
                ${currentState.selectedVenue.name}
            </div>
        `;
    }

    breadcrumbEl.innerHTML = html;
    lucide.createIcons();
}

function renderView() {
    renderBreadcrumb();
    searchInputEl.value = ''; // Clear search on nav change

    if (currentState.view === 'categories') {
        sectionTitleEl.textContent = 'All Categories';
        searchInputEl.placeholder = 'Search categories...';
        renderCategories();
    } else if (currentState.view === 'venues') {
        sectionTitleEl.textContent = currentState.selectedCategory ? `${currentState.selectedCategory.name} Venues` : 'All Venues';
        searchInputEl.placeholder = 'Search venues...';
        renderVenues();
    } else if (currentState.view === 'products') {
        sectionTitleEl.textContent = currentState.selectedVenue ? `${currentState.selectedVenue.name} Menu` : 'All Products';
        searchInputEl.placeholder = 'Search products...';
        renderProducts();
    }
}

// ===== CATEGORIES =====
function renderCategories() {
    dataGridEl.innerHTML = '';

    if (Object.keys(categoriesData).length === 0) {
        dataGridEl.innerHTML = '<p class="empty-state">No categories found.</p>';
        return;
    }

    Object.entries(categoriesData).forEach(([id, category]) => {
        const card = document.createElement('div');
        card.className = 'card';

        // Card click for navigation
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                navigateTo('venues', id, category.name);
            }
        });

        card.innerHTML = `
            <div class="card-icon">${category.emoji || '📦'}</div>
            <h3 class="card-title">${category.name}</h3>
            <div class="card-info">
                <div class="card-info-item">
                    <i data-lucide="tag"></i>
                    <span>${id}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit">
                    <i data-lucide="edit"></i> Edit
                </button>
                <button class="btn btn-delete">
                    <i data-lucide="trash-2"></i> Delete
                </button>
            </div>
        `;

        // Attach button listeners
        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editCategory(id);
        });

        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCategory(id);
        });

        dataGridEl.appendChild(card);
    });
    lucide.createIcons();
}

window.openCategoryModal = function () {
    currentEditingId = null;
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModal').classList.add('active');
};

window.closeCategoryModal = function () {
    document.getElementById('categoryModal').classList.remove('active');
};

window.editCategory = function (id, event) {
    if (event) event.stopPropagation();
    currentEditingId = id;
    const category = categoriesData[id];
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('categoryEmoji').value = category.emoji;
    document.getElementById('categoryModal').classList.add('active');
};

async function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const id = currentEditingId || name.toLowerCase().replace(/\s+/g, '-');
    const icon = document.getElementById('categoryIcon').value.trim();
    const emoji = document.getElementById('categoryEmoji').value.trim();

    if (!name) {
        showToast('Category name is required', true);
        return;
    }

    try {
        await database.ref(`deliveryApp/categories/${id}`).set({ id, name, icon, emoji });
        showToast(currentEditingId ? 'Category updated!' : 'Category added!');
        closeCategoryModal();
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

window.deleteCategory = async function (id, event) {
    if (event) event.stopPropagation();
    if (!confirm('Delete this category?')) return;
    try {
        await database.ref(`deliveryApp/categories/${id}`).remove();
        showToast('Category deleted!');
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
};

// ===== VENUES =====
function renderVenues() {
    dataGridEl.innerHTML = '';

    // Filter venues by selected category if applicable
    const venues = Object.entries(venuesData).filter(([_, venue]) => {
        if (!currentState.selectedCategory) return true;

        // Support both old (numeric) and new (string) category ID structures
        // Old structure: category.id might be "0", "1", etc. and venue.categoryId might be "0", "1"
        // New structure: category.id is "cat_restaurant" and venue.categoryId is "cat_restaurant"
        const categoryMatch = venue.categoryId === currentState.selectedCategory.id;

        // Also check if tags array includes the category ID (for backward compatibility)
        const tagMatch = venue.categories && venue.categories.includes(currentState.selectedCategory.id);

        return categoryMatch || tagMatch;
    });

    if (venues.length === 0) {
        dataGridEl.innerHTML = '<p class="empty-state">No venues found in this category.</p>';
        return;
    }

    venues.forEach(([id, venue]) => {
        const card = document.createElement('div');
        card.className = 'card';

        // Card click for navigation
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                navigateTo('products', id, venue.name);
            }
        });

        card.innerHTML = `
            ${venue.image ? `<img src="${venue.image}" class="card-image" alt="${venue.name}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">` : ''}
            <h3 class="card-title">${venue.name}</h3>
            <div class="card-info">
                <div class="card-info-item">
                    <i data-lucide="star"></i>
                    <span>${venue.rating} • ${venue.deliveryTime}</span>
                </div>
                <div class="card-info-item">
                    <i data-lucide="dollar-sign"></i>
                    <span>${venue.priceRange}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit">
                    <i data-lucide="edit"></i> Edit
                </button>
                <button class="btn btn-delete">
                    <i data-lucide="trash-2"></i> Delete
                </button>
            </div>
        `;

        // Attach button listeners
        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editVenue(id);
        });

        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteVenue(id);
        });

        dataGridEl.appendChild(card);
    });
    lucide.createIcons();
}

window.openVenueModal = function () {
    currentEditingId = null;
    document.getElementById('venueModalTitle').textContent = 'Add Venue';
    document.getElementById('venueForm').reset();
    document.getElementById('venueId').value = '';

    // Populate General Category Dropdown
    const categorySelect = document.getElementById('venueCategoryId');
    categorySelect.innerHTML = '<option value="">Select General Category</option>';
    Object.values(categoriesData).forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.emoji} ${cat.name}`;
        if (currentState.selectedCategory && currentState.selectedCategory.id === cat.id) {
            option.selected = true;
        }
        categorySelect.appendChild(option);
    });

    document.getElementById('venueModal').classList.add('active');
};

window.closeVenueModal = function () {
    document.getElementById('venueModal').classList.remove('active');
};

window.editVenue = function (id, event) {
    if (event) event.stopPropagation();
    currentEditingId = id;
    const venue = venuesData[id];
    document.getElementById('venueModalTitle').textContent = 'Edit Venue';
    document.getElementById('venueId').value = id;
    document.getElementById('venueName').value = venue.name;
    document.getElementById('venueRating').value = venue.rating;
    document.getElementById('venueDeliveryTime').value = venue.deliveryTime;
    document.getElementById('venuePriceRange').value = venue.priceRange;
    document.getElementById('venueImage').value = venue.image;
    document.getElementById('venueWebsite').value = venue.website || '';
    document.getElementById('venueTags').value = venue.categories ? venue.categories.join(', ') : '';

    // Populate General Category Dropdown
    const categorySelect = document.getElementById('venueCategoryId');
    categorySelect.innerHTML = '<option value="">Select General Category</option>';
    Object.values(categoriesData).forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.emoji} ${cat.name}`;
        if (venue.categoryId === cat.id) {
            option.selected = true;
        }
        categorySelect.appendChild(option);
    });

    document.getElementById('venueModal').classList.add('active');
};

async function saveVenue() {
    const id = currentEditingId || Date.now().toString();
    const name = document.getElementById('venueName').value.trim();
    const categoryId = document.getElementById('venueCategoryId').value;
    const rating = parseFloat(document.getElementById('venueRating').value);
    const deliveryTime = document.getElementById('venueDeliveryTime').value.trim();
    const priceRange = document.getElementById('venuePriceRange').value;
    const image = document.getElementById('venueImage').value.trim();
    const website = document.getElementById('venueWebsite').value.trim();
    const tagsStr = document.getElementById('venueTags').value;

    if (!categoryId) {
        showToast('Please select a General Category', true);
        return;
    }

    const categories = tagsStr.split(',').map(t => t.trim()).filter(t => t);

    const venueData = { id, categoryId, name, rating, deliveryTime, priceRange, image, website, categories };

    try {
        await database.ref(`deliveryApp/venues/${id}`).set(venueData);
        showToast(currentEditingId ? 'Venue updated!' : 'Venue added!');
        closeVenueModal();
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

window.deleteVenue = async function (id, event) {
    if (event) event.stopPropagation();
    if (!confirm('Delete this venue? Products will also be deleted.')) return;
    try {
        await database.ref(`deliveryApp/venues/${id}`).remove();
        // Also delete associated products
        const productsToDelete = Object.entries(productsData).filter(([_, p]) => p.restaurantId === id);
        for (const [productId] of productsToDelete) {
            await database.ref(`deliveryApp/products/${productId}`).remove();
        }
        showToast('Venue deleted!');
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
};

// ===== PRODUCTS =====
function renderProducts() {
    dataGridEl.innerHTML = '';

    // Filter products by selected venue
    const products = Object.entries(productsData).filter(([_, product]) => {
        if (!currentState.selectedVenue) return true;
        return product.restaurantId === currentState.selectedVenue.id;
    });

    if (products.length === 0) {
        dataGridEl.innerHTML = '<p class="empty-state">No products found for this venue.</p>';
        return;
    }

    products.forEach(([id, product]) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${product.image ? `<img src="${product.image}" class="card-image" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">` : ''}
            <h3 class="card-title">${product.name}</h3>
            <div class="card-info">
                <div class="card-info-item">
                    <i data-lucide="dollar-sign"></i>
                    <span>$${product.price.toFixed(2)}</span>
                </div>
                <div class="card-info-item">
                    <i data-lucide="file-text"></i>
                    <span>${product.description}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-edit">
                    <i data-lucide="edit"></i> Edit
                </button>
                <button class="btn btn-delete">
                    <i data-lucide="trash-2"></i> Delete
                </button>
            </div>
        `;

        // Attach button listeners
        const editBtn = card.querySelector('.btn-edit');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editProduct(id);
        });

        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteProduct(id);
        });

        dataGridEl.appendChild(card);
    });
    lucide.createIcons();
}

function updateProductVenueSelect() {
    const select = document.getElementById('productVenueId');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Select a venue</option>';

    Object.values(venuesData).forEach(venue => {
        const option = document.createElement('option');
        option.value = venue.id;
        option.textContent = venue.name;
        select.appendChild(option);
    });

    // Restore or pre-select venue
    if (currentState.selectedVenue) {
        select.value = currentState.selectedVenue.id;
    } else if (currentValue) {
        select.value = currentValue;
    }
}

window.openProductModal = function () {
    currentEditingId = null;
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';

    updateProductVenueSelect();
    document.getElementById('productModal').classList.add('active');
};

window.closeProductModal = function () {
    document.getElementById('productModal').classList.remove('active');
};

window.editProduct = function (id) {
    currentEditingId = id;
    const product = productsData[id];
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;

    updateProductVenueSelect();
    document.getElementById('productVenueId').value = product.restaurantId;

    document.getElementById('productModal').classList.add('active');
};

async function saveProduct() {
    const id = currentEditingId || Date.now().toString();
    const restaurantId = document.getElementById('productVenueId').value;
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();

    if (!restaurantId) {
        showToast('Please select a venue', true);
        return;
    }

    const productData = { id, restaurantId, name, description, price, image };

    try {
        await database.ref(`deliveryApp/products/${id}`).set(productData);
        showToast(currentEditingId ? 'Product updated!' : 'Product added!');
        closeProductModal();
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
}

window.deleteProduct = async function (id) {
    if (!confirm('Delete this product?')) return;
    try {
        await database.ref(`deliveryApp/products/${id}`).remove();
        showToast('Product deleted!');
    } catch (error) {
        showToast('Error: ' + error.message, true);
    }
};

// Helper: Filter Grid
function filterGrid(term) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const title = card.querySelector('.card-title');
        if (title && title.textContent.toLowerCase().includes(term)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Helper: Toast
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    if (isError) toast.classList.add('error');
    else toast.classList.remove('error');
    toast.classList.add('show');
    lucide.createIcons();
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Global Logout
window.logout = function () {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    window.location.href = 'login.html';
};
