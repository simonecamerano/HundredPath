const Game = require( '../models/Game' );
const User = require( '../models/User' );

exports.startGame = async ( req, res ) => {
  try {
    const userId = req.user._id;
    const { gameMode } = req.body; // 'tutorial' or 'ranked'

    // VALIDAZIONE GAME MODE
    const validModes = ['tutorial', 'ranked'];
    if ( !gameMode || !validModes.includes( gameMode ) ) {
      return res.status( 400 ).json( { error: 'Invalid game mode. Must be tutorial or ranked.' } );
    }

    // GUEST CHECK: Guests can only play tutorial
    if ( req.user.isGuest && gameMode === 'ranked' ) {
      return res.status( 403 ).json( { error: 'Guests can only play tutorial mode. Please register to unlock ranked.' } );
    }

    // RANKED UNLOCK CHECK: User must complete tutorial first
    if ( gameMode === 'ranked' ) {
      const user = await User.findById( userId );
      if ( !user.tutorialCompleted ) {
        return res.status( 403 ).json( { error: 'Complete at least one tutorial game to unlock ranked mode.' } );
      }
    }

    // 1. PULIZIA: Cancella vecchie partite abbandonate (in_progress)
    // Così salviamo solo Vinte o Perse ufficialmente.
    await Game.deleteMany( { userId, status: 'in_progress' } );

    // 2. SETUP GRIGLIA
    const grid = Array( 100 ).fill( 0 );

    // 3. LOGICA RANDOM START
    // Scegliamo una posizione a caso da 0 a 99
    const startPos = Math.floor( Math.random() * 100 );

    // Piazziamo l'1
    grid[startPos] = 1;

    // 4. CREAZIONE PARTITA
    const game = new Game( {
      userId,
      grid,
      currentNumber: 2, // Siamo pronti per piazzare il 2
      status: 'in_progress',
      gameMode, // Salva il mode
      moves: [{ number: 1, position: startPos }], // Salviamo la prima mossa
      moveCount: 1
    } );

    await game.save();

    res.status( 201 ).json( { game } );
  } catch ( error ) {
    console.error( 'Error starting game:', error );
    res.status( 500 ).json( { error: 'Failed to start game' } );
  }
};

exports.makeMove = async ( req, res ) => {
  try {
    const { gameId, position } = req.body;
    const userId = req.user._id;

    const game = await Game.findById( gameId );

    // 1. Controlli Base
    if ( !game ) return res.status( 404 ).json( { error: 'Game not found' } );
    if ( game.userId.toString() !== userId.toString() ) return res.status( 403 ).json( { error: 'Not your game' } );
    if ( game.status !== 'in_progress' ) return res.status( 400 ).json( { error: 'Game is over' } );

    // 2. Cella già occupata?
    if ( game.grid[position] !== 0 ) {
      return res.status( 400 ).json( { error: 'Cell already occupied' } );
    }
    // 3. Trova l'ultima posizione
    // Se moveCount è 0, prevPosition è -1 (nessuna), altrimenti prendiamo l'ultima mossa
    const lastMove = game.moves[game.moves.length - 1];
    const prevPosition = lastMove ? lastMove.position : -1;
    // 4. Valida Mossa
    if ( !isValidMove( prevPosition, position ) ) {
      return res.status( 400 ).json( { error: 'Invalid move' } );
    }
    // 5. APPLICA MOSSA
    game.grid[position] = game.currentNumber; // Scrivi IL NUMERO CORRENTE (es. 1)
    game.currentNumber += 1; // Incrementa per il prossimo (es. diventa 2)

    // NOTA DIDATTICA: Mongoose non rileva cambiamenti negli array primitivi facilmente.
    // Dobbiamo dirgli che l'abbiamo modificato:
    game.markModified( 'grid' );
    game.moves.push( {
      number: game.grid[position], // Store what we placed
      position: position
    } );
    game.moveCount += 1;
    // 6. Controlla Vittoria/Fine
    // Se currentNumber è diventato 101, vuol dire che abbiamo piazzato il 100.
    if ( game.currentNumber > 100 ) {
      game.status = 'completed';
      game.completedAt = new Date();
    }
    await game.save();
    res.json( { game } );
  } catch ( error ) {
    console.error( 'Error making move:', error );
    res.status( 500 ).json( { error: 'Failed to make move' } );
  }
};

