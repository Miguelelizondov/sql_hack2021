const http = require('http');
const gpsModel = require('../models/personsModel');
const { requestData } = require('./MachineCareService.js');

exports.SocketIo = class SocketIo {
  /** @type {SocketIo} */
  static instance;
  /** @type {any} */
  io;

  /**
   * Constructor
   * @param {http.Server} httpServer
   */
  constructor(httpServer) {
    this.initialize(httpServer);
  }

  /**
   * Function that return SocketIo instance.
   * @returns {SocketIo}
   * @param {http.Server} httpServer
   */
  static getInstance(httpServer) {
    if (!SocketIo.instance) {
      SocketIo.instance = new SocketIo(httpServer);
    }
    return SocketIo.instance;
  }
  
  /**
   * Function that initialize socketIo instance.
   * @param {http.Server} httpServer
   */
  initialize(httpServer) {
    this.io = require('socket.io')(httpServer, {
        cors: { origin: "*" }
    });;

    this.io.on('connection', (socket) => {
        console.log(`${socket.id} has connected`);

        socket.on('disconnect', async () => {
          console.log(`${socket.id} disconnected`);
        });

        socket.on('update', async (id, lat, lng, usage_, battery, capacity) => {
            if (id === "default") {
              id = socket.id;
            }
            const data = {
              "id": id,
              "lat": lat,
              "lng": lng,
              "usage_": usage_ || 0,
              "battery": battery || 0.5,
              "capacity": capacity || 0,
            };
            gpsModel.handleEntry(data);
            this.io.to(socket.id).emit(`updateACK`, `Update Received ${id}`);
        });
    });

    setInterval(async () => {
      try {
        const users = await requestData();
        if (users) {
          console.log("Users: ", users.length);
          for (const user of users) {
            const data = {
              "id": user?.usuario?.nombre,
              "lat": user?.usuario?.latUbicacion,
              "lng": user?.usuario?.lngUbicacion,
              "usage_": 0,
              "battery": 0.5,
              "capacity": 0,
            };
            if (!data["lat"] || !data["lng"] || !data["id"]) {
              continue;
            }
            if (!user?.usuario?.fechaUltimaUbicacion) {
              continue;
            }
            const date = new Date(user?.usuario?.fechaUltimaUbicacion + ".000-05:00");
            if ((new Date() - date) > 10 * 60 * 1000) { // Ignore if greater than 5 miutes
              continue;
            }
            console.log(data);
            gpsModel.handleEntry(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 1000 * 10); // Request every 10 seconds.
  }
}
