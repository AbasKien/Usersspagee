<template>
  <div class="profile-container">
    <!-- Back Button -->
<button class="back-btn" @click="goBack">
  <i class="fas fa-arrow-left"></i> Back
</button>
    <div class="profile-wrapper">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <span class="avatar-text">{{ getInitials }}</span>
        </div>
        <h1>{{ user.fullname }}</h1>
        <p class="email">{{ user.email }}</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="profile-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'details' }]" 
          @click="activeTab = 'details'"
        >
          <i class="fas fa-user"></i> Profile Details
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'orders' }]" 
          @click="activeTab = 'orders'"
        >
          <i class="fas fa-shopping-bag"></i> Order History
        </button>
      </div>

      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Profile Details Tab -->
      <div v-if="activeTab === 'details' && !loading" class="profile-details">
        <form @submit.prevent="updateDetails" class="profile-form">
          <div class="form-group">
            <label for="fullname">Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              v-model="user.fullname" 
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="user.email" 
              readonly
              class="form-input readonly"
            />
            <small class="input-hint">Email cannot be modified</small>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="user.phone"
              class="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          <div class="form-group">
            <label for="address">Delivery Address</label>
            <textarea 
              id="address" 
              v-model="user.address"
              class="form-input textarea"
              placeholder="Enter your delivery address"
              rows="3"
            ></textarea>
          </div>

          <button type="submit" class="save-btn">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </form>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders' && !loading" class="orders-list">
        <div v-if="orders.length > 0">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <h3>Order #{{ order.id }}</h3>
              <span :class="['order-status', order.status]">{{ order.status }}</span>
            </div>
            <div class="order-details">
              <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
              <p><strong>Total:</strong> ₱{{ formatPrice(order.total) }}</p>
            </div>
            <button class="view-order-btn" @click="viewOrder(order.id)">
              View Details
            </button>
          </div>
        </div>
        <div v-else class="no-orders">
          <i class="fas fa-shopping-cart"></i>
          <p>No orders yet</p>
          <button class="shop-now-btn" @click="goToShop">Shop Now</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "details",
      user: {
        fullname: "",
        email: "",
        phone: "",
        address: "",
      },
      orders: [],
      loading: false,
      error: null
    };
  },

  computed: {
    getInitials() {
      return this.user.fullname
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    }
  },

  async mounted() {
    await this.fetchProfile();
    await this.fetchOrders();
  },

  methods: {
    goBack() {
      this.$router.push('/home');
    },

    async fetchProfile() {
      try {
        this.loading = true;
        const response = await fetch('http://localhost:5555/profile', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        if (data.success) {
          this.user = data.profile;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching profile:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateDetails() {
      try {
        this.loading = true;
        const response = await fetch('http://localhost:5555/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            phone: this.user.phone,
            address: this.user.address
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await response.json();
        if (data.success) {
          this.user = data.profile;
          this.showNotification('Profile updated successfully!');
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error updating profile:', error);
        this.showNotification('Failed to update profile', 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchOrders() {
      try {
        const response = await fetch('http://localhost:5555/orders', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            this.orders = data.orders;
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatPrice(price) {
      return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    },

    showNotification(message, type = 'success') {
      // You can implement a toast notification here
      alert(message);
    },

    viewOrder(orderId) {
      console.log('Viewing order:', orderId);
    },

    goToShop() {
      this.$router.push('/shop');
    }
  }
};
</script>

<style scoped>
/* Modern E-commerce Styling */
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 2rem;
  position: relative;
}

.profile-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.profile-header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #edf2f7;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.25);
}

.avatar-text {
  font-size: 2.5rem;
  color: white;
  font-weight: 600;
}

.profile-header h1 {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.email {
  color: #718096;
  font-size: 1.1rem;
}

.profile-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #edf2f7;
  padding-bottom: 1rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #718096;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: #667eea;
  background: #f7fafc;
}

.tab-btn.active {
  color: #667eea;
  background: #ebf4ff;
}

.tab-btn i {
  font-size: 1.1rem;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #edf2f7;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #2d3748;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-input.readonly {
  background: #f7fafc;
  cursor: not-allowed;
}

.input-hint {
  display: block;
  color: #718096;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.save-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
}

.orders-list {
  padding: 1rem;
}

.order-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
  transition: all 0.3s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-header h3 {
  color: #2d3748;
  font-weight: 600;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.order-status.pending {
  background: #fff8e1;
  color: #f59e0b;
}

.order-status.completed {
  background: #dcfce7;
  color: #22c55e;
}

.order-status.processing {
  background: #e0f2fe;
  color: #0ea5e9;
}

.order-details {
  margin: 1rem 0;
  color: #4a5568;
}

.order-details p {
  margin: 0.5rem 0;
}

.view-order-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f8fafc;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-order-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.no-orders {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.no-orders i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.shop-now-btn {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
}

.back-btn {
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #4a5568;
  border: 2px solid #edf2f7;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
  color: #667eea;
}

.back-btn i {
  font-size: 1rem;
}

/* Loading Spinner */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #edf2f7;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  color: #e53e3e;
  padding: 1rem;
  background: #fff5f5;
  border-radius: 8px;
  margin: 1rem 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-wrapper {
    padding: 1rem;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .avatar-text {
    font-size: 2rem;
  }

  .profile-header h1 {
    font-size: 1.5rem;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .back-btn {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>