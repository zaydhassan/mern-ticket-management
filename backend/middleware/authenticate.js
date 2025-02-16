const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SECRET_KEY = "your-secret-key";

module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, SECRET_KEY);

    // Fetch the correct user_id from DB
    const user = await User.findById(verified.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = { id: user.user_id }; // Store user_id in req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const SECRET_KEY = "your-secret-key";

// module.exports = async function (req, res, next) {
//   const authHeader = req.header("Authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Access Denied. No token provided." });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const verified = jwt.verify(token, SECRET_KEY);

//     // Fetch user details from database
//     const user = await User.findById(verified.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Attach user_id to req.user (this will be used as agent_id in tickets)
//     req.user = { user_id: user.user_id }; 

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid or expired token" });
//   }
// };
