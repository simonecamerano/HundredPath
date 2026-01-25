const Game = require( '../models/Game' );
const mongoose = require( 'mongoose' );

exports.getUserBestScores = async ( req, res ) => {
  try {
    // FIX: Convertiamo esplicitamente in ObjectId per l'aggregazione
    const targetUserId = new mongoose.Types.ObjectId( req.user._id );
    console.log( "Searching best scores for user (ObjectId):", targetUserId );

    const userBest = await Game.aggregate( [
      // 1. Filtra solo 'completed'
      { $match: { status: 'completed' } },
      { $match: { userId: targetUserId } },
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
          avatar: "$player.avatar", // Aggiunto!
          duration: 1,
          completedAt: 1,
          updatedAt: 1,
          currentNumber: { $subtract: ["$currentNumber", 1] }
        }
      }
    ] );

    res.json( userBest );
  } catch ( error ) {
    console.error( "UserBestScores error:", error );
    res.status( 500 ).json( { error: "Server error" } );
  }
};