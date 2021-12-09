const express = require('express');

const app = express();
const cors = require('cors');
let usuarios = require('./data_user');
let vacaciones_req = require('./data_vacaciones');
let permisos_req = require('./data_permisos');
let pagos_req = require('./data_pagos');


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
 * API Rest Perfil usuario
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
app.post('/profile_edit', (req, res) => {
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

  msg = 'Solicitud guardada';
  status = 200;

  res.send({ msg, status, solicitud: new_vac_req });
});

/**
 * API Rest  Respuesta vacaciones
 * Descripcion: Permite responder a las solicitudesde de vacaciones haciendo las busqueda por id
 * Ruta: /vacations_response
 * Metodo: POST
 * Datos entrada: { id, vac_res }
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

/**
 * API Rest Solicitud permisos
 * Descripcion: Permite solicitar al usuario por medio del id los permisos
 * Ruta: /license_request
 * Metodo: POST
 * Datos entrada: {id, init_date_license, final_date_license, license_type}
 * Respuesta: { msg, status, solicitud: new_lice_req }
 */

 app.post('/license_request', (req, res) => {
  const { id, init_date_license, final_date_license, license_type} = req.body;

  const id_valid = usuarios.find((us) => us.id === id);
  console.log(id_valid)

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'usuario no valido';
    status = 400;
    return res.send({ msg, status, solicitud: null });
  }

  const new_lice_req = {
    id: `p-${Date.now()}`,
    id_user: id,
    estado: 'Pendiente',
    fecha_ini: init_date_license,
    fecha_fin: final_date_license,
    tipo_permisos: license_type,
    comentarios: ""
  };

  permisos_req.push(new_lice_req);

  msg = 'Solicitud guardada';
  status = 200;

  res.send({ msg, status, solicitud: new_lice_req });
});

/**
 * API Rest Solicitud permisos
 * Descripcion: Permite responder a las solicitudesde de permisos haciendo la busqueda por id
 * Ruta: /license_response
 * Metodo: POST
 * Datos entrada: { id, lice_res, comments }
 * Respuesta: { msg, status, solicitud: new_lice_req }
 */
app.post('/license_response', (req, res) => {
  const { id, lice_res, comments } = req.body;

  let msg = '';
  let status = '';

  const lice_req_found = permisos_req.find((lice) => lice.id === id);

  console.log(lice_req_found);

  if (!lice_req_found) {
    msg = 'Solicitud no valida';
    status = 400;
    return res.send({ msg, status, solicitud: null });
  }

  let i = 0
  const lice_update = permisos_req.map((lice,index) => {
    if (lice.id === lice_req_found.id) {
      lice.estado = lice_res;
      lice.comentarios = comments;
      i = index;
      return lice;
    } else {
      return lice;
    }
  });

  msg = 'Solicitud modificada';
  status = 200;

  permisos_req = [...lice_update];

  res.send({ msg, status, permiso: permisos_req[i] });
});

/**
 * API Rest Solicitud certificado laboral
 * Descripcion: Permite realizar la solicitud de certifiación laboral por medio del id
 * Ruta: /job_certificate/:id
 * Metodo: GET
 * Datos entrada: { id }
 * Respuesta: { msg, status, data }
 */

app.get('/job_certificate/:id',(req, res) => {

  const { id } = req.params;
  const id_valid = usuarios.find((us) => us.id === id);

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'usuario no valido';
    status = 400;
    return res.send({ msg, status, data: null });
  }
    let data = {
      id: id, nombre: id_valid.nombre, apellido: id_valid.apellido, fecha_ingreso: id_valid.fecha_ingreso, salario: id_valid.salario, cargo: id_valid.cargo
    }


    msg = 'Solicitud exitosa';
    status = 200;
    res.send({ msg, status, data });

})

/**
 * API Rest Creación de usuarios
 * Descripcion: Permite crear usuarios
 * Ruta: /user_create
 * Metodo: POST
 * Datos entrada: { nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo }
 * Respuesta: { msg, status, data: new_user }
 */
app.post('/user_create',(req, res) => {
  const{ nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo } = req.body
  const id_valid = usuarios.find((us) => us.id === id);

  let msg = '';
  let status = '';

  if (id_valid) {
    msg = 'id o documento ya registrado en la base de datos';
    status = 400;
    return res.send({ msg, status, data: null });
  }

  const email_valid = usuarios.find((us) => us.email === email);

  if (email_valid) {
    msg = 'email ya registrado en la base de datos';
    status = 400;
    return res.send({ msg, status, data: null });
  }

  let new_user = {nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo} 
  usuarios.push(new_user)
  msg = "Usuario agregado con exito"
  status = 200
  res.send({ msg, status, data: new_user })

})

/**
 * API Rest Editar usuarios
 * Descripcion: Permite editar usuarios
 * Ruta: /user_edit
 * Metodo: POST
 * Datos entrada: { nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo }
 * Respuesta: { msg, status, data: new_user }
 */
