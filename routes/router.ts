import { Router, Request, Response } from 'express';
import Server from '../classes/server';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: 'Todo esta bien'
  });
});

router.post('/mensajes', (req: Request, res: Response) => {

  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  const payload = { cuerpo, de }
  const server = Server.instance;
  server.io.emit('mensaje-nuevo', payload)

  res.json({
    ok: true,
    cuerpo,
    de
  })
});

router.post('/mensajes/:id', (req: Request, res: Response) => {

  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = {
    de, 
    cuerpo
  };

  // como es un singleton tenemos la misma instancia que esta corriendo el server.ts
  const server = Server.instance;
  // el in sirve para mandar un mensaje a una persona en particular que se necuentre en un canal particular, en este caso el id
  // si no estuviera palabra in solo emit el mensaje se escribiria a todos los usuarios
  server.io.in(id).emit('mensaje-privado', payload)
  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  })
});

export default router;