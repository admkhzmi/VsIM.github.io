// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBG7NKXDCcVM0vP68onItVmOwk6nfQxNxE",
    authDomain: "vsim-67c34.firebaseapp.com",
    databaseURL: "https://vsim-67c34-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vsim-67c34",
    storageBucket: "vsim-67c34.appspot.com",
    messagingSenderId: "972301337918",
    appId: "1:972301337918:web:6119454ebf84617b16586f",
    measurementId: "G-DWVHKKE016"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Reference to products in Firebase Database
const productRef = ref(db, 'products');

// Fetch and display product data
onValue(productRef, (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    for (const key in data) {
        const product = data[key];
        const row = `
            <tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td><a href="#">View</a></td>
                <td><button class="editBtn" data-id="${key}">Edit</button></td>
                <td><button class="deleteBtn" data-id="${key}">Delete</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    }

    // Add event listener for edit buttons
    document.querySelectorAll('.editBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            console.log('Edit Product:', productId);

            const newName = prompt("Enter new product name:");
            const newPrice = prompt("Enter new product price:");
            const newCategory = prompt("Enter new category:");

            if (newName && newPrice && newCategory) {
                // Update the product in Firebase
                update(ref(db, `products/${productId}`), {
                    name: newName,
                    price: newPrice,
                    category: newCategory
                }).then(() => {
                    console.log('Product updated successfully');
                }).catch((error) => {
                    console.error('Error updating product:', error);
                });
            }
        });
    });

    // Add event listener for delete buttons
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            console.log('Delete Product:', productId);

            // Remove the product from Firebase
            remove(ref(db, `products/${productId}`))
                .then(() => {
                    console.log('Product deleted successfully');
                })
                .catch((error) => {
                    console.error('Error deleting product:', error);
                });
        });
    });
});

// Add new item
document.getElementById('addNewItem').addEventListener('click', () => {
    const newProduct = {
        name: 'New Product',
        price: 'RM0.00',
        category: 'Category'
    };
    const newProductKey = push(ref(db, 'products')).key;
    set(ref(db, 'products/' + newProductKey), newProduct)
        .then(() => {
            console.log('New product added successfully');
        })
        .catch((error) => {
            console.error('Error adding product:', error);
        });
});
