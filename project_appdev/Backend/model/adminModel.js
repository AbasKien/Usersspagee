const db = require('../config/db'); // MySQL database connection

const adminModel = {
  // Add a product to the adminproducts table
  create: (data) => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO adminproducts (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [data.name, data.description, data.price, data.stock, data.image_url], (err, result) => {
        if (err) {
          console.error('Error inserting admin product:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = adminModel;
