const { Router } = require('express');

const paymentRoutes = Router();
const { paymentModel } = require('../models/paymentModel');
const User = require('../models/userModel');

paymentRoutes.post('/save', (req, res) => {
  const data = req.body;
  const { id_usuario } = data;
  const payment = new paymentModel(data);

  User.findOne({ _id: id_usuario }, (error, user) => {
    // console.log(user);
    if (error) {
      // console.log(error);
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (!user) {
      return res.send({ status: 'error', msg: 'Usuario no registrado' });
    }
    if (user) {
      payment.save((error) => {
        if (error) {
          // console.log(error);
          return res
            .status(500)
            .send({ status: 'error', msg: 'Error: Pago no generado' });
        }
        res.status(200).send({ status: 'ok', msg: 'Pago guardado' });
      });
    }
  });
});

paymentRoutes.get('/user_payments/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  paymentModel.find({ id_usuario }, (error, pagos) => {
    User.populate(pagos, { path: 'id_usuario' }, function (error, pagos) {
      if (error) {
        return res
          .status(500)
          .send({ status: 'error', msg: 'Error al buscar certificado' });
      }

      if (pagos) {
        // console.log(pagos);
        const periods = pagos.map((p) => ({
          periodo: p.periodo,
        }));
        // console.log(periods);
        res.send({
          status: 'ok',
          msg: 'Certificados encontrados',
          data: periods,
        });
      }

      if (!pagos) {
        res.send({ status: 'ok', msg: 'Certificados NO encontrados' });
      }
    });
  });
});

paymentRoutes.get('/payment_certificate/:id_usuario/:periodo', (req, res) => {
  const { id_usuario, periodo } = req.params;
  paymentModel.findOne(
    { $and: [{ id_usuario }, { periodo }] },
    (error, pagos) => {
      User.populate(pagos, { path: 'id_usuario' }, function (error, pagos) {
        if (error) {
          // console.log(error);
          return res
            .status(500)
            .send({ status: 'error', msg: 'Error al buscar certificado' });
        }

        if (pagos) {
          const data_certificate = {
            nombre: pagos.id_usuario.nombre,
            apellido: pagos.id_usuario.apellido,
            cantidad: pagos.cantidad,
            periodo: pagos.periodo,
            id_certificado: pagos._id,
          };
          res.send({
            status: 'ok',
            msg: 'Certificados encontrados',
            data: data_certificate,
          });
        }

        if (!pagos) {
          res.send({ status: 'ok', msg: 'Certificados NO encontrados' });
        }
      });
    }
  );
});

exports.paymentRoutes = paymentRoutes;
