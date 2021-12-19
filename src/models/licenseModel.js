const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const licenseSchema = new Schema({
  id_usuario: {
    type: Schema.Types.String,
    ref: 'users',
  },
  fecha_inicio: {
    type: 'date',
    require: true,
  },
  fecha_fin: {
    type: 'date',
    require: true,
  },
  estado: {
    type: 'string',
    require: true,
  },
  tipo_permisos: {
    type: 'string',
    require: true,
  },
  comentarios: {
    type: 'string',
    require: true,
  },

});

const licenseModel = mongoose.model('license', licenseSchema);

exports.licenseModel = licenseModel;
