const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 定義 GET /api/users 路由，並連接到 `userController.getUsers`
router.get('/users', userController.getUsers);

module.exports = router;