const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** 取得特定藥局的口罩列表，可依名稱或價格排序
 * @param {number} pharmacyId - 藥局 id
 * @param {string} sortBy - 排序方式 ("name" 或 "price")
 * @returns {Promise<Array>} - 回傳特定藥局的口罩列表
 */
const getMasksByPharmacyId = async (pharmacyId, sortBy) => {
  try {
    const validSortOptions = ["name", "price"];
    const orderBy = validSortOptions.includes(sortBy) ? { [sortBy]: "asc" } : { name: "asc" };

    return await prisma.mask.findMany({
      where: { pharmacyId: parseInt(pharmacyId) },
      orderBy,
    });
  } catch (error) {
    console.error(`取得特定藥局的口罩列表失敗: ${error.message}`);
    throw new Error("無法取得特定藥局的口罩列表");
  }
};

/** 依關鍵字搜尋口罩
 * @param {string} query - 搜尋關鍵字
 * @returns {Promise<Array>} - 回傳符合條件的口罩列表
 */
const searchMasks = async (query) => {
  try {
    return await prisma.mask.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true },
    });
  } catch (error) {
    console.error(`搜尋口罩時發生錯誤: ${error.message}`);
    throw new Error("無法搜尋口罩");
  }
};

module.exports = { getMasksByPharmacyId, searchMasks };
