const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function check() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(c => console.log(`- ${c.name}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
