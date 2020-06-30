import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http'; // intermedio entre socket y express, express no es directamente compatible con socket
import * as socket from '../sockets/sockets'; // * voy a importar todo lo que este en ese paquete "as socket" y si va llamar "socket"

/* Patron singleton me aseguro de tener una unica instancia de la clase
   me beneficia para tener una unico llamado a socket
*/

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);

    this.escucharSockets();
  }

  public static get instance() {
    // si existe la instancia regrese la instancia, cuando se quiera obtener el get instance y si es la primera vez 
    // que se llama esa funcion  el this,_instance = new this(); crea una instancia y es lo que va regresar
    return this._instance || (this._instance = new this());
  }

  // privado por que solo se va llamar en el inicializador de la clase 
  private escucharSockets() {
    console.log('Escuchando conexiones-sockets');
    this.io.on('connection', cliente => {
      console.log('Cliente conectado');

      // Conectar Cliente
      socket.conectarCliente(cliente);
      // Usuario
      socket.configurarUsuario(cliente, this.io);
      console.log(cliente.id);
      // Mensajes
      socket.mensaje(cliente, this.io);
      // Desconectar
      socket.desconectar(cliente);

    });
  }

  // metodo para inicializar el servidor
  start(callback: VoidFunction) {
    //this.app.listen(this.port, callback);
    this.httpServer.listen(this.port, callback);
  }

}