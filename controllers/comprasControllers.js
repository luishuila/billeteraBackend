const { enviarCodigo } = require('../helpers/email.js');
const {
  Usuario,
  Cuentas,
  Transacciones,
  Productos,
  Compras,
  DetallesCompra,
  sqlQuery
} = require('../models/index.js');
const compraPost = async (req, res = response) => {
  try {
    await rechazado(req.body.documento)
  } catch (error) {
    console.log(error)
  }
  try {
    const {
      idProducto,
      cantidad,
      documento
    } = req.body;

    const usuario = await consultaUsarios(documento)
    const productos = await consultaProducto(idProducto)


    if (!usuario) {
      return res.status(400).json({
        error: `El esta cedula no existe: ${ documento}, ya está registrado`
      });
    }

    const totalPrecioProductos = calcultaTotalprecio(productos.precio, cantidad);
    if (totalPrecioProductos > parseInt(usuario.cuentum.saldo)) {
      return res.status(400).json({
        error: `No tiene saldo sufriente`
      });
    }

    if(productos.stock == 0){
      return res.status(400).json({
        error: `No hay productos disponible`
      });
    }

    const compras = await Compras.create({
      total: totalPrecioProductos,
      usuarioId: usuario.id
    })

    const detallesCompra = await DetallesCompra.create({
      precioUnitario: parseInt(productos.precio),
      total: totalPrecioProductos,
      cantidad: cantidad,
      pendiente: "Activo",
      productoId: productos.id,
      compraId: compras.id
    })

    let fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() + 1);
    
    const codigo = generaCodigoAletorio();
    const transacciones = await Transacciones.create({
      monto: totalPrecioProductos,
      tipoTransaccion: "compra",
      token: codigo,
      pendiente: "Activo",
      fechaVencimiento: fechaActual,
      cuentumId: usuario.cuentum.id
    })
    enviarCodigo(usuario.email,usuario.nombre,codigo)

    return res.json({
      msg: `Hola ${usuario.nombre} se envie un codigo de verificacion al siguiente correo o un un enlace para pagar tu compra ${usuario.email}`,
      datos:detallesCompra
    });
  } catch (msg) {

    res.status(400).json({
      error: "Error en guarda " + msg
    });
  }
}

let contado = 0; 

