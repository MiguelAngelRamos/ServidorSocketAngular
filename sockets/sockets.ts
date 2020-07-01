import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarioLista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuarioLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
    // usuarios que no tienen nombre
    
}

export const desconectar = (cliente: Socket, io: socketIO.Server )=>{
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario(cliente.id);
        // si alguien se desconecta necesito enviar una lista de los que si estan conectados
        // razon por la cual emito este evento en "desconectar"
        io.emit('usuarios-activos', usuariosConectados.getLista());

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
        io.emit('usuarios-activos', usuariosConectados.getLista());

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        })
    });
}

// Obtener usuarios, para resolver el prueba que cuando cierro el navegador y ingreso con mi nombre no me aparece ninguna lista de usuarios esto lo soluciona

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server ) => {
    cliente.on('obtener-usuarios', ()=>{
        // "to" para enviar a un usuario en particular en socket
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
}