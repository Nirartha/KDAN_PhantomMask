const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** get all users with purchaseHistories
 * SELECT * FROM User u
 *  LEFT JOIN PurchaseHistory ph ON u.id = ph.userId
 *  LEFT JOIN Pharmacy p ON ph.pharmacyId = p.id;
*/
const getUsers = async (req, res) => {
  try {
    const usersWithHistories = await prisma.user.findMany({
      include: {
        purchaseHistories: {
          include: {
            pharmacy: true,
          },
        },
      }
    });
    
    res.json(usersWithHistories);
  } catch (error) {
    console.error("讀取資料庫失敗:", error);
    res.status(500).json({ error: "無法獲取用戶資料" });
  }
};

module.exports = { getUsers };
