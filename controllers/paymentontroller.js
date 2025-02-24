// const axios = require("axios");
// const crypto = require("crypto");

// const PHONEPE_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
// const MERCHANT_ID = "PGTESTPAYUAT86";  
// const PHONEPE_SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
// const PHONEPE_SALT_INDEX = "1";

// // Function to generate X-VERIFY signature
// const generateXVerify = (payload) => {
//   const jsonData = JSON.stringify(payload);
//   const dataToHash = jsonData + PHONEPE_SALT_KEY;

//   // SHA-256 Hashing
//   const sha256Hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

//   // Append Salt Index
//   return `${sha256Hash}###${PHONEPE_SALT_INDEX}`;
// };

// // Controller Function
// const initiatePayment = async (req, res) => {
//   try {
//     const { amount } = req.body;  // Get amount from request body
//     if (!amount) return res.status(400).json({ error: "Amount is required" });

//     const transactionId = `TXN_${Date.now()}`;

//     const payload = {
//       merchantId: MERCHANT_ID,
//       transactionId: transactionId,
//       amount: amount * 100, // Convert to paisa
//       callbackUrl: "http://192.168.18.235:5173/api/payments/callback",
//       mobileNumber: "9999999999",
//       paymentInstrument: {
//         type: "UPI_INTENT",
//       },
//     };

//     const xVerify = generateXVerify(payload);

//     const response = await axios.post(
//       `${PHONEPE_BASE_URL}/pg/v1/pay`,
//       { request: Buffer.from(JSON.stringify(payload)).toString("base64") },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-VERIFY": xVerify,
//           "X-MERCHANT-ID": MERCHANT_ID,
//         },
//       }
//     );

//     console.log("Payment Response:", response.data);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Payment initiation failed:", error.response?.data || error.message);
//     res.status(500).json({ error: "Payment failed", details: error.message });
//   }
// };

// module.exports = { initiatePayment };

const axios = require("axios");
const crypto = require("crypto");

const PHONEPE_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "PGTESTPAYUAT86";
const PHONEPE_SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";  
const PHONEPE_SALT_INDEX = "1";

// Generate X-VERIFY signature
const generateXVerify = (payload) => {
  const jsonData = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonData).toString("base64");

  const dataToHash = base64Payload + "/pg/v1/pay" + PHONEPE_SALT_KEY;
  const sha256Hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  return `${sha256Hash}###${PHONEPE_SALT_INDEX}`;
};

// Initiate Payment
const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const transactionId = `TXN_${Date.now()}`;

    // const payload = {
    //   merchantId: MERCHANT_ID,
    //   transactionId: transactionId,
    //   amount: amount * 100,  // Convert to paisa
    //   callbackUrl: "http://192.168.18.235:5173/api/payments/callback",
    //   mobileNumber: "9999999999",
    //   paymentInstrument: {
    //     type: "UPI_INTENT",
    //   },
    // };
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: `TXN_${Date.now()}`,  // Change this key name
      amount: amount * 100,  // Convert to paisa
      callbackUrl: "http://192.168.18.235:5173/api/payments/callback",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "UPI_INTENT",
      },
    };
    

    // Convert payload to Base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    // Generate X-VERIFY Header
    const xVerify = generateXVerify(payload);

    // Make API Request
    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    console.log("Payment Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Payment initiation failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment failed", details: error.response?.data || error.message });
  }
};

module.exports = { initiatePayment };
