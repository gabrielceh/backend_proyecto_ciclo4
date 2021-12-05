const express = require('express');

const app = express();
const cors = require('cors');
const usuarios = require('./data_user');
let vacaciones_req = require('./data_vacaciones');

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
 * Datos entrada: {address, phone, id}
 * Respuesta: {  { msg: 'Usuario editado', status: 200, usuario: usuarios[i] }}
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

/**
 * API Rest Solicitud vacaciones
 * Descripcion: Permite solicitar al usuario por medio del id las vacaciones
 * Ruta: /vacations_request
 * Metodo: POST
 * Datos entrada: {id, init_date, final_date}
 * Respuesta: { msg, status, solicitud: new_vac_req }
 */

app.post('/vacations_request', (req, res) => {
  const { id, init_date, final_date } = req.body;

  const id_valid = usuarios.find((us) => us.id === id);

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'usuario no valido';
    status = 400;
    return res.send({ msg, status, solicitud: null });
  }

  const new_vac_req = {
    id: `v-${Date.now()}`,
    id_user: id,
    estado: 'Pendiente',
    fecha_ini: init_date,
    fecha_fin: final_date,
  };

  vacaciones_req.push(new_vac_req);

  msg = 'Solicitud guarada';
  status = 200;

  res.send({ msg, status, solicitud: new_vac_req });
});

/**
 * API Rest Solicitud vacaciones
 * Descripcion: Permite solicitar al usuario por medio del id las vacaciones
 * Ruta: /vacations_request
 * Metodo: POST
 * Datos entrada: {id, init_date, final_date}
 * Respuesta: { msg, status, solicitud: new_vac_req }
 */
app.post('/vacations_response', (req, res) => {
  const { id, vac_res } = req.body;

  let msg = '';
  let status = '';

  const vac_req_found = vacaciones_req.find((vac) => vac.id === id);

  console.log(vac_req_found);

  if (!vac_req_found) {
    msg = 'Solicitud no valida';
    status = 400;
    return res.send({ msg, status, solicitud: null });
  }

  const vac_update = vacaciones_req.map((vac) => {
    if (vac.id === vac_req_found.id) {
      vac.estado = vac_res;
      return vac;
    } else {
      return vac;
    }
  });

  vacaciones_req = [...vac_update];

  res.send({ msg, status, vacaciones_req });
});

module.exports = app;
