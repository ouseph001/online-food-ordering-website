
// Food menu data
const foods = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burger",
        price: 120,
        description: "Juicy burger with fresh vegetables and cheese.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 250,
        description: "Hot pizza loaded with delicious melted cheese.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Chicken Burger",
        category: "Burger",
        price: 160,
        description: "Crispy chicken patty with a special sauce.",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Fried Rice",
        category: "Rice",
        price: 150,
        description: "Delicious fried rice cooked with fresh ingredients.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 320,
        description: "Tasty pizza topped with cheese and pepperoni.",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Fresh Juice",
        category: "Drinks",
        price: 70,
        description: "Refreshing fruit juice served chilled.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=700&q=80"
    }
];

// Application data
let cart = [];
let selectedCategory = "All";
let toastTimer;

// Load saved order history from browser storage
let orders = JSON.parse(
    localStorage.getItem("foodieOrders") || "[]"
);

// Display the food menu
function displayFoods(items) {
    const grid = document.getElementById("food-grid");

    if (items.length === 0) {
        grid.innerHTML =
            '<p class="empty-message">No food items found.</p>';
        return;
    }

    grid.innerHTML = items.map(food => `
        <article class="food-card">
            <div class="food-image">
                <img
                    src="${food.image}"
                    alt="${food.name}"
                    loading="lazy"
                >
            </div>

            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>

                <div class="food-bottom">
                    <span class="price">₹${food.price}</span>

                    <button class="add-button"
                        onclick="addToCart(${food.id})">
                        + Add
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Add food to cart
function addToCart(foodId) {
    const food = foods.find(item => item.id === foodId);

    if (!food) return;

    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1
        });
    }

    updateCart();
    showToast(food.name + " added to cart!");
}

// Change food quantity
function changeQuantity(foodId, amount) {
    const item = cart.find(food => food.id === foodId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(food => food.id !== foodId);
    }

    updateCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = count;
    cartTotal.textContent = "₹" + total.toFixed(2);

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-message">Your cart is empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price * item.quantity}</p>

                <div class="quantity-controls">
                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                        aria-label="Decrease ${item.name} quantity">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                        aria-label="Increase ${item.name} quantity">
                        +
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Open and close shopping cart
function toggleCart() {
    document.getElementById("cart-overlay")
        .classList.toggle("show");
}

function closeCartOutside(event) {
    if (event.target.id === "cart-overlay") {
        document.getElementById("cart-overlay")
            .classList.remove("show");
    }
}

// Search food items
function searchFood() {
    const query = document.getElementById("search")
        .value.trim().toLowerCase();

    const filteredFoods = foods.filter(food => {
        const matchesSearch =
            food.name.toLowerCase().includes(query) ||
            food.category.toLowerCase().includes(query);

        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayFoods(filteredFoods);
}

// Filter by category
function filterFood(category, button) {
    selectedCategory = category;

    document.querySelectorAll(".category").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
    searchFood();
}

// Place an order
function checkout() {
    if (cart.length === 0) {
        showToast("Please add food to your cart first.");
        return;
    }

    const customerName = prompt("Enter your name:");

    if (customerName === null) return;

    if (customerName.trim() === "") {
        showToast("Please enter a valid name.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = {
        id: Date.now(),
        customer: customerName.trim(),
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total,
        date: new Date().toLocaleString(),
        status: "Order Placed"
    };

    orders.unshift(order);

    // Keep the latest 20 orders
    orders = orders.slice(0, 20);

    localStorage.setItem("foodieOrders", JSON.stringify(orders));

    cart = [];
    updateCart();
    displayOrders();

    document.getElementById("cart-overlay")
        .classList.remove("show");

    showToast("Order placed successfully!");

    document.getElementById("orders").scrollIntoView({
        behavior: "smooth"
    });
}

// Display order history
function displayOrders() {
    const history = document.getElementById("order-history");

    if (orders.length === 0) {
        history.innerHTML =
            '<p class="empty-message">No orders placed yet.</p>';
        return;
    }

    history.innerHTML = orders.map(order => {
        const itemSummary = order.items.map(item =>
            `${item.name} × ${item.quantity}`
        ).join(", ");

        return `
            <article class="order-card">
                <h3>Order #${order.id}</h3>

                <p><strong>Customer:</strong> ${escapeHTML(order.customer)}</p>

                <p><strong>Items:</strong> ${escapeHTML(itemSummary)}</p>

                <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>

                <p><strong>Date:</strong> ${escapeHTML(order.date)}</p>

                <span class="status">${order.status}</span>
            </article>
        `;
    }).join("");
}

// Escape text before displaying user-provided content as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Display notification
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Initialize the website
displayFoods(foods);
updateCart();
displayOrders();
```