// Helper: converte indice (0-99) in coordinate (x,y)
const toCoords = ( index ) => {
  return {
    x: index % 10,
    y: Math.floor( index / 10 )
  };
};
// Helper: valida la mossa
const isValidMove = ( currentIndex, targetIndex ) => {
  // Se è la prima mossa (current è null o -1), accettiamo qualsiasi casella vuota?
  // Nel gioco Hundred di solito la prima mossa è libera. Assumiamo di sì per ora.
  if ( currentIndex === -1 ) return true;
  const start = toCoords( currentIndex );
  const end = toCoords( targetIndex );
  const dx = Math.abs( end.x - start.x );
  const dy = Math.abs( end.y - start.y );
  // Regola 1: Cardinale (salta 2 caselle -> distanza 3)
  const isCardinal = ( dx === 3 && dy === 0 ) || ( dx === 0 && dy === 3 );
  // Regola 2: Diagonale (salta 1 casella -> distanza 2)
  const isDiagonal = ( dx === 2 && dy === 2 );
  return isCardinal || isDiagonal;
};

exports.undoMove = async ( req, res ) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;
    const game = await Game.findById( gameId );
    if ( !game ) return res.status( 404 ).json( { error: 'Game not found' } );
    if ( game.userId.toString() !== userId.toString() ) return res.status( 403 ).json( { error: 'Not your game' } );
    if ( game.status !== 'in_progress' ) return res.status( 400 ).json( { error: 'Game is over' } );
    const lastMove = game.moves.pop();
    game.grid[lastMove.position] = 0;
    game.currentNumber -= 1;
    game.moveCount -= 1;
    game.markModified( 'grid' );
    await game.save();
    res.json( { game } );
  } catch ( error ) {
    console.error( 'Error undoing move:', error );
    res.status( 500 ).json( { error: 'Failed to undo move' } );
  }
};

exports.gameOver = async ( req, res ) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    const game = await Game.findById( gameId );

    if ( !game ) return res.status( 404 ).json( { error: 'Game not found' } );
    if ( game.userId.toString() !== userId.toString() ) return res.status( 403 ).json( { error: 'Not your game' } );

    // Se è già finita, amen
    if ( game.status !== 'in_progress' ) return res.json( { game } );

    // Segna come completata (anche se persa)
    game.status = 'completed';
    game.completedAt = new Date();

    await game.save();

    // UNLOCK RANKED: Se è una partita tutorial completata (anche se persa)
    if ( game.gameMode === 'tutorial' ) {
      console.log( '🎓 Tutorial completed! Unlocking ranked for user:', userId );
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { tutorialCompleted: true },
        { new: true } // Return the updated document
      );
      console.log( '✅ User updated. tutorialCompleted:', updatedUser.tutorialCompleted );
    }

    res.json( { game, message: "Game Over recorded", tutorialCompleted: game.gameMode === 'tutorial' } );
  } catch ( error ) {
    console.error( 'Error ending game:', error );
    res.status( 500 ).json( { error: 'Failed to record Game Over' } );
  }
};

exports.deleteGame = async ( req, res ) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const game = await Game.findById( id );

    if ( !game ) return res.status( 404 ).json( { error: 'Game not found' } );
    if ( game.userId.toString() !== userId.toString() ) {
      return res.status( 403 ).json( { error: 'Not your game' } );
    }

    await Game.findByIdAndDelete( id );
    console.log( '🗑️ Game deleted:', id, 'Mode:', game.gameMode );

    res.json( { message: 'Game deleted successfully' } );
  } catch ( error ) {
    console.error( 'Error deleting game:', error );
    res.status( 500 ).json( { error: 'Failed to delete game' } );
  }
};