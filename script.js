// --- FIREBASE INTEGRATION START ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ_G5o4otg7riemfJDMOcPoHoIVH7emsc",
  authDomain: "geobazarr.firebaseapp.com",
  databaseURL: "https://geobazarr-default-rtdb.firebaseio.com",
  projectId: "geobazarr",
  storageBucket: "geobazarr.appspot.com",
  messagingSenderId: "679949247383",
  appId: "1:679949247383:web:036d4f32038422ebb89ad2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// --- FIREBASE INTEGRATION END ---


document.addEventListener('DOMContentLoaded', () => {

    // --- Global State & Data ---
    let userId = null;
    let userDetails = { name: '', phone: '' };
    let cartItems = []; // In-memory array for cart state

    const productData = [
        { id: 1, name: "Pearl Jeera Masino Rice, 25kg Bag", unitPrice: 2950, stockQuantity: 50, stockUnit: 'bags', skuId: '#001A1001' },
        { id: 2, name: "Rijal Agro Vinegar, 700ml Case (12 Pcs)", unitPrice: 85 * 12, stockQuantity: 20, stockUnit: 'cases', skuId: '#002B1002' },
        { id: 3, name: "MAGGI 2-minute Noodles, Case (100 Pcs)", unitPrice: 65 * 100, stockQuantity: 15, stockUnit: 'cases', skuId: '#003D1003' },
        { id: 4, name: "Kellogg's Muesli Fruit Magic, 500g (Bulk)", unitPrice: 799, stockQuantity: 0, stockUnit: 'boxes', skuId: '#004A1004' },
        { id: 5, name: "Whisper Ultra Soft XL Pad, Carton (24 Packs)", unitPrice: 450 * 24, stockQuantity: 10, stockUnit: 'cartons', skuId: '#005E1005' },
        { id: 6, name: "Gyan Premium Lito, 400gm Box (10 Packs)", unitPrice: 320 * 10, stockQuantity: 35, stockUnit: 'boxes', skuId: '#006A1006' },
        { id: 7, name: "Ramro SugarFree Cake, 200gm (Box of 8)", unitPrice: 150 * 8, stockQuantity: 0, stockUnit: 'boxes', skuId: '#007D1007' },
        { id: 8, name: "Tong Garden Wasabi Peas, 400gm Jar", unitPrice: 410, stockQuantity: 45, stockUnit: 'jars', skuId: '#008D1008' },
        { id: 9, name: "Bhansaghar Long Grain Rice, 20Kg Bag", unitPrice: 2100, stockQuantity: 60, stockUnit: 'bags', skuId: '#009A1009' },
        { id: 10, name: "Rijal Agro Soya Sauce, 350gm Carton (12)", unitPrice: 70 * 12, stockQuantity: 22, stockUnit: 'cartons', skuId: '#010B1010' },
        { id: 11, name: "Dummy Scroll WHOLESALE Item 1", unitPrice: 1000, stockQuantity: 99, stockUnit: 'units', skuId: '#011Z1011' },
        { id: 12, name: "Dummy Scroll WHOLESALE Item 2", unitPrice: 2000, stockQuantity: 99, stockUnit: 'units', skuId: '#012Z1012' },
        { id: 13, name: "Dummy Scroll WHOLESALE Item 3", unitPrice: 3000, stockQuantity: 99, stockUnit: 'units', skuId: '#013Z1013' },
        { id: 14, name: "Dummy Scroll WHOLESALE Item 4", unitPrice: 4000, stockQuantity: 99, stockUnit: 'units', skuId: '#014Z1014' },
        { id: 15, name: "Dummy Scroll WHOLESALE Item 5", unitPrice: 5000, stockQuantity: 99, stockUnit: 'units', skuId: '#015Z1015' },
    ];

    const retailerProductData = [
        { id: 101, name: "Pearl Jeera Masino Rice, 1kg Bag", unitPrice: 160, stockQuantity: 150, stockUnit: 'kg', skuId: '#001A2001' },
        { id: 102, name: "Rijal Agro Vinegar, 700ml Bottle", unitPrice: 105, stockQuantity: 50, stockUnit: 'bottles', skuId: '#002B2002' },
        { id: 103, name: "MAGGI 2-minute Noodles, Single Pack", unitPrice: 35, stockQuantity: 500, stockUnit: 'packs', skuId: '#003D2003' },
        { id: 104, name: "Kellogg's Muesli Fruit Magic, 100g Pouch", unitPrice: 299, stockQuantity: 0, stockUnit: 'pouches', skuId: '#004A2004' },
        { id: 105, name: "Whisper Ultra Soft XL Pad, Single Pack", unitPrice: 550, stockQuantity: 100, stockUnit: 'packs', skuId: '#005E2005' },
        { id: 106, name: "Gyan Premium Lito, 400gm Single Pack", unitPrice: 400, stockQuantity: 75, stockUnit: 'packs', skuId: '#006A2006' },
        { id: 107, name: "Ramro SugarFree Cake, 200gm (Box of 8)", unitPrice: 150 * 8, stockQuantity: 0, stockUnit: 'pieces', skuId: '#007D2007' },
        { id: 108, name: "Tong Garden Wasabi Peas, 100gm Pouch", unitPrice: 180, stockQuantity: 80, stockUnit: 'pouches', skuId: '#008D2008' },
        { id: 109, name: "Bhansaghar Long Grain Rice, 5Kg Bag", unitPrice: 750, stockQuantity: 30, stockUnit: 'bags', skuId: '#009A2009' },
        { id: 110, name: "Rijal Agro Soya Sauce, 350gm Bottle", unitPrice: 95, stockQuantity: 60, stockUnit: 'bottles', skuId: '#010B2010' },
        { id: 111, name: "Dummy Scroll RETAIL Item 1", unitPrice: 120, stockQuantity: 99, stockUnit: 'units', skuId: '#011Z2011' },
        { id: 112, name: "Dummy Scroll RETAIL Item 2", unitPrice: 210, stockQuantity: 99, stockUnit: 'units', skuId: '#012Z2012' },
        { id: 113, name: "Dummy Scroll RETAIL Item 3", unitPrice: 350, stockQuantity: 99, stockUnit: 'units', skuId: '#013Z2013' },
        { id: 114, name: "Dummy Scroll RETAIL Item 4", unitPrice: 410, stockQuantity: 99, stockUnit: 'units', skuId: '#014Z2014' },
        { id: 115, name: "Dummy Scroll RETAIL Item 5", unitPrice: 550, stockQuantity: 99, stockUnit: 'units', skuId: '#015Z2015' },
    ];
    
    const allProducts = productData.concat(retailerProductData);
    
    let currentPage = 'home';
    let currentProductView = 'wholesale';
    let currentPaymentMethod = 'esewa';
    let currentProductSet = productData; 
    const DELIVERY_FEE = 150;

    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const appHeader = document.getElementById('app-header');
    const mainContent = document.getElementById('main-content');
    const bottomNavCategories = document.getElementById('bottom-nav-categories');
    const usernameInput = document.getElementById('username-input');
    const phoneInput = document.getElementById('phone-input');
    const saveDetailsBtn = document.getElementById('save-details-btn');
    
    const wholesaleMarketView = document.getElementById('wholesale-market-view');
    const latestProductsGrid = document.getElementById('latest-products-grid');
    const featuredProductsGrid = document.getElementById('featured-products-grid');
    const viewSelectorContainer = document.getElementById('view-selector-container');
    const viewSwitchBtns = document.querySelectorAll('.view-switch-btn');
    
    const cartCountElement = document.getElementById('cart-count');
    const bottomCartCountElement = document.getElementById('bottom-cart-count');
    
    const cartView = document.getElementById('cart-view');
    const trackingView = document.getElementById('tracking-view'); 
    const pastOrdersList = document.getElementById('past-orders-list');
    
    const paymentSwitchBtns = document.querySelectorAll('.payment-switch-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    
    // --- User and Data Persistence ---
    const initializeUser = async () => {
        let storedUserId = localStorage.getItem('geoBazarUserId');
        if (!storedUserId) {
            storedUserId = 'user_' + Date.now() + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('geoBazarUserId', storedUserId);
        }
        userId = storedUserId;

        const storedDetails = localStorage.getItem('geoBazarUserDetails');
        if (storedDetails) {
            userDetails = JSON.parse(storedDetails);
            usernameInput.value = userDetails.name;
            phoneInput.value = userDetails.phone;
        }
        
        await loadCartFromFirestore();
        if (userDetails.phone) {
            await loadOrdersFromFirestore();
        }
    };

    const saveUserDetails = () => {
        userDetails.name = usernameInput.value.trim();
        userDetails.phone = phoneInput.value.trim();
        if(userDetails.name && userDetails.phone) {
            localStorage.setItem('geoBazarUserDetails', JSON.stringify(userDetails));
            showTemporaryMessage('Details saved successfully!', 'success');
            closeSidebar();
        } else {
            showTemporaryMessage('Please fill in both name and phone.', 'warning');
        }
    };

    const loadCartFromFirestore = async () => {
        if (!userId) return;
        const cartDocRef = doc(db, "userCarts", userId);
        try {
            const docSnap = await getDoc(cartDocRef);
            if (docSnap.exists()) {
                cartItems = docSnap.data().items || [];
                updateCartCount();
            }
        } catch (error) {
            console.error("Error loading cart:", error);
        }
    };

    const saveCartToFirestore = async () => {
        if (!userId) return;
        const cartDocRef = doc(db, "userCarts", userId);
        try {
            await setDoc(cartDocRef, { items: cartItems });
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    };
    
    const loadOrdersFromFirestore = async () => {
        if (!userDetails.phone) return;
        pastOrdersList.innerHTML = `<div class="text-center text-gray-500 mt-8">Loading your past orders...</div>`;
        
        let allUserOrders = [];
        try {
            const ordersCollectionRef = collection(db, "orders");
            const dateDocsSnapshot = await getDocs(ordersCollectionRef);

            for (const dateDoc of dateDocsSnapshot.docs) {
                const userOrderRef = doc(db, "orders", dateDoc.id, "userOrders", userDetails.phone);
                const userOrderSnap = await getDoc(userOrderRef);
                if (userOrderSnap.exists()) {
                     allUserOrders.push(...userOrderSnap.data().orderList);
                }
            }
            renderOrders(allUserOrders);
        } catch (error) {
            console.error("Error loading orders:", error);
            pastOrdersList.innerHTML = `<div class="bg-red-800 p-4 rounded-xl text-center text-white font-medium">Could not load order history.</div>`;
        }
    };

    // --- Core Logic Functions ---
    const closeSidebar = () => { 
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
            document.body.classList.remove('menu-open');
            appHeader.classList.remove('main-blur');
            mainContent.classList.remove('main-blur');
            sidebarBackdrop.style.opacity = '0';
            sidebarBackdrop.style.pointerEvents = 'none'; 
            setTimeout(() => { sidebarBackdrop.style.display = 'none'; }, 300); 
            bottomNavCategories.classList.remove('text-green-400');
            bottomNavCategories.classList.add('text-gray-400');
        }
    }
    
    const switchProductView = (viewName) => {
        currentProductView = viewName;
        currentProductSet = (viewName === 'wholesale') ? productData : retailerProductData;
        viewSwitchBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === viewName) {
                btn.classList.add('bg-green-600', 'text-white', 'shadow-xl');
                btn.classList.remove('text-gray-300', 'hover:text-green-400');
            } else {
                btn.classList.remove('bg-green-600', 'text-white', 'shadow-xl');
                btn.classList.add('text-gray-300', 'hover:text-green-400');
            }
        });
        renderProducts(latestProductsGrid, currentProductSet.slice(0, 6), true); 
        renderProducts(featuredProductsGrid, currentProductSet.slice(4, 10));
    };
    
    const switchPaymentView = (paymentMethod) => {
        currentPaymentMethod = paymentMethod;
        paymentSwitchBtns.forEach(btn => {
            if (btn.getAttribute('data-payment') === paymentMethod) {
                btn.classList.add('bg-green-600', 'text-white', 'shadow-xl');
                btn.classList.remove('text-gray-300', 'hover:text-green-400');
            } else {
                btn.classList.remove('bg-green-600', 'text-white', 'shadow-xl');
                btn.classList.add('text-gray-300', 'hover:text-green-400');
            }
        });
        showTemporaryMessage(`Payment Selected: ${paymentMethod === 'esewa' ? 'eSewa' : 'Cash-On-Delivery'}`);
    };

    const navigateTo = (page) => {
        closeSidebar();
        currentPage = page;
        document.querySelectorAll('.page-view').forEach(view => view.style.display = 'none');
        viewSelectorContainer.style.display = (page === 'home') ? 'block' : 'none';
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-green-400');
            btn.classList.add('text-gray-400');
        });

        if (page === 'home') {
            wholesaleMarketView.style.display = 'block';
            switchProductView(currentProductView); 
            document.querySelector(`[data-page="home"]`).classList.add('text-green-400');
            document.querySelector(`[data-page="home"]`).classList.remove('text-gray-400');
        } else if (page === 'cart') {
            renderCartItems();
            switchPaymentView(currentPaymentMethod); 
            cartView.style.display = 'block';
            document.querySelector(`[data-page="cart"]`).classList.add('text-green-400');
            document.querySelector(`[data-page="cart"]`).classList.remove('text-gray-400');
        } else if (page === 'tracking') {
            loadOrdersFromFirestore();
            trackingView.style.display = 'block';
        } else if (page === 'account') {
            showTemporaryMessage("Account settings coming soon!");
        }
    };
    
    const calculateTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const total = cartItems.length > 0 ? subtotal + DELIVERY_FEE : 0;
        const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
        return { subtotal, total, deliveryFee };
    };

    const updateCartCount = () => {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalQuantity;
        bottomCartCountElement.textContent = totalQuantity;
        if (currentPage === 'cart') renderCartItems();
        else if (currentPage === 'home') switchProductView(currentProductView); 
    };

    const handleCartUpdate = (productId, action) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;
        const itemIndex = cartItems.findIndex(item => item.productId === productId);
        let successMessage = "";

        if (currentPage === 'home' && action === 'increment') {
            if (itemIndex > -1) {
                showTemporaryMessage(`${product.name.split(',')[0]} is already in cart.`, 'warning');
                return; 
            }
            cartItems.push({ productId, name: product.name, unitPrice: product.unitPrice, quantity: 1 });
            successMessage = `Added 1x of ${product.name.split(',')[0]} to cart!`;
        } 
        else if (currentPage === 'cart') {
            if (action === 'increment') {
                if (itemIndex > -1) {
                    cartItems[itemIndex].quantity++;
                    successMessage = `Increased ${product.name.split(',')[0]}`;
                }
            } else if (action === 'decrement') {
                if (itemIndex > -1) {
                    cartItems[itemIndex].quantity--;
                    if (cartItems[itemIndex].quantity <= 0) {
                        cartItems.splice(itemIndex, 1);
                        successMessage = `Removed ${product.name.split(',')[0]}.`;
                    } else {
                        successMessage = `Decreased ${product.name.split(',')[0]}`;
                    }
                }
            } else if (action === 'remove') {
                if (itemIndex > -1) {
                    cartItems.splice(itemIndex, 1);
                    successMessage = `Removed ${product.name.split(',')[0]}.`;
                }
            }
        } 
        
        updateCartCount();
        saveCartToFirestore();
        showTemporaryMessage(successMessage);
    };
    
    const renderCartControls = (productId, currentQuantity, isCartList = false) => {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return '';
        const isInStock = product.stockQuantity > 0;
        
        if (!isCartList) {
            if (!isInStock) return `<button class="w-full py-2 text-sm font-bold rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed" disabled>Sold Out</button>`;
            if (currentQuantity > 0) return `<button data-product-id="${productId}" data-action="view-cart" class="home-nav-btn w-full py-2 text-sm font-bold rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 transition duration-150 transform active:scale-95 shadow-md">View in Cart</button>`;
            return `<button data-product-id="${productId}" data-action="increment" class="cart-update-btn w-full py-2 text-sm font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-150 transform active:scale-95 shadow-md">Add to Cart</button>`;
        }
        
        const deleteButton = `<button data-product-id="${productId}" data-action="remove" class="cart-update-btn bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg ml-2 transition duration-150 transform active:scale-90 shadow-md flex items-center justify-center min-w-[36px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>`;
        return `<div class="flex items-center w-full justify-end"><div class="flex items-center bg-gray-700 rounded-lg p-0.5 shadow-inner flex-grow"><button data-product-id="${productId}" data-action="decrement" class="cart-update-btn text-white bg-red-500 hover:bg-red-600 p-2 rounded-l-lg transition duration-150 transform active:scale-90 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg></button><span class="text-white font-bold text-sm mx-2 flex-grow text-center min-w-[30px]">${currentQuantity}</span><button data-product-id="${productId}" data-action="increment" class="cart-update-btn text-white bg-green-500 hover:bg-green-600 p-2 rounded-r-lg transition duration-150 transform active:scale-90 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></button></div>${deleteButton}</div>`;
    };

    const createProductCard = (product, isCarousel = false) => {
        const cartItem = cartItems.find(item => item.productId === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const marketType = product.skuId.charAt(5); 
        const tagColor = marketType === '1' ? 'bg-blue-600' : 'bg-red-600'; 
        const carouselClasses = isCarousel ? 'w-[calc(50%-0.5rem)] flex-shrink-0 snap-start' : 'flex-grow';
        return `<div class="bg-gray-800 rounded-xl shadow-lg transition duration-300 overflow-hidden flex flex-col relative ${carouselClasses}"><span class="absolute top-2 left-2 text-xs font-bold text-white px-2 py-0.5 rounded-full ${tagColor} shadow-md">${product.skuId}</span><div class="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400 text-xs p-2"><span class="text-4xl text-green-400 font-extrabold">${product.name.split(' ')[0][0]}${product.name.split(' ')[1][0]}</span></div><div class="p-3 flex-grow flex flex-col justify-between"><div><h3 class="font-semibold text-gray-100 text-sm mb-1 line-clamp-2" title="${product.name}">${product.name}</h3><p class="text-xl font-bold text-green-400">NRs.${product.unitPrice.toLocaleString()}</p><div class="text-xs font-medium ${product.stockQuantity > 0 ? 'text-yellow-400' : 'text-red-500'} mb-3">Quantity: ${product.stockUnit}</div></div>${renderCartControls(product.id, currentQuantity, false)}</div></div>`;
    };

    const renderProducts = (element, products, isCarousel = false) => {
        element.innerHTML = products.map(product => createProductCard(product, isCarousel)).join('');
    };

    const renderCartItems = () => {
        const { subtotal, total, deliveryFee } = calculateTotals();
        document.getElementById('subtotal-amount').textContent = `NRs.${subtotal.toLocaleString()}`;
        document.getElementById('delivery-fee-amount').textContent = `NRs.${deliveryFee.toLocaleString()}`;
        document.getElementById('total-amount').textContent = `NRs.${total.toLocaleString()}`;
        const cartSummaryFooter = document.getElementById('cart-summary-footer');

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = `<div class="bg-gray-800 p-4 rounded-xl text-center text-gray-400 font-medium">Your cart is empty.</div>`;
            cartSummaryFooter.style.display = 'none';
            return;
        }
        cartSummaryFooter.style.display = 'block';
        cartItemsList.innerHTML = cartItems.map(item => {
            const lineTotal = item.unitPrice * item.quantity;
            return `<div class="bg-gray-800 p-3 rounded-xl shadow-lg flex items-start"><div class="flex-grow min-w-0 pr-3"><h4 class="font-bold text-gray-100 text-sm mb-1 line-clamp-2">${item.name}</h4><p class="text-xs text-gray-400">Unit Price: NRs.${item.unitPrice.toLocaleString()}</p><p class="text-sm font-semibold text-yellow-400 mt-1">Total: NRs.${lineTotal.toLocaleString()}</p></div><div class="flex-shrink-0 pt-1">${renderCartControls(item.productId, item.quantity, true)}</div></div>`;
        }).join('');
    };
    
    const renderOrders = (orders) => {
        if (!orders || orders.length === 0) {
            pastOrdersList.innerHTML = `<div class="bg-gray-800 p-4 rounded-xl text-center text-gray-400 font-medium">No past orders found.</div>`;
            return;
        }

        orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        pastOrdersList.innerHTML = orders.map(order => {
            const orderDate = new Date(order.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            return `
                <div class="bg-gray-800 p-4 rounded-2xl shadow-xl">
                    <div class="flex justify-between items-center mb-3 border-b border-gray-700 pb-3">
                        <div>
                            <h3 class="text-lg font-bold text-gray-100">${order.orderId}</h3>
                            <p class="text-xs text-gray-400">${orderDate}</p>
                        </div>
                        <span class="text-sm font-semibold text-green-400 bg-green-900 px-3 py-1 rounded-full">${order.status}</span>
                    </div>
                    <div class="space-y-2 mb-3">
                        ${order.items.map(item => `
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-300">${item.quantity} x ${item.name.split(',')[0]}</span>
                                <span class="text-gray-400">NRs.${(item.unitPrice * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t border-gray-700 pt-3 mt-3">
                        <div class="flex justify-between font-bold text-lg text-green-400">
                            <span>Total Paid:</span>
                            <span>NRs.${order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    // --- Event Listeners and Handlers ---
    const toggleSidebar = () => {
        sidebar.classList.toggle('-translate-x-full');
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        if (isOpen) {
            document.body.classList.add('menu-open');
            appHeader.classList.add('main-blur');
            mainContent.classList.add('main-blur');
            sidebarBackdrop.style.display = 'block'; 
            setTimeout(() => { 
                sidebarBackdrop.style.opacity = '1';
                sidebarBackdrop.style.pointerEvents = 'auto'; 
            }, 10); 
            bottomNavCategories.classList.remove('text-gray-400');
            bottomNavCategories.classList.add('text-green-400');
        } else {
            closeSidebar();
        }
    };
    menuToggle.addEventListener('click', toggleSidebar);
    bottomNavCategories.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);
    saveDetailsBtn.addEventListener('click', saveUserDetails);
    
    document.getElementById('track-order-header').addEventListener('click', () => navigateTo('tracking'));
    document.getElementById('cart-icon-header').addEventListener('click', () => navigateTo('cart'));
    
    viewSwitchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = btn.getAttribute('data-view');
            if (currentPage === 'home') switchProductView(view);
        });
    });

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            showTemporaryMessage("Your cart is empty!", 'warning');
            return;
        }
        if (!userDetails.phone || !userDetails.name) {
            showTemporaryMessage("Please save your Name and Phone No in the sidebar first!", 'error');
            toggleSidebar();
            return;
        }

        const checkoutButton = document.getElementById('checkout-button-cart');
        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Processing...';

        try {
            const { subtotal, total, deliveryFee } = calculateTotals();
            const newOrder = {
                orderId: `ORD-${Date.now()}`,
                userId: userId,
                userName: userDetails.name,
                status: "Placed",
                paymentMethod: currentPaymentMethod,
                subtotal, deliveryFee, total,
                timestamp: new Date().toISOString(),
                items: cartItems
            };
            
            const dateString = new Date().toISOString().split('T')[0];
            
            const dateDocRef = doc(db, "orders", dateString);
            await setDoc(dateDocRef, { lastUpdated: new Date().toISOString() }, { merge: true });

            const userOrderDocRef = doc(db, "orders", dateString, "userOrders", userDetails.phone);
            await setDoc(userOrderDocRef, { 
                orderList: arrayUnion(newOrder) 
            }, { merge: true });

            showTemporaryMessage("Order Placed Successfully", 'success');
            cartItems = [];
            await saveCartToFirestore();
            updateCartCount();
            navigateTo('home');
        } catch (error) {
            console.error("Error placing order: ", error);
            showTemporaryMessage("Failed to place order. Try again.", 'error');
        } finally {
            checkoutButton.disabled = false;
            checkoutButton.textContent = 'Proceed to Checkout';
        }
    };

    document.body.addEventListener('click', (e) => {
        const cartUpdateBtn = e.target.closest('.cart-update-btn');
        if (cartUpdateBtn) {
            const productId = parseInt(cartUpdateBtn.getAttribute('data-product-id'));
            const action = cartUpdateBtn.getAttribute('data-action');
            if ((currentPage === 'cart' && ['increment', 'decrement', 'remove'].includes(action)) || 
                (currentPage === 'home' && action === 'increment')) {
                handleCartUpdate(productId, action);
                return;
            }
        }
        
        if (e.target.closest('.home-nav-btn')?.getAttribute('data-action') === 'view-cart') {
            navigateTo('cart');
            return;
        }
        
        if (e.target.closest('.payment-switch-btn') && currentPage === 'cart') {
            switchPaymentView(e.target.closest('.payment-switch-btn').getAttribute('data-payment'));
        }

        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            const page = navBtn.getAttribute('data-page');
            if (['home', 'cart', 'account'].includes(page)) navigateTo(page);
            else showTemporaryMessage(`Feature for '${page}' is coming soon!`);
            return;
        }
        
        if (e.target.closest('#home-link-header')) {
            e.preventDefault();
            navigateTo('home');
            return;
        }
        
        if (e.target.id === 'checkout-button-cart') {
            handleCheckout();
            return;
        }
    });

    const showTemporaryMessage = (message, type = 'success') => {
        let msgBox = document.getElementById('temp-message-box');
        if (!msgBox) {
            msgBox = document.createElement('div');
            msgBox.id = 'temp-message-box';
            msgBox.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 p-3 rounded-full shadow-2xl z-50 transition-all duration-300 opacity-0 text-sm font-semibold whitespace-nowrap';
            document.body.appendChild(msgBox);
        }
        msgBox.textContent = message;
        msgBox.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 p-3 rounded-full shadow-2xl z-50 transition-all duration-300 opacity-0 text-sm font-semibold whitespace-nowrap';
        if (type === 'success') msgBox.classList.add('bg-gray-800', 'text-green-400');
        else if (type === 'error') msgBox.classList.add('bg-red-700', 'text-white');
        else if (type === 'warning') msgBox.classList.add('bg-yellow-600', 'text-gray-900');
        else msgBox.classList.add('bg-gray-800', 'text-white');
        
        msgBox.classList.remove('opacity-0', 'scale-90');
        msgBox.classList.add('opacity-100', 'scale-100');
        setTimeout(() => {
            msgBox.classList.remove('opacity-100', 'scale-100');
            msgBox.classList.add('opacity-0', 'scale-90');
        }, 2000);
    };

    // --- Initial Setup ---
    initializeUser().then(() => {
        navigateTo('home');
    });
});

