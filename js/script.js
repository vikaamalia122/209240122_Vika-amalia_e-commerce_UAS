
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
    return cell !== '' && cell != null;
}
function loadFileData(filename) {
    if (!gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON to filter blank rows
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });

            // Filter out blank rows (rows where all cells are empty, null, or undefined)
            var filteredData = jsonData.filter(row => row.some(filledCell));

            // Heuristic to find the header row
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= (filteredData[index + 1]?.filter(filledCell).length || 0)
            );

            // Fallback
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }

            // Convert filtered JSON back to CSV
            var csvSheet = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            var csv = XLSX.utils.sheet_to_csv(csvSheet, { header: 1 });

            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

// Untuk membuat menu-toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});


    // ambil data keranjang dari local storage saat halaman dimuat
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// update tampilan keranjang
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Harga: Rp ${item.price.toLocaleString()}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                <input type="text" value="${item.quantity}" readonly>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <p>Subtotal: Rp ${(item.price * item.quantity).toLocaleString()}</p>
            <button class="remove" onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = `Rp ${total.toLocaleString()}`;
    localStorage.setItem('cart', JSON.stringify(cart));
}
// tambahkan item kekeranjang
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartDisplay();
}
// hapus item dari keranjang
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}
// tampilkan bagian tertentu
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartDisplay();
    alert(`${name} ditambahkan ke keranjang!`);
}

document.addEventListener("DOMContentLoaded", updateCartDisplay);

function toggleDetail(button) { // untuk menyembunyikan detail produk
    const detail = button.nextElementSibling;
        console.log('Toggle untuk:', detail);

        if (!detail) {
        alert('Elemen detail tidak ditemukan!');
        return;
        }
         detail.classList.toggle('hidden');

         button.textContent = detail.classList.contains('hidden')
         ? 'Detail produk'
            : 'Sembunyikan Detail';
            }

// tampilkan bagian tertentu
function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        }

        // Inisialisasi tampilan saat halaman dimuat
        updateCartDisplay();






