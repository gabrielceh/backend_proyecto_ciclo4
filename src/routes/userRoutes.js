const { Router } = require('express');
const { userModel } = require('../models/userModel');

const { compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const User = require('../models/userModel');

const userRoutes = Router();

/**
 * API Rest Creación de usuarios
 * Descripcion: Permite crear usuarios
 * Ruta: /user_create
 * Metodo: POST
 * Datos entrada: { nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo }
 * Respuesta: { msg, status, data: new_user }
 */
userRoutes.post('/user_create', (req, res) => {
  const data = req.body;
  const { _id, email } = data;
  const user = new User(data);

  User.findOne({ $or: [{ _id }, { email }] }, (error, u) => {
    if (error) {
      console.log(error);
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (u) {
      return res.send({
        status: 'ok',
        msg: `El documento "${_id}" o email "${email}" estan en la base de datos`,
      });
    }

    if (!u) {
      user.save((error) => {
        if (error) {
          console.log(error);
          return res.send({ status: 'error', msg: 'Error al guardar usuario' });
        }
        res.send({ status: 'ok', msg: 'Usuario guardado' });
      });
    }
  });
});

/**
 * API Rest Perfil usuario
 * Descripcion: Permite visualizar el perfil del usuario por medio del correo
 * Ruta: /profile_user/:email
 * Metodo: GET
 * Datos entrada: {email}
 * Respuesta: {  msg, status, user: user_find }
 */
userRoutes.get('/user_profile/:email', (req, res) => {
  //Capturamos la variable name mediante req.params.nombreVarible
  const { email } = req.params;

  User.findOne({ email }, (error, user) => {
    if (error) {
      console.log(error);
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (user) {
      const userProfile = {
        nombre: user.nombre,
        apellido: user.apellido,
        _id: user._id,
        tipo_usuario: user.tipo_usuario,
        email: user.email,
        direccion: user.direccion,
        telefono: user.telefono,
        salario: user.salario,
        cargo: user.cargo,
      };
      res.send({ status: 'ok', msg: 'Usuario encontrado', data: userProfile });
    }
    if (!user) {
      res.send({ status: 'ok', msg: 'usuario NO encontrado' });
    }
  });
});

/**
 * API Rest Editar usuario
 * Descripcion: Permite editar al usuario por medio del id
 * Ruta: /user_edit
 * Metodo: POST
 * Datos entrada: {address, phone, id}
 * Respuesta: {  { msg: 'Usuario editado', status: 200, usuario: usuarios[i] }}
 */
userRoutes.post('/profile_edit', (req, res) => {
  const { _id, address, phone } = req.body;
  // console.log(req.body);
  User.updateOne(
    { _id: _id },
    { $set: { direccion: address, telefono: phone } },
    (error, info) => {
      if (error) {
        console.log(error);
        return res.send({ estado: 'error', msg: 'Error al editar' });
      } else {
        res.send({ status: 'ok', msg: 'actualizada', data: info });
      }
    }
  );
});

/**
 * API Rest Lista usuarios
 * Descripcion: Permite visualizar todos los usuarios del sistema
 * Ruta: /user_list
 * Metodo: GET
 * Datos entrada:
 * Respuesta: {  msg, status, data: user_find }
 */
userRoutes.get('/user_list', (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log(error);
      return res.send({ estado: 'error', msg: 'Error al buscar' });
    }
    if (users) {
      let usersList = users.map((u) => ({
        _id: u._id,
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        direccion: u.direccion,
        telefono: u.telefono,
        tipo_usuario: u.tipo_usuario,
        salario: u.salario,
        cargo: u.cargo,
        fecha_ingreso: `${u.fecha_ingreso.getFullYear()}-${
          u.fecha_ingreso.getMonth() + 1 < 10
            ? '0' + (u.fecha_ingreso.getMonth() + 1)
            : u.fecha_ingreso.getMonth() + 1
        }-${
          u.fecha_ingreso.getDate() < 10
            ? '0' + u.fecha_ingreso.getDate()
            : u.fecha_ingreso.getDate()
        }`,
      }));
      res.send({ estado: 'ok', msg: 'Usuarios encontrados', data: usersList });
    }
    if (!users) {
      res.send({ estado: 'ok', msg: 'Usuarios NO encontrados' });
    }
  });
});