const pagarProductoCodigo = async (req, res = response) => {


  try {
 
    const {
      idDetallesCompra,
      documento,
      codigo
    } = req.body;
   
    contado =contado+1;
 

    const usuarios = await consultaUsarios(documento)


    const transacciones = await Transacciones.findOne({
      where: {
        token: codigo
      }
    })
    
   
   
   
    if (!transacciones && contado != 4) {
      return res.status(400).json({
        msg: `toque expiró fallo`
      });
    }
    if (transacciones){
      let fechaActual = new Date();
      if(fechaActual.getTime()>transacciones.fechaVencimiento.getTime()&& contado != 4){
        return res.status(400).json({
          msg: `toque expiró fallo`
        });
      }
    }
  

    if(contado ==  4){
      contado=0;
      try {
          await rechazado(documento)
         return res.status(400).json({
          msg: "fallo",
          error:msg 
          });
      } catch (error) {
        return res.status(500).json({
          msg:"fallo",
          error:  msg
        });
      }
    } 


    


    const detallesCompra = await DetallesCompra.findOne({
      where: {
        id: idDetallesCompra
      }
    })

    if (!detallesCompra) {
      return res.status(400).json({
        error: `No exite este detallesCompra`
      });
    }
    const productos = await consultaProducto(detallesCompra.productoId)




    const cuentas = await Cuentas.findOne({
      where: {
        id: transacciones.cuentumId
      }
    })
    const compras = await Compras.findOne({
      where: {
        id: detallesCompra.compraId
      }
    })


    productos.update({stock:parseInt(productos.stock)-parseInt(detallesCompra.cantidad)})
    detallesCompra.update({pendiente:"Aprobada"})
    cuentas.update({saldo:parseInt(cuentas.saldo)-parseInt(detallesCompra.total)})
    transacciones.update({pendiente:"Aprobada", token:null, fechaVencimiento:null})
    const datos = {detallesCompra,cuentas,transacciones,usuarios,productos}
    datosEliminar(idDetallesCompra,transacciones.id,detallesCompra.compraId);

 

    return res.json({
      msg: 'Tu compra fue con éxito',
      data:datos
    });
  } catch (msg) {
    res.status(400).json({
      msg: "Fallo" ,
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

const pagarProductoToken = async(req, res = response)=>{
  try {
    contado =contado+1;
  const transacciones = await Transacciones.findOne({
    where: {
      token: req.params.id
    }
  })
  if (!transacciones && contado != 4) {
    return res.status(400).json({
      msg:"Toque expiró fallo",
      error: msg
    });
  }
  if (transacciones){
    let fechaActual = new Date();
    if(fechaActual.getTime()>transacciones.fechaVencimiento.getTime()&& contado != 4){
      return res.status(400).json({
        msg:"Toque expiró fallo",
        error: msg
      });
    }
  }

  if(contado ==  4){
    contado=0;
    try {
      await rechazado(documento)
       return res.status(400).json({
        msg:"Error en paga Rechazado ",
        error: msg
        });
    } catch (error) {
      res.status(400).json({
        msg:"fallo ",
        error: msg
      });
    }
  } 

  const buscaId = await consultaId(req.params.id);

    const {idDetallesCompra,idUsuario,idCuenta} = buscaId[0]
    const detallesCompra = await DetallesCompra.findOne({
      where: {
        id: idDetallesCompra
      }
    })

    const productos = await consultaProducto(detallesCompra.productoId)


    const cuentas = await Cuentas.findOne({
      where: {
        id: transacciones.cuentumId
      }
    })
    const compras = await Compras.findOne({
      where: {
        id: detallesCompra.compraId
      }
    })
   
    const usuarios =  await Usuario.findOne({
      where: {
        id: idUsuario
      }
    })
    productos.update({stock:parseInt(productos.stock)-parseInt(detallesCompra.cantidad)})
    detallesCompra.update({pendiente:"Aprobada"})
    cuentas.update({saldo:parseInt(cuentas.saldo)-parseInt(detallesCompra.total)})
    transacciones.update({pendiente:"Aprobada", token:null, fechaVencimiento:null})
    const datos = {detallesCompra,cuentas,transacciones,usuarios,productos}
    datosEliminar(idDetallesCompra,transacciones.id,detallesCompra.compraId);

    return res.json({
      msg: 'Tu compra fue con éxito',
      data:datos
    });

  } catch (msg) {

    res.status(400).json({
      msg:"Error en paga fallo ",
      error: msg
    });
  }

}

const consultaId = async(token)=>{
 
  try {
   
    return  await sqlQuery.query(`select ct.id as idCuenta, us.id as idUsuario, dp.compraId, dp.id as idDetallesCompra ,tf.id as iDtransacciones
    from transacciones as tf 
    inner join cuenta as ct on ct.id = tf.cuentumId 
    inner join usuarios as us on us.id = ct.usuarioId
    inner join compras cp on  us.id = cp.usuarioId
     inner join detallescompras dp on dp.compraId =  cp.id
    where tf.token = '${token}' and tf.pendiente = 'Activo'
    and dp.pendiente = 'Activo'  `
    , { type: sqlQuery.QueryTypes.SELECT })  
  } catch (msg) {
    res.status(500).json({
      msg:"Error Service",
      error:msg 
    });
  }
}

const limpiarDatosErrores = async(documentos)=>{
 
  try {
   
    return  await sqlQuery.query(`select dp.compraId,dp.id as idDetallesCompra ,tf.id as iDtransacciones 
    from usuarios as us left join cuenta as ct on ct.usuarioId = us.id 
    left join transacciones as tf on ct.id = tf.cuentumId 
    left join compras cp on cp.usuarioId = us.id 
    left join detallescompras dp on dp.compraId =  cp.id 
    where us.documento = ${documentos} and tf.deletedAt is null and cp.deletedAt IS NULL   and dp.deletedAt IS NULL  `
    , { type: sqlQuery.QueryTypes.SELECT })  
  } catch (msg) {
    res.status(500).json({
      msg:"Error Service",
      error:msg 
    });
  }
}
const datosEliminar = async(idDetallesCompra,iDtransacciones,compraId)=>{
  const detallesCompra = await DetallesCompra.findOne({
    where: {
      id: idDetallesCompra
    }
  })

  const transacciones = await Transacciones.findOne({
    where: {
      id: iDtransacciones
    }
  })
   const compras = await Compras.findOne({
      where: {
        id: compraId
      }
    })
  compras.destroy()
  detallesCompra.destroy()
  transacciones.destroy()  
}

const generaCodigoAletorio = () => {
  return Math.floor(100000 + Math.random() * 900000)
}
const calcultaTotalprecio = (precio, cantidad) => {
  return parseInt(precio) * parseInt(cantidad);
}


const consultaProducto = async (idProducto) => {
  return await Productos.findOne({
    where: {
      id: idProducto
    }

  })
}
const consultaUsarios = async (documento) => {
  return await Usuario.findOne({
    where: {
      documento: documento
    },
    include: [{
      model: Cuentas
    }, ],
  })
}


module.exports = {
  compraPost,
  pagarProductoCodigo,
  pagarProductoToken
}


