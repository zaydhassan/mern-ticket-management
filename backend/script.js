const bcrypt = require("bcrypt");

const enteredPassword = "1234"; // Use the actual password you entered
const storedHash = "$2b$10$QYn2gl69M/iz437nME9HJO7hNiEFtHSkRSL1eJQRBY.d8tFuuq0ke"; // Your DB hash

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Password Match:", result); // Should print true if correct
  }
});
