const { PrismaClient } = require("@prisma/client");
const { isPharmacyOpen } = require("../helpers/timeHelpers");
const { getUsersTransactionsByPeriod } = require("../models/userModel");
const { getAllPharmacies, searchPharmacies } = require("../models/pharmacyModel");
const { getMasksByPharmacyId, searchMasks } = require("../models/maskModel");
const { getTransactionsByPeriod } = require("../models/purchaseHistoryModel");
const prisma = new PrismaClient();

/** List all pharmacies
 * @router GET /api/pharmacies
 */
const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await getAllPharmacies();
    res.json(pharmacies);
  } catch (error) {
    console.error(`取得藥局資料錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法獲取藥局資料" });
  }
};

/** List all pharmacies open at a specific time and on a day of the week if requested.
 * @router GET /api/pharmacies/open
*/
const getOpenPharmacies = async (req, res) => {
  const { day, time } = req.query;

  if (!day) {
    return res.status(400).json({ error: "請提供星期參數（例 Monday）" });
  }

  try {
    const pharmacies = await getAllPharmacies();
    const openPharmacies = pharmacies.filter((pharmacy) => {
      const openingHours = pharmacy.opening_hours;
      return time ? isPharmacyOpen(openingHours, day, time) : openingHours[day];
    });

    res.json(openPharmacies);
  } catch (error) {
    console.error(`取得營業藥局錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法取得營業藥局" });
  }
};

/** List all masks sold by a given pharmacy, sorted by mask name or price.
 * @router GET /api/pharmacies/${selectedPharmacy}/masks?sortBy=${sortBy}`
*/
const getMasksByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { sortBy } = req.query;

    if (!pharmacyId || isNaN(Number(pharmacyId))) {
      return res.status(400).json({ error: "無效的 pharmacyId" });
    }

    const validSortOptions = ["name", "price"];
    const orderBy = validSortOptions.includes(sortBy) ? { [sortBy]: "asc" } : { name: "asc" };

    const masks = await getMasksByPharmacyId(pharmacyId, sortBy);
    res.json(masks);
  } catch (error) {
    console.error(`取得特定藥局的口罩列表錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法獲取特定藥局的口罩列表" });
  }
};

/** List all pharmacies with more or less than x mask products within a price range.
 * @router GET /api/pharmacies/filter
*/
const filterPharmacies = async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
    const qty = parseInt(req.query.qty) || 0;
    const comparison = req.query.comparison;

    if (isNaN(minPrice) || minPrice < 0) {
      return res.status(400).json({ error: "欲搜尋之最低價位必須為有效數字，且不能為負數" });
    }
    if (isNaN(maxPrice) || maxPrice < minPrice) {
      return res.status(400).json({ error: "欲搜尋之最高價位必須為有效數字，且不能小於欲搜尋之最低價位" });
    }
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ error: "數量必須為正整數" });
    }
    if (!["greater", "less"].includes(comparison)) {
      return res.status(400).json({ error: "條件必須是大於等於或小於等於" });
    }

    const pharmacies = await getAllPharmacies();
    const filteredPharmacies = pharmacies.filter((pharmacy) => {
      const maskCount = pharmacy.masks.filter(
        (mask) => mask.price >= minPrice && mask.price <= maxPrice
      ).length;

      return comparison === "greater" ? maskCount > qty : maskCount < qty;
    });

    res.json(filteredPharmacies);
  } catch (error) {
    console.error(`篩選有口罩的藥局錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法篩選有口罩的藥局" });
  }
};

/** The top qty users by total transaction amount of masks within a date range.
 * @router GET api/transactions/top-users
*/
const getTopUsersByTransactionAmount = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;
    
    if (!startDate || !endDate || !limit) {
      return res.status(400).json({ error: "請提供欲搜尋起始日、結束日和用戶數量" });
    }

    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ error: "欲搜尋日期格式錯誤，請使用 YYYY-MM-DD" });
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: "欲搜尋用戶數量必須是大於 0" });
    }

    const topUsers = await getUsersTransactionsByPeriod(startDate, endDate);
    const rankedUsers = topUsers
      .map(user => ({
        id: user.id,
        name: user.name,
        totalAmt: user.purchaseHistories.reduce((sum, t) => sum + Number(t.transactionAmount), 0).toFixed(2),
      }))
      .sort((a, b) => b.totalAmt - a.totalAmt) // 按金額降序排列
      .slice(0, limit); // 取前 X 名

    return res.json(rankedUsers);
  } catch (error) {
    console.error(`取得用戶交易資料錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法取得用戶交易資料錯誤" });
  }
};

/** The total amount of masks and dollar value of transactions within a date range.
 * @router GET /api/transactions/total?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
*/
const getTotalTransactionsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "請提供欲搜尋起始日與結束日" });
    }
    const isValidDate = (date) => !isNaN(new Date(date).getTime());
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({ error: "欲搜尋日期格式錯誤，請使用 YYYY-MM-DD" });
    }

    const transactions = await getTransactionsByPeriod(startDate, endDate);

    // 計算總交易金額與購買的每盒中口罩數量
    const totalAmount = transactions.reduce((sum, t) => sum + Number(t.transactionAmount), 0).toFixed(2);
    //const totalMasks = transactions.length;
    const totalMasks = transactions.reduce((sum, t) => {
      const match = t.maskName.match(/\((\d+)\sper\s/); // 使用正則表達式提取括號內的數字
      const masksPerPack = match ? parseInt(match[1], 10) : 0; // 預設為 0（若提取失敗）

      return sum + masksPerPack;
    }, 0);

    res.json({ totalAmount, totalMasks });
  } catch (error) {
    console.error(`取得指定時間區間內交易資料錯誤: ${error.message}`);
    res.status(500).json({ error: "伺服器錯誤:無法取得指定時間區間內交易資料" });
  }
};

/** Search for pharmacies or masks by name, ranked by relevance to the search term.
 * @router GET /api/pharmacies/search?query={keyword}&type={pharmacy|mask}
*/
const searchKeyword = async (req, res) => {
  try {
    const { query, type } = req.query;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({ error: "請提供有效的搜尋關鍵字" });
    }
    if (query.length > 100) {
      return res.status(400).json({ error: "搜尋關鍵字過長，請限制在 100 字以內" });
    }
    const validTypes = ["pharmacy", "mask"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({ error: "無效的搜尋類型，僅供使用藥局或口罩類型" });
    }

    let pharmacyResults = [];
    let maskResults = [];

    if (!type || type === "pharmacy") {
      pharmacyResults = await searchPharmacies(query);
    }
    if (!type || type === "mask") {
      maskResults = await searchMasks(query);
    }

    res.json({ pharmacies: pharmacyResults, masks: maskResults });
  } catch (error) {
    console.error(`搜尋關鍵字錯誤: ${error.message}`);
    res.status(500).json({ error: "無法搜尋關鍵字" });
  }
};

module.exports = { getPharmacies, getOpenPharmacies, getMasksByPharmacy, filterPharmacies, getTopUsersByTransactionAmount, getTotalTransactionsByPeriod, searchKeyword };
