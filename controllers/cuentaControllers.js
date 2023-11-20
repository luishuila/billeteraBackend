const {
  response,
  request
} = require('express');

const {Usuario,Cuentas} = require('../models/index.js');

const cuentaPost = async(req, res = response) => {
  try {
    const { saldo,documento } = req.body;

    const usuario = await consultaUsarios(documento)

    if (!usuario) {
      return res.status(400).json({
        msg: `El número de la cedula ${ documento} no se encuentra registrado `
      });
    }
   
     if(usuario.cuentum == null){
       const  cuenta =   new  Cuentas({saldo, usuarioId:usuario.id})
       await cuenta.save()
     }else{
       await Cuentas.update({saldo: parseInt(usuario.cuentum.saldo)+parseInt(saldo)},{where :{id:usuario.cuentum.id}})
    }
    const usuarioSaldo = await consultaUsarios(documento)
    return res.json({msg: "Tu recarga fue con éxito ", usuario:usuarioSaldo});
  } catch (msg) {
    
    res.status(400).json({
      msg:"Fallo",
      error:msg 
    });
  }
}


const consultaSaldo = async(req, res = response)=>{
  try {
  
    const { documento } = req.body;

    const usuario = await consultaUsarios(documento)

    if (!usuario) {
      return res.status(400).json({
        msg: `El número de la cedula ${ documento} no se encuentra registrado `
      });
    }

    return res.json({data:usuario});
  } catch (msg) {
    res.status(500).json({
      msg:"Fallo",
      error: msg
    });
  }
 }



const consultaUsarios = async(documento)=>{
 return await Usuario.findOne({
  where: {documento:documento }, 
  include: [
    {
      model: Cuentas
    },
    ],
  })
}

module.exports = {cuentaPost,consultaSaldo}