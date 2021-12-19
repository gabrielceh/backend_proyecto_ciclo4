const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vacationsSchema = new Schema({
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

});

const vacationsModel = mongoose.model('vacations', vacationsSchema);

exports.vacationsModel = vacationsModel;
