// router.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/users/userController");
const productController = require("../controller/admin/productController");
const adminproductController = require("../controller/admin/adminproductController");
const orderController = require("../controller/users/orderController");
const cartController = require("../controller/users/cartController");
const upload = require("../config/upload"); 
const authenticate = require("../middleware/authenticate"); 
const profileController = require("../controller/users/profileController");

// Define routes
router.get("/verify-email", userController.verifyEmail);
router.post("/register", userController.registrationHandler); 
router.post("/login", userController.loginHandler); // Handle login

// Profile routes
router.get("/profile", profileController.getProfile);
router.put("/profile", profileController.updateProfile);

// Route to fetch all products
router.post("/adminproducts", adminproductController.addProduct);

// Route to add a product with image upload
router.post(
  "/add-product",
  upload.single("image"),
  productController.addProduct
);

// Route to fetch all products
router.get("/products", productController.getAllProducts);

// Route to reduce stock after an order is placed
router.post("/admin/reduce-stock", productController.reduceStock);

router.post('/cart/add', cartController.addToCart);
// Get all cart items
router.get('/cart', cartController.getCartItems);

// Update item quantity
router.put('/cart/update-quantity', cartController.updateCartQuantity);

// Remove item from cart
router.delete('/cart/remove', cartController.removeFromCart);

// Clear entire cart
router.delete('/cart/clear', cartController.clearCart);

// Order routes - protected by authentication
router.post("/orders", authenticate, orderController.placeOrder);
router.get("/orders/history", authenticate, orderController.getOrderHistory);
router.get("/orders/:orderId", authenticate, orderController.getOrderDetails);

router.get("/check-session", (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ 
      loggedIn: true,
      role: req.session.role,
      userId: req.session.userId 
    });
  } else {
    res.status(401).json({ 
      loggedIn: false,
      message: "Not authenticated" 
    });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).send({ message: "Logged out successfully" });
  });
});

module.exports = router; // Export the router for use in app.js
