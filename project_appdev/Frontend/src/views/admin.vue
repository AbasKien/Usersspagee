<template>
  <div class="container-fluid">
    <!-- Sidebar -->
    <div class="sidebar bg-dark p-4">
      <h4 class="text-white mb-4">Admin Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/admin" class="nav-link text-white">
            <i class="fas fa-home"></i> Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/products" class="nav-link text-white">
            <i class="fas fa-box"></i> Products
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/admin/orders" class="nav-link text-white">
            <i class="fas fa-truck"></i> Orders
          </router-link>
        </li>
        <li class="nav-item">
    
        </li>
        <li class="nav-item">
          <button @click="handleLogout" class="btn btn-danger w-100 mt-3">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <nav class="navbar navbar-expand-lg navbar-light bg-light p-3">
        <div class="container-fluid">
          <h2 class="navbar-brand">Admin Panel</h2>
        </div>
      </nav>

      <!-- Add Product Form -->
      <div class="content p-4">
        <h3 class="mb-4">Add Product</h3>
        <form @submit.prevent="submitProduct" class="product-form">
          <div class="form-group mb-3">
            <label for="name" class="form-label">Product Name:</label>
            <input type="text" v-model="name" class="form-control" id="name" placeholder="Enter product name" required />
          </div>
          <div class="form-group mb-3">
            <label for="description" class="form-label">Description:</label>
            <textarea v-model="description" class="form-control" id="description" placeholder="Enter product description" required></textarea>
          </div>
          <div class="form-group mb-3">
            <label for="price" class="form-label">Price:</label>
            <input type="number" v-model="price" class="form-control" id="price" placeholder="Enter product price" required />
          </div>
          <div class="form-group mb-3">
            <label for="stock" class="form-label">Stock Quantity:</label>
            <input type="number" v-model="stock" class="form-control" id="stock" placeholder="Enter stock quantity" min="1" required />
          </div>
          <div class="form-group mb-3">
            <label for="image" class="form-label">Product Image:</label>
            <input type="file" @change="handleFileUpload" class="form-control" accept="image/*" id="image" required />
          </div>
          <button type="submit" class="btn btn-success w-100">
            <i class="fas fa-plus-circle"></i> Add Product
          </button>
        </form>

        <!-- Display Added Products -->
        <h3 class="mt-5">Products List</h3>
        <div class="product-list">
          <div v-if="products.length === 0" class="alert alert-info">
            No products available.
          </div>
          <div v-for="product in products" :key="product.id" class="product-item mb-3 border rounded p-3">
            <h5>{{ product.name }}</h5>
            <p>{{ product.description }}</p>
            <p><strong>Price:</strong> ${{ product.price }}</p>
            <p><strong>Stock:</strong> {{ product.stock }}</p>
            <img :src="product.imageUrl" alt="Product Image" class="img-fluid mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      description: '',
      price: '',
      stock: 1,
      imageFile: null,
      products: [],
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    handleFileUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async submitProduct() {
      if (this.stock <= 0 || isNaN(this.stock)) {
        alert("Stock quantity must be a positive number.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('description', this.description);
        formData.append('price', this.price);
        formData.append('stock', this.stock);
        formData.append('image', this.imageFile);

        const response = await axios.post('http://localhost:5555/add-product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
          alert('Product added successfully!');
          this.name = '';
          this.description = '';
          this.price = '';
          this.stock = 1;
          this.imageFile = null;
          await this.fetchProducts();
        } else {
          alert('Failed to add product');
        }
      } catch (error) {
        console.error('Error adding product:', error);
        alert('There was an error adding the product.');
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5555/products');
        this.products = response.data.products;
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('There was an error fetching the products.');
      }
    },
    async handleLogout() {
      try {
        console.log('Logging out...');
        await axios.post('http://localhost:5555/logout', {}, { withCredentials: true });
        localStorage.removeItem('userRole');
        this.$router.push('/login');
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
  }
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #1a1a1a;
  color: #fff;
  height: 100%;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar h4 {
  font-size: 1.25rem;
}

.nav-link {
  color: #ddd;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #333;
}

.nav-link.active {
  background-color: #007bff;
  color: #fff;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  overflow-y: auto;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.content {
  padding: 20px;
  flex-grow: 1;
}

.form-group {
  margin-bottom: 15px;
}

.btn-success {
  background-color: #28a745;
  border: none;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
}

.product-list {
  margin-top: 20px;
}

.product-item {
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-item img {
  max-width: 100%;
  border-radius: 5px;
}
</style>
