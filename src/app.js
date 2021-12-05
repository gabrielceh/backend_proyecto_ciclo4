const express = require('express');

const app = express();
const cors = require('cors');
const usuarios = require('./data_user');

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('El server esta funcionando');
});

/**
 * API Rest Login usuario
 * Descripcion: Permite encontrar al usuario por medio del correo y del password para iniciar sesión
 * Ruta: /login_user
 * Metodo: POST
 * Datos entrada: {email, paswword}
 * Respuesta: {  msg, status, user: user_find }
 */
app.post('/login_user', (req, res) => {
  const { email, password } = req.body;

  const user_find = usuarios.find(
    (usuario) => usuario.email === email && usuario.password === password
  );
  let msg = '';
  let status = '';
  if (!user_find) {
    msg = 'Correo o password no validos';
    status = 400;
    return res.send({ msg, status });
  }

  msg = 'Usuario valido';
  status = 200;

  res.send({ msg, status, user: user_find });
});

/**
 * API Rest Perdfil usuario
 * Descripcion: Permite visualizar el perfil del usuario por medio del correo
 * Ruta: /profile_user/:email
 * Metodo: GET
 * Datos entrada: {email}
 * Respuesta: {  msg, status, user: user_find }
 */
app.get('/user_profile/:email', (req, res) => {
  const { email } = req.params;

  const user_find = usuarios.find((usuario) => usuario.email === email);
  let msg = '';
  let status = '';

  if (!user_find) {
    msg = 'Usuario no encontrado';
    status = 400;
    return res.send({ msg, status });
  }

  msg = 'Perfil usuario encontrado';
  status = 200;

  res.send({ msg, status, user: user_find });
});

/**
 * API Rest Editar usuario
 * Descripcion: Permite editar al usuario por medio del id
 * Ruta: /user_edit
 * Metodo: POST
 * Datos entrada: {email, paswword}
 * Respuesta: {  msg, status, user: user_find }
 */
app.post('/user_edit', (req, res) => {
  const { address, phone, id } = req.body;

  let i = 0;
  let found = false;

  if (isNaN(phone)) {
    return res.send({
      msg: 'El telefono debe ser un numero',
      status: 400,
      usuario: null,
    });
  }

  if (phone.length !== 10) {
    return res.send({
      msg: 'El telefono debe tener 10 digitos',
      status: 400,
      usuario: null,
    });
  }

  for (let user of usuarios) {
    console.log(user);
    if (id === user.id) {
      (user.direccion = address), (user.telefono = phone);
      found = true;
      break;
    }
    i++;
  }

  found
    ? res.send({ msg: 'Usuario editado', status: 200, usuario: usuarios[i] })
    : res.send({ msg: 'Usuario no encontrado', status: 400, usuario: null });
});

module.exports = app;
