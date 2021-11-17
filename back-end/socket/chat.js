const sMessage = require('../models/exemple');

module.exports = function (io) {
// Établissement de la connexion à Socket.io
  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    //Récupère le nombre de message.
    sMessage.count({}, (err, count) => {
      console.log ("Nombre de message : ", count);
      io.emit('nbMsg', count)
    })

    /*zone permettant de récupérer les messages des utilisateurs présent dans la base.

    sMessage.aggregate(
      [
        {
          _id : "$msg"
        }
      ]
    )
    */

    /*zone permettant de récupérer le nombre de messages par utilisateur
    let nbMsgUtil = sMessage.aggregate(
      [
        {$Group:{ 
            _id: "$userid",
            count: { $sum: 1 }
          }
        }  
      ]
    )
    io.emit('nbMsgUtil', nbMsgUtil)
    */


    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('nouveau', (id) => {
      const msg = new sMessage({
        Id : id.Id,
        timestamp : new Date(),
        pseudo : id.pseudo,
        msg : id.msg
      })
      io.emit('nouveau', id)
    
    //Sauvegarde dans la base de données
    msg.save().then(() => {
      sMessage.count({}, function(err, count){
        console.log("Nombre de messages: ", count );
        io.emit('nbMsg', count)
      });
      }).catch((error) => {
      console.log(error)
      })

    /*actualisation des messsages afficher 
      sMessage.aggregate(
      [
        {
          _id : "$msg"
        }
      ]
    )
    */

    /* Actualisation du nombre de message des utilisateur
    let nbMsgUtil = sMessage.aggregate(
      [
        {$Group:{ 
            _id: "$userid",
            count: { $sum: 1 }
          }
        }  
      ]
    )
    io.emit('nbMsgUtil', nbMsgUtil)
    */

    })

  })
}