const Game = require( '../models/Game' );

exports.startGame = async ( req, res ) => {
  try {
    // req.user viene popolato dal middleware 'protect'
    const userId = req.user._id;

    // Crea una griglia 1D di 100 elementi inizializzata a 0 (rispetta il Model)
    const grid = Array( 100 ).fill( 0 );

    // Crea la nuova partita
    const game = new Game( {
      userId,
      grid,
      currentNumber: 1,
      status: 'in_progress'
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
    game.currentNumber += 1; // Incrementa numero (es. da 1 a 2)
    game.grid[position] = game.currentNumber; // Scrivi nella griglia (ops qui c'è un trucco...)

    // NOTA DIDATTICA: Mongoose non rileva cambiamenti negli array primitivi facilmente.
    // Dobbiamo dirgli che l'abbiamo modificato:
    game.markModified( 'grid' );
    game.moves.push( {
      number: game.currentNumber,
      position: position
    } );
    game.moveCount += 1;
    // 6. Controlla Vittoria/Fine (lo faremo dopo, per ora salva)
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