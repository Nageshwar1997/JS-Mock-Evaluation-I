// Initialize an empty array to store product data
let data = [];

// Define the base URL for fetching product data
let URL = `https://fakestoreapi.com/products`;

// Select the products grid container
let productsGrid = document.querySelector("#products-grid");

// Fetch categories and product data
fetchCategories(URL);
fetchData(URL);

// Function to fetch product data from the API
async function fetchData(URL) {
  try {
    let resp = await fetch(URL);
    data = await resp.json();
    // Display products after fetching data
    showProducts(data);
    return;
  } catch (error) {
    console.log(error);
  }
}

// Function to display products in the grid
function showProducts(arr) {
  // Clear existing products in the grid
  productsGrid.innerHTML = null;

  // Loop through the array of products and create HTML elements for each product
  arr.forEach((product) => {
    let productItem = document.createElement("div");
    productItem.className = "productItem";

    productItem.innerHTML = `
            <img src="${product.image}" />
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
        `;

    // Append product element to the products grid
    productsGrid.append(productItem);
  });
}

// Initialize an empty array to store categories
let categories = [];

// Select the category filter dropdown
let categoryFilter = document.getElementById("category-filter");

// Function to fetch categories from the API and populate the category filter dropdown
async function fetchCategories(URL) {
  try {
    let resp = await fetch(`${URL}/categories`);
    categories = await resp.json();
  } catch (error) {
    console.log(error);
  }

  // Populate the category filter dropdown with options
  categories.forEach((category) => {
    categoryFilter.innerHTML += `
          <option value="${category}">${category}</option>
      `;
  });
}

// Event listener for the category filter dropdown
let selectValue = document.getElementById("category-filter");
selectValue.addEventListener("change", (event) => {
  // Update the URL based on the selected category
  if (event.target.value == "all") {
    URL = `https://fakestoreapi.com/products`;
  } else {
    URL = `https://fakestoreapi.com/products/category/${event.target.value}`;
  }
  // Fetch data based on the updated URL
  fetchData(URL);
});

// Event listener for the sort by price dropdown
let selectSortByPrice = document.getElementById("sort-by");
selectSortByPrice.addEventListener("change", (event) => {
  let sortedProductsArr = [];
  if (event.target.value == "all") {
    // If "All" is selected, use the original data
    sortedProductsArr = data;
  } else {
    // Sort the data based on selected option
    sortedProductsArr = [...data].sort((a, b) => {
      if (event.target.value == "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
  // Display sorted products
  showProducts(sortedProductsArr);
});

// Event listener for the search input with debouncing
let searchInput = document.getElementById("search");
let timeoutId;
searchInput.addEventListener("input", (event) => {
  clearTimeout(timeoutId);
  let searchTerm = event.target.value.toLowerCase();

  // Set a timeout to execute search after a brief delay
  timeoutId = setTimeout(() => {
    let filteredProducts = data.filter((product) => {
      return product.title.toLowerCase().includes(searchTerm);
    });
    // Display filtered products
    showProducts(filteredProducts);
  }, 1500); // Adjust delay as needed
});
