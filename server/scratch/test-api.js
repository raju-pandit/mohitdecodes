const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { getStats } = require('../controllers/adminController');

async function testController() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected!');

    // Mock Express req, res, next
    const req = {};
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        console.log('\nResponse Status Code:', this.statusCode);
        console.log('Response JSON Body:\n', JSON.stringify(data, null, 2));
      }
    };
    const next = (err) => {
      console.error('Controller triggered error middleware:', err);
    };

    console.log('Calling getStats controller directly...');
    await getStats(req, res, next);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error running test:', err);
  }
}

testController();
