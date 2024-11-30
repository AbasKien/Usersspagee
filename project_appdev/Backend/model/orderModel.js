const db = require('../config/db');

// Function to create an order in the database
const createOrder = (orderData, callback) => {
  const { user_id, contact_number, address, payment_method, total_price, items } = orderData;

  // Start a transaction
  db.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return callback(err, null);
      }

      // Insert the order
      const orderQuery = `
        INSERT INTO orders (user_id, contact_number, address, payment_method, total_price, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
      `;
      const orderValues = [user_id, contact_number, address, payment_method, total_price];

      connection.query(orderQuery, orderValues, (err, orderResult) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            callback(err, null);
          });
        }

        const orderId = orderResult.insertId;

        // Insert order items
        const itemsQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ?
        `;
        const itemsValues = items.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.price
        ]);

        connection.query(itemsQuery, [itemsValues], (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              callback(err, null);
            });
          }

          // Update product stock
          const updateStockPromises = items.map(item => {
            return new Promise((resolve, reject) => {
              const updateStockQuery = `
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ? AND stock >= ?
              `;
              connection.query(updateStockQuery, [item.quantity, item.product_id, item.quantity], (err, result) => {
                if (err) reject(err);
                else if (result.affectedRows === 0) {
                  reject(new Error(`Insufficient stock for product ID ${item.product_id}`));
                }
                else resolve();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => {
              // Commit transaction
              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(err, null);
                  });
                }
                connection.release();
                callback(null, orderId);
              });
            })
            .catch(err => {
              connection.rollback(() => {
                connection.release();
                callback(err, null);
              });
            });
        });
      });
    });
  });
};

// Function to get order history for a user
const getOrderHistory = (userId, callback) => {
  const query = `
    SELECT 
      o.id as order_id,
      o.contact_number,
      o.address,
      o.payment_method,
      o.total_price,
      o.status,
      o.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name,
          'product_image', p.image_url
        )
      ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  db.query(query, [userId], callback);
};

// Function to get order details
const getOrderDetails = (orderId, callback) => {
  const query = `
    SELECT 
      o.id as order_id,
      o.user_id,
      o.contact_number,
      o.address,
      o.payment_method,
      o.total_price,
      o.status,
      o.created_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name,
          'product_image', p.image_url
        )
      ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.id = ?
    GROUP BY o.id
  `;

  db.query(query, [orderId], callback);
};

module.exports = { 
  createOrder,
  getOrderHistory,
  getOrderDetails
};
