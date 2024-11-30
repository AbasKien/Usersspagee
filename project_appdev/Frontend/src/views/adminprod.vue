<template>
    <div class="container-fluid d-flex">
      <!-- Sidebar -->
      <div class="sidebar bg-dark p-4 shadow">
        <h4 class="text-white mb-4">Admin Dashboard</h4>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to="/admin" class="nav-link text-white d-flex align-items-center">
              <i class="fas fa-home me-2"></i> Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/products" class="nav-link text-white d-flex align-items-center">
              <i class="fas fa-box me-2"></i> Products
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders" class="nav-link text-white d-flex align-items-center">
              <i class="fas fa-truck me-2"></i> Orders
            </router-link>
          </li>
          <li class="nav-item">
          </li>
          <li class="nav-item mt-3">
            <button @click="handleLogout" class="btn btn-danger w-100">
              <i class="fas fa-sign-out-alt me-2"></i> Logout
            </button>
          </li>
        </ul>
      </div>
  
      <!-- Main Content -->
      <div class="main-content flex-grow-1 bg-light p-4">
        <!-- Add Product Form -->
        <div class="card shadow-lg border-0 mb-4">
          <div class="card-body">
            <h3 class="card-title mb-4">Add New Product</h3>
            <form @submit.prevent="submitProduct">
              <div class="mb-3">
                <label for="name" class="form-label">Product Name:</label>
                <input type="text" v-model="name" class="form-control" id="name" placeholder="Enter product name" required />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description:</label>
                <textarea v-model="description" class="form-control" id="description" placeholder="Enter product description" required></textarea>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price:</label>
                <input type="number" v-model="price" class="form-control" id="price" placeholder="Enter product price" required />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock Quantity:</label>
                <input type="number" v-model="stock" class="form-control" id="stock" placeholder="Enter stock quantity" min="1" required />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Product Image:</label>
                <input ref="imageInput" type="file" @change="handleFileUpload" class="form-control" accept="image/*" id="image" required />
                <!-- Display image name and delete button if an image is selected -->
                <div v-if="imageFile" class="mt-2 d-flex justify-content-between align-items-center">
                  <span>{{ imageFile.name }}</span>
                  <button type="button" class="btn btn-danger btn-sm" @click="clearImage">X</button>
                </div>
              </div>
              <button type="submit" class="btn btn-success w-100 mt-3">
                <i class="fas fa-plus-circle me-2"></i> Add Product
              </button>
            </form>
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
      };
    },
    methods: {
      handleFileUpload(event) {
        this.imageFile = event.target.files[0];
        console.log('File selected:', this.imageFile);
      },
      clearImage() {
        this.imageFile = null;
        // Reset the file input element
        this.$refs.imageInput.value = '';
        console.log('Image cleared');
      },
      async submitProduct() {
        if (this.stock <= 0 || isNaN(this.stock)) {
          alert('Stock quantity must be a positive number.');
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
            this.resetForm();
          } else {
            alert('Failed to add product');
          }
        } catch (error) {
          console.error('Error adding product:', error);
          alert('There was an error adding the product.');
        }
      },
      async handleLogout() {
        try {
          console.log('Logging out...');
          await axios.post('http://localhost:5555/logout', {}, { withCredentials: true });
          localStorage.removeItem('userRole');
          this.$router.push('/login');
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
      resetForm() {
        this.name = '';
        this.description = '';
        this.price = '';
        this.stock = 1;
        this.imageFile = null;
        // Reset the file input element when the form resets
        this.$refs.imageInput.value = '';
        console.log('Form reset');
      }
    },
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
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar h4 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .nav-link {
    color: #ddd;
    padding: 10px 15px;
    border-radius: 4px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
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
    padding: 20px;
  }
  
  .card {
    border-radius: 10px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .form-control {
    margin-bottom: 15px;
  }
  
  .btn-success {
    background-color: #080808;
    border: none;
    padding: 10px;
    font-size: 1rem;
  }
  
  .btn-success:hover {
    background-color: #141515;
  }
  
  .btn-danger {
    background-color: #dc3545;
    border: none;
    padding: 10px;
    font-size: 1rem;
  }
  
  .btn-danger:hover {
    background-color: #c82333;
  }
  
  .shadow {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .shadow-lg {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .navbar {
    border-bottom: 1px solid #ddd;
  }
  </style>
  