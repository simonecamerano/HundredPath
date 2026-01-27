/**
 * Script to fix gameMode field for old games
 * Sets gameMode='tutorial' for games without gameMode field
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Game = require('../models/Game');

async function fixGameMode() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Find games without gameMode field
    const result = await Game.updateMany(
      { gameMode: { $exists: false } },
      { $set: { gameMode: 'tutorial' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} games with missing gameMode`);

    // Show count by gameMode
    const tutorialCount = await Game.countDocuments({ gameMode: 'tutorial' });
    const rankedCount = await Game.countDocuments({ gameMode: 'ranked' });
    
    console.log(`\n📊 Game Statistics:`);
    console.log(`   Tutorial: ${tutorialCount}`);
    console.log(`   Ranked: ${rankedCount}`);

    await mongoose.connection.close();
    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixGameMode();