app.post('/user_edit',(req, res) => {
  const{ nombre, apellido, id, tipo_usuario, email, password, direccion, telefono, fecha_ingreso, salario, cargo } = req.body
  const id_valid = usuarios.find((us) => us.id === id);

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'Usuario no encontrado';
    status = 400;
    return res.send({ msg, status, data: null });

  }

  let i = 0
  const user_update = usuarios.map((user, index) => {
    if (user.id === id_valid.id) {
      user.nombre = nombre
      user.apellido = apellido
      user.id = id
      user.tipo_usuario = tipo_usuario
      user.email = email
      user.password = password
      user.direccion = direccion
      user.telefono = telefono
      user.fecha_ingreso = fecha_ingreso
      user.salario = salario
      user.cargo = cargo

      i = index
      return user;
    } else {
      return user;
    }
  })
  usuarios = [...user_update]
  msg = 'Usuario actualizado con exito';
    status = 200;
    res.send({ msg, status, data: usuarios[i] });
})

/**
 * API Rest Eliminar usuarios
 * Descripcion: Permite eliminar usuarios por medio del id
 * Ruta: /user_delete
 * Metodo: POST
 * Datos entrada: { id }
 * Respuesta: { msg, status }
 */

app.post('/user_delete',(req, res) => {
  const{ id } = req.body
  const id_valid = usuarios.find((us) => us.id === id);

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'Usuario no encontrado';
    status = 400;
    return res.send({ msg, status, data: null });

  }
  
  let usuario_eliminado = usuarios.filter(us => us.id !== id );
  usuarios = [...usuario_eliminado]
  msg = 'Usuario eliminado con éxito';
    status = 200;
    res.send({ msg, status });
})


/**
 * API Rest Solicitud certificado de pago
 * Descripcion: Permite solicitar el certificado de pago por medio del id
 * Ruta: /payment_certificate
 * Metodo: POST
 * Datos entrada: { id, periodo }
 * Respuesta: { msg, status, data: pagos_usuarios }
 */

 app.post('/payment_certificate',(req, res) => {
  const{ id, periodo } = req.body
  const id_valid = pagos_req.find((us) => us.id_user === id); //Validar si el id existe

  let msg = '';
  let status = '';

  if (!id_valid) {
    msg = 'Usuario no encontrado';
    status = 400;
    return res.send({ msg, status, data: null });
    
  }

  let pagos_usuarios = pagos_req.filter(us => us.id_user === id && us.periodo === periodo);
  

  if (pagos_usuarios.length <= 0) {
    msg = 'Información no encontrada';
    status = 400;
    return res.send({ msg, status, data: null });
    
  }

  msg = 'Certificado enviado con éxito';
  status = 200;
  res.send({ msg, status, data: pagos_usuarios });

})  


/**
 * API Rest Solicitud reporte de salarios
 * Descripcion: Permite filtrar según salario menor o mayor
 * Ruta: /salary_reports
 * Metodo: POST
 * Datos entrada: { salario_filtro, filtro }
 * Respuesta1: { msg, status, data: reportes_mas }
 * Respuesta2: { msg, status, data: reportes_menos }
 */

app.post('/salary_reports',(req, res) => {
  const{ salario_filtro, filtro } = req.body

  let status = ""
  let msg = ""

  if(isNaN(salario_filtro)){
    msg = `El salario ingresado no es un dato válido`
    status = 401
    return res.send({ msg, status });

  }  


  switch(filtro) {

    case "MORE":
      const reportes_mas = usuarios.filter(us => us.salario > salario_filtro);
      if (reportes_mas.length <= 0) {
          msg = `No se encontraron reportes con un salario mayor a: "${salario_filtro}"`
          status = 200;
          return res.send({ msg, status, data: reportes_mas });
      }
      else { 
        msg = `Reporte con un salario mayor a: "${salario_filtro}"`;
        status = 200;
        return res.send({ msg, status, data: reportes_mas });
      }
      
    case "LESS":
      const reportes_menos = usuarios.filter(us => us.salario <= salario_filtro);
      if (reportes_menos.length <= 0) {
          msg = `No se encontraron reportes con un salario menor a: "${salario_filtro}"` //comillas template string
          status = 200;
          return res.send({ msg, status, data: reportes_menos });
      }
      else { 
        msg = `Reporte con un salario menor a: "${salario_filtro}"`;
        status = 200;
        return res.send({ msg, status, data: reportes_menos });
      }   

      default: 
        msg = `Solicitud invalida`;
        status = 400;
        return res.send({ msg, status });

  } 
})


/**
 * API Rest dashboard
 * Descripcion: Permite visualizar tableros de control (dashboard)
 * Ruta: /dashboard
 * Metodo: GET
 * Datos entrada: { cantidad_empleados, solicitud_permisos_activos, solicitud_vacaciones_pendientes }
 * Respuesta: {  }
 * 
 */

 app.get('/dashboard',(req, res) => {
  const{ cantidad_empleados, solicitud_permisos_activos, solicitud_vacaciones_pendientes } = req.body

  let status = ""
  let msg = ""


 })  











module.exports = app;
