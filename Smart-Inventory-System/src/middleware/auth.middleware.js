const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    token = req.headers.authorization.split(" ")[1];

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      next();

    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }

  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;