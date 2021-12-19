const { Router } = require('express');

const licenseRoutes = Router();
const { licenseModel } = require('../models/licenseModel');
const User = require('../models/userModel');

licenseRoutes.post("/license_request", (req, res) => {
    const data = req.body
    const {id_usuario} = data
    const license = new licenseModel(data)

    User.findOne({_id:id_usuario}, (error, user) => {
        if (error){
            return res.send({ status: 'error', msg: 'Error al buscar' });
        }
        if (!user) {
            return res.send({ status: 'error', msg: 'Usuario no registrado' });
          }
          if (user) {
            license.save((error) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .send({ status: 'error', msg: 'Error: Solicitud de permiso no generada' });
              }
              res.status(200).send({ status: 'ok', msg: 'Solicitud de permiso guardada' });
            });
          }


    })


} )

licenseRoutes.get("/license_list", (req, res) => {
    licenseModel.find({}, (error, license) => {
        User.populate(license, {path:"id_usuario"}, function(error, license){
            if (error) {
                console.log(error);
                return res.send({ estado: 'error', msg: 'Error al buscar' });
            }
            if (license) {
                const licenseList = license.map((l) => ({
                nombre:l.id_usuario.nombre,
                apellido:l.id_usuario.apellido,
                id_usuario:l.id_usuario._id,
                estado:l.estado,
                tipo_permisos:l.tipo_permisos,
                comentarios:l.comentarios,
                id_permisos:l._id

                }));
                console.log(licenseList)
                res.send({ estado: 'ok', msg: 'Permiso encontrado', data: licenseList });
            }
            if (!license) {
                res.send({ estado: 'ok', msg: 'Permiso NO encontrado' });
            }
        })
    });


})

licenseRoutes.get("/license_search/:id_usuario/:_id", (req, res) => {
    const{id_usuario, _id} = req.params
    licenseModel.findOne({$and:[{id_usuario}, {_id}]}, (error, license) => {
        User.populate(license, {path:"id_usuario"}, function(error, license){
            if (error) {
                console.log(error);
                return res.send({ estado: 'error', msg: 'Error al buscar' });
            }
            if (license) {
                const licenseList = {
                    nombre:license.id_usuario.nombre,
                    apellido:license.id_usuario.apellido,
                    id_usuario:license.id_usuario._id,
                    estado:license.estado,
                    comentarios:license.comentarios,
                    id_permisos:license._id
                }
                console.log(license)
                res.send({ estado: 'ok', msg: 'Permiso encontrado', data: licenseList });
            }
            if (!license) {
                res.send({ estado: 'ok', msg: 'Permisos NO encontrados' });
            }
        })
    })

})

licenseRoutes.post("/license_edit", (req, res) => {
    const{id_permisos, estado} = req.body
    licenseModel.updateOne({_id:id_permisos}, {$set:{estado:estado}}, (error, info) => {
        if (error) {
            console.log(error);
            return res.send({ estado: 'error', msg: 'Error al buscar' });
        }
        else{
            res.send({status:"ok", msg:"actualizado", data:info})
        }
    })
})

exports.licenseRoutes = licenseRoutes


