const Game = require( '../models/Game' );
exports.getLeaderboard = async ( req, res ) => {
  try {
    const leaderboard = await Game.aggregate( [
      // 1. NON Filtrare solo vinte! Mostra tutto
      // { $match: { status: 'completed' } },

      // 2. Calcola durata
      {
        $addFields: {
          // Se completata: completedAt - startedAt
          // Se in corso/persa: ora - startedAt (o updatedAt - startedAt)
          // Per ora usiamo updatedAt per le non finite
          endTime: { $ifNull: ["$completedAt", "$updatedAt"] },
        }
      },
      {
        $addFields: {
          duration: { $subtract: ["$endTime", "$startedAt"] }
        }
      },

      // 3. Ordina per PUNTEGGIO (più alto è meglio) poi DURATA (più basso è meglio)
      { $sort: { currentNumber: -1, duration: 1 } },

      // 4. Limita a 10
      { $limit: 10 },

      // 5. Join con User per avere username
      {
        $lookup: {
          from: "users", // Nome della collezione utenti (pluralizzato da Mongoose!)
          localField: "userId",
          foreignField: "_id",
          as: "player"
        }
      },

      // 6. Appiattisci array player (lookup ritorna array)
      { $unwind: "$player" },

      // 7. Seleziona campi finali
      {
        $project: {
          _id: 1,
          username: "$player.username",
          duration: 1,
          completedAt: 1,
          updatedAt: 1, // Aggiunto
          currentNumber: 1 // Aggiunto
        }
      }
    ] );
    res.json( leaderboard );
  } catch ( error ) {
    console.error( "Leaderboard error:", error );
    res.status( 500 ).json( { error: "Server error" } );
  }
};