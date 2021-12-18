const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  id_usuario: {
    type: Schema.Types.String,
    ref: 'users',
  },
  periodo: {
    type: 'date',
    require: true,
  },
  cantidad: {
    type: 'number',
    require: true,
  },
});

const paymentModel = mongoose.model('payment', paymentSchema);

exports.paymentModel = paymentModel;
