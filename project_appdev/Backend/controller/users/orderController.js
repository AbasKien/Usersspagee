const { createOrder, getOrderHistory, getOrderDetails } = require('../../model/orderModel');
const { clearCart } = require('../../model/cartModel');

const orderController = {
  // Place a new order
  placeOrder: async (req, res) => {
    const { contact_number, address, payment_method, total_price, items } = req.body;
    const user_id = req.user.id; // Assuming you have user info in req.user from auth middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Create the order in the database
    createOrder({ 
      user_id, 
      contact_number, 
      address, 
      payment_method, 
      total_price,
      items 
    }, async (err, orderId) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ 
          message: err.message || 'Failed to place order',
          error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        });
      }

      try {
        // Clear the user's cart after successful order
        await clearCart(user_id);

        // Respond with success message
        return res.status(200).json({
          message: 'Order placed successfully!',
          orderId,
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
        // Note: Order was still created successfully
        return res.status(200).json({
          message: 'Order placed successfully, but failed to clear cart',
          orderId,
        });
      }
    });
  },

  // Get order history for a user
  getOrderHistory: (req, res) => {
    const userId = req.user.id; // From auth middleware

    getOrderHistory(userId, (err, orders) => {
      if (err) {
        console.error('Error fetching order history:', err);
        return res.status(500).json({ message: 'Failed to fetch order history' });
      }

      return res.status(200).json(orders);
    });
  },

  // Get specific order details
  getOrderDetails: (req, res) => {
    const orderId = req.params.orderId;
    const userId = req.user.id; // From auth middleware

    getOrderDetails(orderId, (err, [order]) => {
      if (err) {
        console.error('Error fetching order details:', err);
        return res.status(500).json({ message: 'Failed to fetch order details' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Ensure user can only access their own orders
      if (order.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      return res.status(200).json(order);
    });
  }
};

module.exports = orderController;
