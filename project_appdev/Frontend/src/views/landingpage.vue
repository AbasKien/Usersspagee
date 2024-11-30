<template>
    <div>
      <!-- Navigation Bar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-yellow">
        <div class="container">
          <a class="navbar-brand" href="#">Margatheo Store</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item" v-bind:class="{'animate-nav-item': isVisible}">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
      <!-- Hero Section with Background Image -->
      <section class="hero-section">
        <div class="hero-overlay"></div> <!-- Dark overlay for better text visibility -->
        <div class="container text-center">
          <h1 class="display-4 animate-hero-text">Welcome to Margatheo Store</h1>
          <p class="lead animate-hero-text">Everything you need for school, delivered right to your door way.</p>
          <a href="#about-us" class="btn btn-lg hero-btn animate-hero-btn">Learn More</a>
        </div>
      </section>
    
      <!-- About Us Section -->
      <section id="about-us" class="about-us-section animate-section">
        <div class="container">
          <h2 class="text-center mb-4">About Us</h2>
          <p>We are dedicated to providing the best and most affordable school supplies for students of all ages. Whether you're shopping for notebooks, pens, or backpacks, we have it all! Our mission is to make school shopping easy and convenient for every student, teacher, and parent.</p>
          <p>Founded with the goal of simplifying the back-to-school experience, we offer high-quality products at unbeatable prices. Our team is passionate about education, and we strive to ensure that every customer leaves satisfied with their purchase.</p>
        </div>
      </section>
    
      <!-- Contact Us Section -->
      <section id="contact-us" class="contact-us-section bg-light py-5 animate-section">
        <div class="container">
          <h2 class="text-center mb-4">Contact Us</h2>
          <p class="text-center">For inquiries, please contact us at: <strong>+639150232461</strong></p>
        </div>
      </section>
    
      <!-- Footer -->
      <footer class="bg-dark text-white py-4 text-center">
        <p>&copy; 2024 Margatheo Store. All Rights Reserved.</p>
      </footer>
    </div>
  </template>
    
  <script>
  export default {
    data() {
      return {
        isVisible: false
      };
    },
    mounted() {
      this.isVisible = true;
    }
  };
  </script>
    
    <style scoped>
   /* General Styles */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevents horizontal scrolling due to animations */
}

.navbar {
  margin-bottom: 0;
  background-color: #f4511e; /* Changed to #f4511e (orange) */
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.navbar .navbar-brand {
  font-weight: bold;
}

.navbar-nav .nav-link {
  font-size: 1rem;
  color: #333;
  opacity: 0;
  animation: fadeIn 2s forwards;
  animation-delay: 0.5s;
}

.navbar-nav .nav-link:hover {
  color: #f4511e; /* Changed to #f4511e (orange) for hover */
}

.hero-section {
  position: relative;
  background-image: url('https://images.squarespace-cdn.com/content/v1/5f6182e71ff7662e79acda1c/1621459969208-EFP0XF0EVA83V5EZ3QW7/School+Supplies.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 60vh;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0;
  opacity: 0;
  animation: fadeIn 2s forwards;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-section .container {
  z-index: 2;
}

.hero-section h1,
.hero-section p {
  opacity: 0;
  animation: slideIn 1s ease-out forwards;
}

.hero-section h1 {
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  animation-delay: 0.3s;
}

.hero-section .btn {
  background-color: #f4511e; /* Changed to #f4511e (orange) */
  color: white;
  font-size: 1.1rem;
  animation: fadeIn 2s forwards;
  animation-delay: 1s;
}

.hero-section .btn:hover {
  background-color: #d33d00; /* Darker shade of #f4511e */
}

.about-us-section {
  padding: 60px 0;
  opacity: 0;
  animation: fadeInUp 1s forwards;
  animation-delay: 1s;
}

.about-us-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.contact-us-section {
  padding: 60px 0;
  opacity: 0;
  animation: fadeInUp 1s forwards;
  animation-delay: 1.5s;
}

.contact-us-section p {
  font-size: 1.2rem;
  color: #333;
}

footer {
  background-color: #343a40;
  color: white;
}

/* Animation Styles */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-nav-item {
  animation: fadeIn 1s ease-in forwards;
}

.animate-hero-text {
  animation: slideIn 1s ease-out forwards;
}

.animate-hero-btn {
  animation: fadeIn 2s forwards;
}

.animate-section {
  animation: fadeInUp 1s forwards;
}

  </style>
  