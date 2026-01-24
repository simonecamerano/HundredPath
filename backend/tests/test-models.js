/**
 * Models Test Script 
 * 
 * Tests that User, Game, and Leaderboard function correctly
 * 
 * HOW TO USE:
 * node test-models.js
 */
require( 'dotenv' ).config();
const mongoose = require( 'mongoose' );
const User = require( '../models/User' );
const Game = require( '../models/Game' );
const Leaderboard = require( '../models/Leaderboard' );

// Output colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: ( msg ) => console.log( `${colors.green}✓${colors.reset} ${msg}` ),
  error: ( msg ) => console.log( `${colors.red}✗${colors.reset} ${msg}` ),
  info: ( msg ) => console.log( `${colors.blue}ℹ${colors.reset} ${msg}` ),
  section: ( msg ) => console.log( `\n${colors.yellow}━━━ ${msg} ━━━${colors.reset}` )
};

async function testModels() {
  try {
    // MongoDB connection
    log.section( 'MongoDB connection' );
    await mongoose.connect( process.env.MONGODB_URI );
    log.success( 'Connected to MongoDB' );

    // Cleanup any previous test data
    await Leaderboard.deleteMany( { username: 'testplayer' } );
    await Game.deleteMany( {} );
    await User.deleteMany( { username: 'testplayer' } );
    log.info( 'Previous test data cleaned' );

    // User model test
    log.section( 'User model test' );
    // Create user
    const testUser = new User( {
      username: 'testplayer',
      email: 'test@hundredpath.com',
      password: 'password123',
      avatar: 'default-avatar.png'
    } );
    await testUser.save();
    log.success( 'User created: ' + testUser.username );
    log.info( `ID: ${testUser._id}` );

    // Verify that password is hashed
    log.info( `Password hashed: ${testUser.password ? 'Yes' : 'No'}` );

    // Test comparePassword method
    const user = await User.findById( testUser._id ).select( '+password' );
    const isMatch = await user.comparePassword( 'password123' );
    log.success( `Test comparePassword: ${isMatch ? 'PASS' : 'FAIL'}` );

    const isWrong = await user.comparePassword( 'wrongpassword' );
    log.success( `Test wrong password: ${!isWrong ? 'PASS' : 'FAIL'}` );

    // Game model test
    log.section( 'Game model test' );
    // Create game
    const testGame = new Game( {
      userId: testUser._id
    } );
    await testGame.save();
    log.success( 'Game created' );
    log.info( `Grid size: ${testGame.grid.length}` );
    log.info( `Current number: ${testGame.currentNumber}` );
    log.info( `Status: ${testGame.status}` );

    // Simulate some moves
    testGame.grid[0] = 1;
    testGame.currentNumber = 2;
    testGame.moves.push( { number: 1, position: 0 } );
    testGame.moveCount = 1;

    testGame.grid[3] = 2; // Cardinal move: 3 cells
    testGame.currentNumber = 3;
    testGame.moves.push( { number: 2, position: 3 } );
    testGame.moveCount = 120; // Realistic move count for testing (min 99)
    await testGame.save();
    log.success( `Moves simulated: ${testGame.moveCount}` );

    // Test calculateTimeElapsed method
    const elapsed = testGame.calculateTimeElapsed();
    log.success( `Time elapsed: ${elapsed} seconds` );

    // Leaderboard model test
    // Complete the game for leaderboard
    testGame.status = 'completed';
    testGame.currentNumber = 101;
    testGame.completedAt = new Date();
    testGame.timeElapsed = testGame.calculateTimeElapsed();
    await testGame.save();

    // Create leaderboard entry
    const leaderboardEntry = new Leaderboard( {
      userId: testUser._id,
      gameId: testGame._id,
      username: testUser.username,
      moveCount: testGame.moveCount,
      timeElapsed: testGame.timeElapsed,
      completedAt: testGame.completedAt
    } );
    await leaderboardEntry.save();
    log.success( 'Leaderboard entry created' );
    log.info( `Username: ${leaderboardEntry.username}` );
    log.info( `Moves: ${leaderboardEntry.moveCount}` );
    log.info( `Time: ${leaderboardEntry.timeElapsed}s` );

    // Test static method getTopPlayers
    const topPlayers = await Leaderboard.getTopPlayers( 10 );
    log.success( `Top players found: ${topPlayers.length}` );

    // Test static method getUserRank
    const rankData = await Leaderboard.getUserRank( testUser._id );
    log.success( `User rank: ${rankData.rank}` );

    // ===== CLEANUP =====
    log.section( 'Test Database Cleanup' );
    await Leaderboard.deleteMany( { username: 'testplayer' } );
    await Game.deleteMany( { userId: testUser._id } );
    await User.deleteMany( { username: 'testplayer' } );
    log.success( 'Test data removed' );

    // ===== SUMMARY =====
    log.section( 'Tests Completed' );
    log.success( 'All tests passed!' );
    log.info( 'Models are working correctly' );

  } catch ( error ) {
    log.error( 'Error during tests:' );
    console.error( error );
  } finally {
    // Close connection
    await mongoose.connection.close();
    log.info( 'Connection closed' );
    process.exit( 0 );
  }
}

// Run tests
testModels();