const express = require("express");
const router = express.Router();
const { purchaseMask } = require("../controllers/purchaseController");

// 用戶購買口罩
router.post("/purchase", purchaseMask);

module.exports = router;
