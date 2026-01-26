// Database reset script - Removes all games and resets tutorial completion
// Run: node scripts/reset-database.js

const mongoose = require( 'mongoose' );
require( 'dotenv' ).config();

async function resetDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect( process.env.MONGODB_URI );
    console.log( '✅ Connected to MongoDB' );

    const Game = mongoose.model( 'Game', require( '../models/Game' ).schema );
    const User = mongoose.model( 'User', require( '../models/User' ).schema );

    // Delete ALL games
    const deletedGames = await Game.deleteMany( {} );
    console.log( `🗑️  Deleted ${deletedGames.deletedCount} games` );

    // Reset tutorialCompleted for all users
    const resetUsers = await User.updateMany(
      {},
      { $set: { tutorialCompleted: false } }
    );
    console.log( `🔄 Reset tutorialCompleted for ${resetUsers.modifiedCount} users` );

    console.log( '\n✅ Database reset complete! Fresh start.' );

    await mongoose.disconnect();
    console.log( '✅ Disconnected from MongoDB' );
  } catch ( error ) {
    console.error( '❌ Reset error:', error );
    process.exit( 1 );
  }
}

resetDatabase();
