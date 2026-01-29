// One-time migration script to update legacy games to 'ranked'
// Run this once: node scripts/migrate-to-ranked.js

const mongoose = require( 'mongoose' );
const path = require( 'path' );
require( 'dotenv' ).config( { path: path.resolve( __dirname, '../.env' ) } ); // Load .env from backend root (parent of scripts/)

async function migrateToRanked() {
  try {
    if ( !process.env.MONGODB_URI ) {
      throw new Error( "MONGODB_URI is not defined in .env" );
    }

    // Connect to MongoDB
    await mongoose.connect( process.env.MONGODB_URI );
    console.log( '✅ Connected to MongoDB' );

    // Define minimal Schema to access the collection
    const Game = mongoose.model( 'Game', new mongoose.Schema( {
      gameMode: String,
      bonusPoints: Number
    }, { strict: false } ) ); // strict: false allows accessing fields not in this schema

    // 1. Update games where gameMode is missing
    const resultMissing = await Game.updateMany(
      { gameMode: { $exists: false } },
      { $set: { gameMode: 'ranked', bonusPoints: 0 } }
    );
    console.log( `Updated ${resultMissing.modifiedCount} games (missing gameMode) -> 'ranked'` );

    // 2. Optional: If you want to force 'tutorial' games to be 'ranked' 
    // uncomment the following block:
    /*
    const resultTutorial = await Game.updateMany(
      { gameMode: 'tutorial' }, 
      { $set: { gameMode: 'ranked', bonusPoints: 0 } }
    );
    console.log(`Updated ${resultTutorial.modifiedCount} 'tutorial' games -> 'ranked'`);
    */

    // Verification
    const rankedCount = await Game.countDocuments( { gameMode: 'ranked' } );
    const masterCount = await Game.countDocuments( { gameMode: 'mastermind' } );
    const tutorialCount = await Game.countDocuments( { gameMode: 'tutorial' } );
    const missingCount = await Game.countDocuments( { gameMode: { $exists: false } } );

    console.log( '\n📊 Current Stats:' );
    console.log( `   Ranked: ${rankedCount}` );
    console.log( `   Mastermind: ${masterCount}` );
    console.log( `   Tutorial: ${tutorialCount}` );
    console.log( `   Missing Mode: ${missingCount}` );

    await mongoose.disconnect();
    console.log( '✅ Disconnected from MongoDB' );

  } catch ( error ) {
    console.error( '❌ Migration error:', error );
    process.exit( 1 );
  }
}

migrateToRanked();
