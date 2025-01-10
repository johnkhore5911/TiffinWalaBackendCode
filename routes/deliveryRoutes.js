const express = require('express');
const router = express.Router();
const { assignDelivery,getAllDeliveries,deleteDelivery,notifyCustomerTiffin,getNotCollectedDeliveriesByUserId,updateDeliveryCollectionStatus,adminReportMissedTiffins } = require('../controllers/deliveryController');
const {auth,isCustomer,isDeliveryBoy,isAdmin} = require("../middlewares/auth")

// Route to assign a delivery person to a customer
router.post('/assignMultiple',auth,isAdmin, assignDelivery);

// Route to get all deliveries assigned to a delivery person
// router.get('/:deliveryPersonId', getDeliveriesForDeliveryPerson);

router.get('/getAllDeliveries',auth,isAdmin, getAllDeliveries);

router.delete('/delete/:deliveryId/:customerId', deleteDelivery);
router.post("/notifyCustomerTiffin",auth,isDeliveryBoy,notifyCustomerTiffin)
router.get('/notCollected', auth,isDeliveryBoy ,getNotCollectedDeliveriesByUserId);
router.post('/collectionStatus', auth,isDeliveryBoy ,updateDeliveryCollectionStatus);
router.get('/adminReportMissedTiffins', auth,isAdmin ,adminReportMissedTiffins);


module.exports = router;
