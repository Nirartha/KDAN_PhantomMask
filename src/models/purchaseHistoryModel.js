const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** 取得特定時間區間內的交易記錄
 * @param {Date} startDate - 查詢開始日期
 * @param {Date} endDate - 查詢結束日期
 * @returns {Promise<Array>} - 回傳交易記錄
 */
const getTransactionsByPeriod = async (startDate, endDate) => {
  try {
    return await prisma.purchaseHistory.findMany({
      where: {
        transactionDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });
  } catch (error) {
    console.error(`取得特定時間區間內的交易記錄失敗: ${error.message}`);
    throw new Error("無法取得特定時間區間內的交易記錄");
  }
};

module.exports = { getTransactionsByPeriod };
