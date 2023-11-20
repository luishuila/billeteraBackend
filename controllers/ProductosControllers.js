const {  Usuario,
  Cuentas,
  Transacciones,
  Productos,
  Compras,
  DetallesCompra,
  sqlQuery} = require('../models/index.js');
  const path = require('path');
  const fs = require('fs');

  const {response} = require('express');
  const {subirArchivo} = require('../helpers/uploads');
  const {eliminarDisco} = require('../util/eliminarArchivo')
  const {buscarIdToken} = require('../util/buscarIdToken')
  
const listaProductos = async(req, res = response) => {
  try {
    const data = await Productos.findAll();
    return res.json(data);
  } catch (msg) {
    
    res.status(500).json({
      msg:"service",
      error:msg
    });
  }
}
contado = 0;
const buscarProducto = async(req, res = response)=>{
  try {
    contado =contado+1;

  const transacciones = await Transacciones.findOne({
    where: {
      token: req.params.id
    }
  })

  if (!transacciones && contado != 4) {
    return res.status(400).json({
      msg:"Toque expiró fallo"
    });
  }
  if (transacciones){
    let fechaActual = new Date();
    if(fechaActual.getTime()>transacciones.fechaVencimiento.getTime()&& contado != 4){
      return res.status(400).json({
        msg:"Toque expiró fallo"
      });
    }
  }

  if(contado ==  4){
    contado=0;
    try {
        await rechazado(documento)
        return res.status(400).json({
          msg: "Rechazado " 
          });
      } catch (error) {
        return res.status(500).json({
          msg:"fallo",
          error:  msg
        });
    }
  } 

     const buscaId = await consultaId(req.params.id);

    const {idDetallesCompra} = buscaId[0]
    const detallesCompra = await DetallesCompra.findOne({
      where: {
        id: idDetallesCompra
      }
    })

    const productos = await consultaProducto(detallesCompra.productoId)

    return res.json(productos);

  } catch (msg) {

    res.status(400).json({
      msg:"fallo",
      error:msg 
    });
  }

}

const rechazado =  async(documento)=>{

  let query = await limpiarDatosErrores(documento)

  for (const data of query) {

      const detallesCompra = await DetallesCompra.findOne({
        where: {
          id: data.idDetallesCompra
        }
      })
      console.log(data.idDetallesCompra)
      detallesCompra.update({pendiente:"Rechazado"})
      detallesCompra.destroy()


      const transacciones = await Transacciones.findOne({
        where: {
          id: data.iDtransacciones
        }
      })
      transacciones.update({pendiente:"Rechazado", token:null, fechaVencimiento:null})
      transacciones.destroy()  

        const compras = await Compras.findOne({
          where: {
            id: data.compraId
          }
        })
        compras.destroy()

      
    }
  
}

const consultaProducto = async (idProducto) => {
  return await Productos.findOne({
    where: {
      id: idProducto
    }

  })
}
const consultaId = async(token)=>{
 
  try {
   
    return  await sqlQuery.query(`   select dp.compraId, dp.id as idDetallesCompra ,tf.id as iDtransacciones
    from transacciones as tf 
    inner join cuenta as ct on ct.id = tf.cuentumId 
    inner join usuarios as us on us.id = ct.usuarioId
    inner join compras cp on  us.id = cp.usuarioId
     inner join detallescompras dp on dp.compraId =  cp.id
    where tf.token = '${token}' and tf.pendiente = 'Activo'
    and dp.pendiente = 'Activo'  `
    , { type: sqlQuery.QueryTypes.SELECT })  
  } catch (msg) {
    res.status(400).json({
      msg:"Error Service",
      error:msg 
    });
  }
}

const guardaProducto = async(req, res = response) => {
  try {

    const {precio,nombre,stock} = req.body;

     const id = await buscarIdToken(req)

 
      
        const data = await subirArchivo(req.files.archivo, ['jpg', 'jpeg','png'], 'imgs');

        let result = new Productos({
          url: data.url,
          nombreArchivo: data.nombreOriginalImagen,
          nombreKeyArchivo:data.nombreArchivo,
          stock  : stock,
          nombre:nombre,
          precio:precio,
          usuarioId: id
        });
        await result.save();

      
    
    

    return res.json({
      msg:"Se guardo el producto éxito" 
    });

  } catch (msg) {
    
    res.status(400).json({
      msg:"Fallo en guarda producto",
      error: "Error en guarda "+msg
    });
  }

}
const eliminarProducto = async (req, res = response) => {
  const {id } = req.params;
  try {

    const data = await Productos.findOne({
      where: {
        id: id
      }
    })
      
     if(data != null){
  
      if (data.url != null) {

          await eliminarDisco(data.url)
    
     
      }
        await data.destroy()
      
       return res.json({msg:"Se elimina con exito"});
     }
    return res.json({msg:"El este archivo no exite"});
   
  } catch (error) {
    return  res.status(400).json({
      error
    });
  }

}
module.exports = {listaProductos,buscarProducto,guardaProducto,eliminarProducto}