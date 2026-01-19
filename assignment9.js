const API_URL = "https://fakestoreapi.com/products";
    let products = [];

    const productList = document.getElementById("productList");
    const statusDiv = document.getElementById("status");

    /* ---------------- FETCH PRODUCTS ---------------- */
    async function fetchProducts() {
      try {
        statusDiv.innerHTML = '<div class="loading">Loading...</div>';

        const response = await fetch(API_URL);
        const data = await response.json();

        products = data;
        displayProducts(products);

        statusDiv.innerHTML = "";
      } catch (error) {
        statusDiv.innerHTML =
          '<div class="error">Failed to load products</div>';
      }
    }

    /* ---------------- DISPLAY PRODUCTS ---------------- */
    function displayProducts(productArray) {
      productList.innerHTML = "";

      productArray.forEach((product) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${product.image}" />
          <h4>${product.title}</h4>
          <p><b>₹ ${product.price}</b></p>
          <p>${product.category}</p>

          <div class="actions">
            <button onclick="editProduct(${product.id})">Edit</button>
            <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
          </div>
        `;

        productList.appendChild(card);
      });
    }

    /* ---------------- ADD / UPDATE ---------------- */
    async function submitProduct() {
      const id = document.getElementById("productId").value;

      const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
      };

      try {
        if (id) {
          // UPDATE
          await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });

          alert("Product updated successfully");
        } else {
          // CREATE
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });

          alert("Product added successfully");
        }

        clearForm();
        fetchProducts();
      } catch (error) {
        alert("Operation failed");
      }
    }

    /* ---------------- EDIT ---------------- */
    function editProduct(id) {
      const product = products.find((p) => p.id === id);

      document.getElementById("formTitle").innerText = "Edit Product";
      document.getElementById("productId").value = product.id;
      document.getElementById("title").value = product.title;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.category;
      document.getElementById("description").value = product.description;
      document.getElementById("image").value = product.image;
    }

    /* ---------------- DELETE ---------------- */
    async function deleteProduct(id) {
      if (!confirm("Are you sure?")) return;

      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        alert("Product deleted");
        fetchProducts();
      } catch (error) {
        alert("Delete failed");
      }
    }

    /* ---------------- SEARCH ---------------- */
    document
      .getElementById("searchInput")
      .addEventListener("input", function (e) {
        const value = e.target.value.toLowerCase();
        const filtered = products.filter((p) =>
          p.title.toLowerCase().includes(value)
        );
        displayProducts(filtered);
      });

    /* ---------------- CLEAR FORM ---------------- */
    function clearForm() {
      document.getElementById("formTitle").innerText = "Add Product";
      document.getElementById("productId").value = "";
      document.querySelectorAll("input, textarea").forEach((el) => (el.value = ""));
    }

    fetchProducts();