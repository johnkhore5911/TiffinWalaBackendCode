const mongoose = require("mongoose");
require("dotenv").config();

// const connect = () => {
//     mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log("DB Connected Successfully"))
//     .catch((error) => {
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     });
// };

const connect = async () => {
    try {
      await mongoose.connect("mongodb+srv://johnkhore26:aNue5OFJALUzNE06@cluster0.oy5qc.mongodb.net/");
      console.log('MongoDB Connected');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit process with failure
    }
  };

module.exports = connect; 