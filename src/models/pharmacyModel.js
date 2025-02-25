const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** 取得所有藥局資訊，包含口罩資訊
 * SQL：SELECT * FROM "Pharmacy" LEFT JOIN "Mask" ON "Pharmacy".id = "Mask".pharmacyId;
 * @returns {Promise<Array>} - 有口罩的藥局列表
 */
const getAllPharmacies = async () => {
  try {
    return await prisma.pharmacy.findMany({
      include: {
        masks: true,
      },
    });
  } catch (error) {
    console.error(`取得有口罩的藥局資料失敗: ${error.message}`);
    throw new Error("無法取得有口罩的藥局資料");
  }
};

/** 依關鍵字搜尋藥局
 * @param {string} query - 搜尋關鍵字
 * @returns {Promise<Array>} - 回傳符合條件的藥局列表
 */
const searchPharmacies = async (query) => {
  try {
    return await prisma.pharmacy.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true },
    });
  } catch (error) {
    console.error(`搜尋藥局資料失敗: ${error.message}`);
    throw new Error("無法搜尋藥局資料");
  }
};


module.exports = { getAllPharmacies, searchPharmacies };
