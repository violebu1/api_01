import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json');

import express from 'express'
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234
const usuarios = require('./datos.json');
app.get('/', (req, res) => {
    res.status(200).send(html)
})


//GET

// 10 STOCK TOTAL DE PRODUCTOS Y SU VALOR EN SUMATORIA
app.get("/productos/total", (req, res) => {
  try {
    let productos = datos.productos;
    let productosStock = productos.length;
    let precioTotal = productos.reduce((total, producto) => {
      return total + producto.precio;
    }, 0);
    precioTotal = parseFloat(precioTotal.toFixed(2));
    res.status(200).json({
      productosStock,
      precioTotal,
    });
  } catch (error) {
    res.status(204).json({ message: error });
  }
});
//LISTADO PRODUCTOS
app.get('/productos/', (req, res) =>{
    try {
        let allProducts = datos.productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})
// 6 PRODUCTO POR PRECIO
app.get('/productos/precio/:id', (req, res) => {
  try {
      let productoId = parseInt(req.params.id)
      let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)
      
      if (productoEncontrado) {
          res.status(200).json({"precio": productoEncontrado.precio})
      } else {
          res.status(204).json({"message": "Producto no encontrado"})
      }

  } catch (error) {
      res.status(204).json({"message": error})
    }
})
// 7 NOMBRE DE PRODUCTO POR ID
app.get('/productos/nombre/:id', (req, res) => {
  try {
      let productoId = parseInt(req.params.id)
      let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)
      
      if (productoEncontrado) {
          res.status(200).json({"nombre": productoEncontrado.nombre})
      } else {
          res.status(204).json({"message": "Producto no encontrado"})
      }

  } catch (error) {
      res.status(204).json({"message": error})
    }
})
//PRODUCTOS X ID
app.get('/productos/:id', (req, res) => {
  try {
      let productoId = parseInt(req.params.id)
      let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

      res.status(200).json(productoEncontrado)

  } catch (error) {
      res.status(204).json({"message": error})
  }
})
//1 LISTA COMPLETA DE USUARIOS
app.get('/usuarios/', (req, res) =>{
  try {
      let allUsuarios = datos.usuarios

      res.status(200).json(allUsuarios)

  } catch (error) {
      res.status(204).json({"message": error})
  }
})
//2 USUARIOS POR ID
app.get('/usuarios/:id', (req, res) => {
  try {
      let usuarioId = parseInt(req.params.id)
      let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

      res.status(200).json(usuarioEncontrado)

  } catch (error) {
      res.status(204).json({"message": error})
  }
})
// 8 TELEFONO DE UN USUARIO POR ID
app.get('/usuarios/telefono/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)
        
        if (usuarioEncontrado) {
            res.status(200).json({"telefono": usuarioEncontrado.telefono})
        } else {
            res.status(204).json({"message": "Usuario no encontrado"})
        }
  
    } catch (error) {
        res.status(204).json({"message": error})
      }
})
// 9 NOMBRE DE UN USUARIO POR ID
app.get('/usuarios/nombre/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)
        
        if (usuarioEncontrado) {
            res.status(200).json({"nombre": usuarioEncontrado.nombre})
        } else {
            res.status(204).json({"message": "Usuario no encontrado"})
        }
  
    } catch (error) {
        res.status(204).json({"message": error})
      }
})




//POST
//AGREGAR PRODUCTO
app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.productos.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})
// 3 AGREGAR NUEVO USUARIO
app.post('/usuarios', (req, res) => {
  try {
      let bodyTemp = ''

      req.on('data', (chunk) => {
          bodyTemp += chunk.toString()
      })
  
      req.on('end', () => {
          const data = JSON.parse(bodyTemp)
          req.body = data
          datos.usuarios.push(req.body)
      })
  
      res.status(201).json({"message": "success"})

  } catch (error) {
      res.status(204).json({"message": "error"})
  }
})


//PATCH
//MODIFICAR PROD X ID
app.patch('/productos/:id', (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            productoAActualizar.nombre = data.nombre
        }
        
        if (data.tipo){
            productoAActualizar.tipo = data.tipo
        }

        if (data.precio){
            productoAActualizar.precio = data.precio
        }

        res.status(200).send('Producto actualizado')
    })
})
// 4 MODIFICAR USUARIO
app.patch('/usuarios/:id', (req, res) => {
  const idUsuarioAEditar = parseInt(req.params.id);
  const usuarioAActualizar = datos.usuarios.find((usuario) => usuario.id === idUsuarioAEditar);

  if (!usuarioAActualizar) {
    return res.status(404).json({"message": "Usuario no encontrado"});
  }

  let bodyTemp = '';

  req.on('data', (chunk) => {
    bodyTemp += chunk.toString();
  });

  req.on('end', () => {
    const data = JSON.parse(bodyTemp);

    if (data.nombre) {
      usuarioAActualizar.nombre = data.nombre;
    }

    if (data.edad) {
      usuarioAActualizar.edad = data.edad;
    }

    if (data.email) {
      usuarioAActualizar.email = data.email;
    }

    if (data.telefono) {
      usuarioAActualizar.telefono = data.telefono;
    }

    res.status(200).json({"message": "Usuario actualizado"});
  });
})



//DELETE
//BORRAR PROD X ID
app.delete('/productos/:id', (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
    try {
        datos.productos.splice(indiceProductoABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})
// 5 BORRAR UN USUARIO
app.delete('/usuarios/:id', (req, res) => {
  const idUsuarioABorrar = parseInt(req.params.id);
  const usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioABorrar);

  if (!usuarioABorrar) {
    return res.status(404).json({"message": "Usuario no encontrado"});
  }

  const indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar);

  try {
    datos.usuarios.splice(indiceUsuarioABorrar, 1);
    return res.status(200).json({"message": "Usuario eliminado con éxito"});
  } catch (error) {
    return res.status(500).json({"message": "Error al eliminar el usuario"});
  }
})



//app use
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})
//app listen
app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})

