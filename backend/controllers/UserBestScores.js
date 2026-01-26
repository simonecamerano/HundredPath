const Game = require( '../models/Game' );
const mongoose = require( 'mongoose' );

exports.getUserBestScores = async ( req, res ) => {
  try {
    // FIX: Convertiamo esplicitamente in ObjectId per l'aggregazione
    const targetUserId = new mongoose.Types.ObjectId( req.user._id );
    console.log( "Searching best scores for user (ObjectId):", targetUserId );

    const userBest = await Game.aggregate( [
      // 1. Filtra solo 'completed' RANKED per TUTTI gli utenti
      { $match: { status: 'completed', gameMode: 'ranked' } },

      // 2. Calcola durata per tutti
      {
        $addFields: {
          endTime: { $ifNull: ["$completedAt", "$updatedAt"] },
        }
      },
      {
        $addFields: {
          duration: { $subtract: ["$endTime", "$startedAt"] }
        }
      },

      // 3. CALCOLA IL RANK GLOBALE
      // Poiché MongoDB $rank richiede un singolo campo di ordinamento in alcune configurazioni,
      // creiamo un punteggio combinato: (punti * 1 miliardo) - durata_ms.
      // Più è alto, migliore è la posizione.
      {
        $addFields: {
          combinedRankScore: {
            $subtract: [
              { $multiply: ["$currentNumber", 1000000000] },
              { $ifNull: ["$duration", 0] }
            ]
          }
        }
      },
      {
        $setWindowFields: {
          partitionBy: null,
          sortBy: { combinedRankScore: -1 },
          output: {
            globalRank: {
              $rank: {}
            }
          }
        }
      },

      // 4. Ora filtriamo per l'utente target
      { $match: { userId: targetUserId } },

      // 5. Ordiniamo i RISULTATI dell'utente (i suoi migliori)
      { $sort: { currentNumber: -1, duration: 1 } },

      // 6. Limita a 10 (i top 10 dell'utente con il loro rank globale)
      { $limit: 10 },

      // 7. Join con User per avere username
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "player"
        }
      },

      // 8. Appiattisci
      { $unwind: "$player" },

      // 9. Seleziona campi finali
      {
        $project: {
          _id: 1,
          globalRank: 1, // Restituiamo il rank calcolato al punto 3
          username: "$player.username",
          avatar: "$player.avatar",
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