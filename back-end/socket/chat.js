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

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('nouveau', (message) => {
      const msg = new sMessage({
        Id : socket.id,
        timestamp : new Date(),
        msg : message
      })
    

    //Sauvegarde dans la base de données
    msg.save().then(() => {
      sMessage.count({}, function(err, count){
        console.log("Nombre de messages: ", count );
        io.emit('nbMsg', count)
      });
      }).catch((error) => {
      console.log(error)
      })
    })
  })
}