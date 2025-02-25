const { PrismaClient } = require("@prisma/client");
const { purchaseMaskTransaction } = require("../models/purchaseModel");
const prisma = new PrismaClient();

/**
 * 用戶購買口罩
 * @param {Request} req
 * @param {Response} res
 */
const purchaseMask = async (req, res) => {
  const { userId, pharmacyId, maskId, quantity } = req.body;
  
  if (!userId || !pharmacyId || !maskId || !quantity) {
    return res.status(400).json({ error: "缺少必要參數" });
  }
  if (quantity <= 0) {
    return res.status(400).json({ error: "購買數量必須大於 0" });
  }

  try {
    const result = await purchaseMaskTransaction({ userId, pharmacyId, maskId, quantity });
    res.json({ message: "購買成功", data: result });
  } catch (error) {
    console.error("購買失敗:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { purchaseMask };
