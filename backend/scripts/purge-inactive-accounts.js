/**
 * Retention: delete accounts inactive for 24 months.
 *
 * The privacy policy states that accounts with no activity for 24 consecutive
 * months are deleted along with their games. This script enforces it: without it
 * the policy would be a promise the system does not keep.
 *
 * Inactivity is measured on lastLogin, falling back to updatedAt for accounts
 * created before that field existed.
 *
 * Dry run (default, changes nothing):  node scripts/purge-inactive-accounts.js
 * Actually delete:                     node scripts/purge-inactive-accounts.js --apply
 *
 * Intended to run monthly from cron. Logs counts only, never email addresses.
 */
const mongoose = require( 'mongoose' );
const path = require( 'path' );
require( 'dotenv' ).config( { path: path.resolve( __dirname, '../.env' ) } );

const MESI_DI_CONSERVAZIONE = 24;

async function purgeInactiveAccounts() {
  const apply = process.argv.includes( '--apply' );

  if ( !process.env.MONGODB_URI ) {
    throw new Error( 'MONGODB_URI is not defined in .env' );
  }

  await mongoose.connect( process.env.MONGODB_URI );
  console.log( `Connected. Mode: ${apply ? 'APPLY (deletes data)' : 'DRY RUN (no changes)'}` );

  const soglia = new Date();
  soglia.setMonth( soglia.getMonth() - MESI_DI_CONSERVAZIONE );
  console.log( `Cutoff: accounts inactive since ${soglia.toISOString().slice( 0, 10 )}` );

  const User = mongoose.model( 'User', new mongoose.Schema( {}, { strict: false } ), 'users' );
  const Game = mongoose.model( 'Game', new mongoose.Schema( {}, { strict: false } ), 'games' );
  const Leaderboard = mongoose.model( 'Leaderboard', new mongoose.Schema( {}, { strict: false } ), 'leaderboards' );

  const inattivi = await User.find( {
    $or: [
      { lastLogin: { $lt: soglia } },
      { lastLogin: { $exists: false }, updatedAt: { $lt: soglia } }
    ]
  } ).select( '_id' ).lean();

  console.log( `Inactive accounts found: ${inattivi.length}` );

  if ( inattivi.length === 0 || !apply ) {
    if ( inattivi.length > 0 ) {
      console.log( 'Dry run: nothing deleted. Re-run with --apply to delete.' );
    }
    await mongoose.disconnect();
    return;
  }

  const ids = inattivi.map( u => u._id );
  const partite = await Game.deleteMany( { userId: { $in: ids } } );
  const classifiche = await Leaderboard.deleteMany( { userId: { $in: ids } } );
  const utenti = await User.deleteMany( { _id: { $in: ids } } );
  console.log( `Deleted: ${utenti.deletedCount} accounts, ${partite.deletedCount} games, ${classifiche.deletedCount} leaderboard entries` );

  await mongoose.disconnect();
}

purgeInactiveAccounts().catch( err => {
  console.error( 'Retention job failed:', err.message );
  process.exit( 1 );
} );
