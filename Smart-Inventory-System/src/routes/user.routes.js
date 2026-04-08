const express = require("express");

const { getAllUsers } = require("../controllers/user.controller");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const router = express.Router();

router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllUsers
);

module.exports = router;