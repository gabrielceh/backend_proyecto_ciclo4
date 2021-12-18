const { hash, genSalt } = require('bcrypt');
const { model, Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new Schema({
  nombre: {
    type: 'string',
    require: true,
  },
  apellido: {
    type: 'string',
    require: true,
  },
  id: {
    type: 'number',
    unique: true,
    require: true,
  },
  tipo_usuario: {
    type: 'number',
    require: true,
  },
  email: {
    type: 'string',
    unique: true,
    require: true,
  },
  password: {
    type: 'string',
    require: true,
  },
  direccion: {
    type: 'string',
    require: true,
  },
  telefono: {
    type: 'number',
    require: true,
  },
  fecha_ingreso: {
    type: 'date',
    require: true,
  },
  salario: {
    type: 'number',
    require: true,
  },
  cargo: {
    type: 'string',
    require: true,
  },
});

userSchema.pre('save', async function (next) {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

const userModel = model('users', userSchema);

exports.userModel = userModel;

module.exports = mongoose.model('users', userSchema);
