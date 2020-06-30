import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarioLista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuarioLista();

export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
}
export const desconectar = (cliente: Socket)=>{
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
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

export const configurarUsuario = (cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: {nombre: string}, callback: Function)=>{
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        })
    });
}