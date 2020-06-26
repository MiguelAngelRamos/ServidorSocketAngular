import { Socket } from 'socket.io';
import socketIO from 'socket.io';

export const desconectar = (cliente: Socket)=>{
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
}

// escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: {de: string, cuerpo: string})=>{
        console.log('Mensaje recibido', payload);
        // io es el servidor de socket, tiene el control y el conocimiento de que personas estan conectadas
        // hay que usar io para enviar mensajes a todos los usuarios
        io.emit('mensaje-nuevo', payload);
    });
}