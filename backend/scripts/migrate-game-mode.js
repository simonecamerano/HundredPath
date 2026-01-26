// One-time migration script to add gameMode to existing games
// Run this once: node scripts/migrate-game-mode.js

const mongoose = require( 'mongoose' );
require( 'dotenv' ).config();

async function migrateGameMode() {
  try {
    // Connect to MongoDB
    await mongoose.connect( process.env.MONGODB_URI );
    console.log( '✅ Connected to MongoDB' );

    // Find all games without gameMode field
    const Game = mongoose.model( 'Game', require( '../models/Game' ).schema );

    const result = await Game.updateMany(
      { gameMode: { $exists: false } }, // Games without gameMode
      { $set: { gameMode: 'tutorial' } } // Set to tutorial by default
    );

    console.log( `🔄 Migration complete!` );
    console.log( `   - Games updated: ${result.modifiedCount}` );
    console.log( `   - Matched: ${result.matchedCount}` );

    await mongoose.disconnect();
    console.log( '✅ Disconnected from MongoDB' );
  } catch ( error ) {
    console.error( '❌ Migration error:', error );
    process.exit( 1 );
  }
}

migrateGameMode();
