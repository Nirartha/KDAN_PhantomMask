const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** 購買口罩
 * @param {Int} userId - 使用者 id
 * @param {Int} pharmacyId - 藥局 id
 * @param {Int} maskId - 口罩 id
 * @param (Int) quantity - 購買數量
 */
const purchaseMaskTransaction = async ({ userId, pharmacyId, maskId, quantity }) => {
  return await prisma.$transaction(async (tx) => {
    try {
      const startTime = Date.now(); // 記錄交易開始時間
      
      // 1. 檢查口罩是否存在
      const mask = await tx.mask.findUnique({
        where: { id: parseInt(maskId, 10) },
      });

      if (!mask) {
        throw new Error("口罩不存在");
      }

      const totalPrice = mask.price * quantity;

      // 2. 檢查用戶餘額是否足夠
      const user = await tx.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });

      if (!user) {
        throw new Error("用戶不存在");
      }
      if (user.cashBalance < totalPrice) {
        throw new Error("用戶餘額不足");
      }

      // 3. 扣除用戶餘額
      await tx.user.update({
        where: { id: parseInt(userId, 10) },
        data: { cashBalance: { decrement: totalPrice } },
      });

      // 4. 增加藥局的現金餘額
      await tx.pharmacy.update({
        where: { id: parseInt(pharmacyId, 10) },
        data: { cashBalance: { increment: totalPrice } },
      });

      // 5. 記錄購買歷史
      const purchaseHistory = await tx.purchaseHistory.create({
        data: {
          userId: parseInt(userId, 10),
          pharmacyId: parseInt(pharmacyId, 10),
          maskName: mask.name,
          transactionAmount: totalPrice,
          transactionDate: new Date(),
        },
      });

      const duration = Date.now() - startTime;
      console.log(`購買口罩成功: 用戶(${userId}) 購買 ${quantity} 個 ${mask.name}，總價 ${totalPrice}，耗時 ${duration}ms`);
      return purchaseHistory;
    } catch (error) {
      console.error(`購買口罩失敗: ${error.message}`, { userId, pharmacyId, maskId, quantity });
      throw new Error(`無法完成購買口罩`);
    }
  });
};

module.exports = { purchaseMaskTransaction };
