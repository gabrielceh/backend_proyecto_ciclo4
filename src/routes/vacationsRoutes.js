const { Router } = require('express');

const vacationsRoutes = Router();
const { vacationsModel } = require('../models/vacationsModels');
const User = require('../models/userModel');

vacationsRoutes.post('/vacations_request', (req, res) => {
  const data = req.body;
  const { id_usuario } = data;
  const vacations = new vacationsModel(data);

  User.findOne({ _id: id_usuario }, (error, user) => {
    if (error) {
      return res.send({ status: 'error', msg: 'Error al buscar' });
    }
    if (!user) {
      return res.send({ status: 'error', msg: 'Usuario no registrado' });
    }
    if (user) {
      vacations.save((error) => {
        if (error) {
          // console.log(error);
          return res
            .status(500)
            .send({
              status: 'error',
              msg: 'Error: Solicitud de Vacación no generada',
            });
        }
        res
          .status(200)
          .send({ status: 'ok', msg: 'Solicitud de vacación guardada' });
      });
    }
  });
});

vacationsRoutes.get('/vacations_list', (req, res) => {
  vacationsModel.find({}, (error, vacations) => {
    User.populate(
      vacations,
      { path: 'id_usuario' },
      function (error, vacations) {
        if (error) {
          // console.log(error);
          return res.send({ estado: 'error', msg: 'Error al buscar' });
        }
        if (vacations) {
          const vacationsList = vacations.map((v) => ({
            nombre: v.id_usuario.nombre,
            apellido: v.id_usuario.apellido,
            id_usuario: v.id_usuario._id,
            estado: v.estado,
            id_vacaciones: v._id,
          }));
          // console.log(vacationsList)
          res.send({
            estado: 'ok',
            msg: 'Vacaciones encontradas',
            data: vacationsList,
          });
        }
        if (!vacations) {
          res.send({ estado: 'ok', msg: 'Vacaciones NO encontradas' });
        }
      }
    );
  });
});

vacationsRoutes.get('/vacations_search/:id_usuario/:_id', (req, res) => {
  const { id_usuario, _id } = req.params;
  vacationsModel.findOne(
    { $and: [{ id_usuario }, { _id }] },
    (error, vacations) => {
      User.populate(
        vacations,
        { path: 'id_usuario' },
        function (error, vacations) {
          if (error) {
            // console.log(error);
            return res.send({ estado: 'error', msg: 'Error al buscar' });
          }
          if (vacations) {
            const vacationsList = {
              nombre: vacations.id_usuario.nombre,
              apellido: vacations.id_usuario.apellido,
              id_usuario: vacations.id_usuario._id,
              estado: vacations.estado,
              id_vacaciones: vacations._id,
            };
            // console.log(vacations)
            res.send({
              estado: 'ok',
              msg: 'Vacaciones encontradas',
              data: vacationsList,
            });
          }
          if (!vacations) {
            res.send({ estado: 'ok', msg: 'Vacaciones NO encontradas' });
          }
        }
      );
    }
  );
});

vacationsRoutes.post('/vacations_edit', (req, res) => {
  const { id_vacaciones, estado } = req.body;
  vacationsModel.updateOne(
    { _id: id_vacaciones },
    { $set: { estado: estado } },
    (error, info) => {
      if (error) {
        // console.log(error);
        return res.send({ estado: 'error', msg: 'Error al buscar' });
      } else {
        res.send({ status: 'ok', msg: 'actualizada', data: info });
      }
    }
  );
});

exports.vacationsRoutes = vacationsRoutes;