/**
 * API Rest Eliminar usuarios
 * Descripcion: Permite eliminar usuarios por medio del id
 * Ruta: /user_delete
 * Metodo: POST
 * Datos entrada: { id }
 * Respuesta: { msg, status }
 */
userRoutes.post('/user_delete', (req, res) => {
  const { _id } = req.body;

  User.findOne({ _id }, (error, user) => {
    if (error) {
      console.log(error);
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (!user) {
      return res.send({
        status: 'ok',
        msg: 'Usuario No encontrado',
      });
    }

    if (user) {
      user.deleteOne({ _id });
      return res.send({ status: 'ok', msg: 'Usuario eliminado' });
    }
  });
});

/**
 * API Rest Login usuario
 * Descripcion: Permite encontrar al usuario por medio del correo y del password para iniciar sesión
 * Ruta: /login_user
 * Metodo: POST
 * Datos entrada: {email, paswword}
 * Respuesta: {  msg, status, user: user_find }
 */
userRoutes.post('/login_user', async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ status: 400, msg: 'Credenciales invalidadas' });
  }

  const passwordOK = await compare(password, user.password);

  if (passwordOK === true) {
    const token = sign(
      {
        tipo_usuario: user.tipo_usuario,
      },
      process.env.JWT_SECRET_KEY
    );

    const userProfile = {
      nombre: user.nombre,
      apellido: user.apellido,
      _id: user._id,
      tipo_usuario: user.tipo_usuario,
      email: user.email,
      direccion: user.direccion,
      telefono: user.telefono,
      salario: user.salario,
      cargo: user.cargo,
    };
    return res
      .status(200)
      .json({ status: 200, msg: 'Usuario valido', data: userProfile, token });
  }

  return res.status(401).json({ status: 401, msg: 'Credenciales invalidadas' });
});

userRoutes.get('/jobs_certificates/:_id', async (req, res) => {
  const { _id } = req.params;
  User.findOne({ _id }, (error, user) => {
    if (error) {
      console.log(error);
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (!user) {
      return res.send({
        status: 'ok',
        msg: 'Usuario No encontrado',
      });
    }

    if (user) {
      let certificado = {
        nombre: user.nombre,
        apellido: user.apellido,
        id: user._id,
        cargo: user.cargo,
        fecha_ingreso: user.fecha_ingreso,
        salario: user.salario,
      };
      return res.send({
        status: 'ok',
        msg: 'Certificado generado',
        data: certificado,
      });
    }
  });
});

userRoutes.get('/user_search/:_id', (req, res) => {
  const { _id } = req.params;

  User.findOne({ _id }, (error, user) => {
    if (error) {
      console.log(error);
      return res.send({ estado: 'error', msg: 'Error al buscar' });
    }
    if (user) {
      const usersList = {
        nombre: user.nombre,
        apellido: user.apellido,
        _id: user._id,
        tipo_usuario: user.tipo_usuario,
        email: user.email,
        direccion: user.direccion,
        telefono: user.telefono,
        salario: user.salario,
        cargo: user.cargo,
      };
      res.send({ estado: 'ok', msg: 'Usuario encontrado', data: usersList });
    }
    if (!user) {
      res.send({ estado: 'ok', msg: 'Usuario NO encontrado' });
    }
  });
});

userRoutes.post('/edit_user', (req, res) => {
  const {
    _id,
    nombre,
    apellido,
    email,
    direccion,
    telefono,
    cargo,
    salario,
    fecha_ingreso,
    tipo_usuario,
  } = req.body;
  // console.log(req.body);
  User.updateOne(
    { _id: _id },
    {
      $set: {
        nombre: nombre,
        apellido: apellido,
        email: email,
        direccion: direccion,
        telefono: telefono,
        tipo_usuario: tipo_usuario,
        cargo: cargo,
        salario: salario,
        fecha_ingreso: fecha_ingreso,
      },
    },
    (error, info) => {
      if (error) {
        console.log(error);
        return res.send({ estado: 'error', msg: 'Error al editar' });
      } else {
        res.send({ status: 'ok', msg: 'actualizada', data: info });
      }
    }
  );
});

exports.userRoutes = userRoutes;
