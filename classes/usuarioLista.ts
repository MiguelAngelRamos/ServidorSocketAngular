import { Usuario } from './usuario';

export class UsuarioLista 
{

  private lista: Usuario[] = [];

  constructor(){}
  // Agregar un usuario
  public agregar( usuario: Usuario ) : Usuario
  {
    this.lista.push( usuario );
    console.log(this.lista);
    return usuario;
  }

  public actualizarNombre( id: string, nombre: string ) : void
  {
    for (let usuario of this.lista ) {

      if ( usuario.id === id )
      {
        usuario.nombre = nombre;
        break;
      }
    }
    console.log('=== Actualizando usuario ==== ');
    console.log(this.lista);
  }

  // Obtener lista de usuarios

  public getLista() : Usuario[]
  {
    return this.lista;
  }

  // Regresar un usuario

  public getUsuario(id: string ) 
  {
    return this.lista.find( usuario => usuario.id === id);
  }
  
  // Obtener usuario en una sala en particular

  public getUsuariosEnSala( sala: string )
  {
    return this.lista.filter( usuario => {
      return usuario.sala === sala;
    });
  }

  // Borrar Usuario

  public borrarUsuario(id: string ) {
    const tempUsuario = this.getUsuario(id);
    this.lista = this.lista.filter( usuario => {
      // regresar todos los usuarios que distinto al id que estoy borrando
      return usuario.id !== id;
    });
    return tempUsuario;
  }
}