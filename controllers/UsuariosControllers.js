const {
  response,
  request
} = require('express');

const {Usuario} = require('../models/index.js');


const usuariosPost = async(req, res = response) => {
  try {
  
    const { email, nombre, password,documento,celular } = req.body;
    
    const usuarios = await Usuario.findOne({
        where : {email:email }  
    });
    const documentos = await Usuario.findOne({
      where : {documento:documento }  
    });
    if (usuarios) {
      return res.status(400).json({
        error: `El correo: ${ usuarios.email }, ya está registrado`
      });
    }
    if (documentos) {
      return res.status(400).json({
        error: `La cedula : ${ documentos.documento }, ya está registrado`
      });
    }
    
    let rol ="users" ;
    const usuario = new Usuario({ email, nombre, password,rol,documento,celular });
    await usuario.save();
    return res.json({usuario});
  } catch (msg) {
    
    res.status(400).json({
      error: "Error en guarda "+msg
    });
  }
}


const usuariosGet = async(req, res = response) => {
  try {
    const data = await Usuario.findAll();
    return res.json({data});
  } catch (msg) {
    
    res.status(400).json({
      error: "Error en guarda "+msg
    });
  }
}


const usuariosDelete = async(req, res = response) => {
  try {
    const {id } = req.params;
    const data = await Usuario.findOne({
      where: {
        id: id
      }
    })
    if(data !== null){
      await data.destroy()
      return res.json({msg:"Se elimina con exito"});
    }
    return res.status(400).json({msg:"Este usuario no existe"});
  } catch (error) {
    
    return res.status(400).json({
      msg:"Fallo"
    });
  }
}
module.exports = {usuariosPost,usuariosGet,usuariosDelete}