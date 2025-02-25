const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// 設定 API 路由
router.get('/pharmacies', pharmacyController.getPharmacies);
router.get("/pharmacies/open", pharmacyController.getOpenPharmacies);
router.get("/pharmacies/:pharmacyId/masks", pharmacyController.getMasksByPharmacy);
router.get("/pharmacies/filter", pharmacyController.filterPharmacies);
router.get("/pharmacies/search", pharmacyController.searchKeyword);

router.get("/transactions/top-users", pharmacyController.getTopUsersByTransactionAmount);
router.get("/transactions/total", pharmacyController.getTotalTransactionsByPeriod);


module.exports = router;
