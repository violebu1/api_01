import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/productos.js'
import Usuario from './models/usuarios.js'

const require = createRequire(import.meta.url)
const datos = require('./datos.json');
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'
const app = express()
const exposedPort = 1234
const usuarios = require('./datos.json');

app.get('/', (req, res) => {
    res.status(200).send(html)
})

//GET

// 10 STOCK TOTAL DE PRODUCTOS Y SU VALOR EN SUMATORIA
app.get("/productos/total", async (req, res) => {
    try {
      const productos = await Producto.findAll();
      const productosStock = productos.length;
      const precioTotal = productos.reduce((total, producto) => {
        return total + producto.precio;
      }, 0);
      const precioTotalRedondeado = parseFloat(precioTotal.toFixed(2));
      res.status(200).json({
        productosStock,
        precioTotal: precioTotalRedondeado,
      });
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
});

//LISTADO PRODUCTOS
app.get('/productos/', async (req, res) =>{
    try {
        const allProducts = await Producto.findAll() //select*from productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
});

// 6 PRODUCTO POR PRECIO
app.get('/productos/precio/:id', async (req, res) => {
    try {
        const productoId = parseInt(req.params.id);

        const productoEncontrado = await Producto.findByPk(productoId); 
        if (productoEncontrado) {
            res.status(200).json({"precio": productoEncontrado.precio});
        } else {
            res.status(404).json({"message": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});

// 7 NOMBRE DE PRODUCTO POR ID
app.get('/productos/nombre/:id', async (req, res) => {
    try {
        const productoId = parseInt(req.params.id);

        const productoEncontrado = await Producto.findByPk(productoId); // Buscar producto por ID en la base de datos

        if (productoEncontrado) {
            res.status(200).json({"nombre": productoEncontrado.nombre});
        } else {
            res.status(404).json({"message": "Producto no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"message": "Error interno del servidor"});
    }
});

//PRODUCTOS X ID
app.get('/productos/:id', async (req, res) => {
  try {
      let productoId = parseInt(req.params.id)
      let productoEncontrado = await Producto.findByPk(productoId)

      res.status(200).json(productoEncontrado)

  } catch (error) {
      res.status(204).json({"message": error})
  }
});

//1 LISTA COMPLETA DE USUARIOS
app.get('/usuarios/', async (req, res) => {
    try {
        const allUsuarios = await Usuario.findAll(); 

        res.status(200).json(allUsuarios);
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});

//2 USUARIOS POR ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);

        const usuarioEncontrado = await Usuario.findByPk(usuarioId); 
        if (usuarioEncontrado) {
            res.status(200).json(usuarioEncontrado);
        } else {
            res.status(404).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});

// 8 TELEFONO DE UN USUARIO POR ID
app.get('/usuarios/telefono/:id', async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);

        const usuarioEncontrado = await Usuario.findByPk(usuarioId); // Buscar usuario por ID en la base de datos

        if (usuarioEncontrado) {
            res.status(200).json({"telefono": usuarioEncontrado.telefono});
        } else {
            res.status(404).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});

// 9 NOMBRE DE UN USUARIO POR ID
app.get('/usuarios/nombre/:id', async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id);

        const usuarioEncontrado = await Usuario.findByPk(usuarioId); 
        if (usuarioEncontrado) {
            res.status(200).json({"nombre": usuarioEncontrado.nombre});
        } else {
            res.status(404).json({"message": "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});


//POST
//AGREGAR PRODUCTO
// app.post('/productos', async (req, res) => {
//     let bodyTemp = ''

//     req.on('data', (chunk) => {
//         bodyTemp += chunk.toString()
//     })
    
//     req.on('end', async () => {
//         const data = JSON.parse(bodyTemp)
//         req.body = data
//         //datos.productos.push(req.body)
//         const productoAGuardar = new Producto(req.body)
//         await productoAGuardar.save()
//     })
//     try {
//         const nuevoProducto = await Producto.create(req.body); 
//         res.status(201).json({"message": "Producto creado con éxito", "producto": nuevoProducto});
//     } catch (error) {
//         res.status(500).json({"message": "Error"});
//     }
// });
// 3 AGREGAR NUEVO USUARIO

// app.post('/usuarios', async (req, res) => {
//     try {
//         // Obtener los datos del nuevo usuario del cuerpo de la solicitud
//         const { nombre, email, telefono } = req.body;

//         // Crear un nuevo usuario en la base de datos utilizando Sequelize
//         const nuevoUsuario = await Usuario.create({
//             nombre,
//             email,
//             telefono
//         });

//         // Respuesta de éxito
//         res.status(201).json({"message": "Usuario creado con éxito", "usuario": nuevoUsuario});
//     } catch (error) {
//         // Si hay algún error durante la creación del usuario, responde con un código de estado 500 (Internal Server Error)
//         res.status(500).json({"message": "Error interno del servidor"});
//     }
// });


//PATCH
//MODIFICAR PROD X ID
app.patch('/productos/:id', async(req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = await Producto.findByPk(idProductoAEditar)
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
});

// 4 MODIFICAR USUARIO
app.patch('/usuarios/:id', async (req, res) => {
    const idUsuarioAEditar = parseInt(req.params.id);

    try {
        const usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar); // Busca el usuario por ID en la base de datos

        if (!usuarioAActualizar) {
            return res.status(404).json({"message": "Usuario no encontrado"});
        }

        const data = req.body;

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

        await usuarioAActualizar.save(); // Guarda los cambios en la base de datos

        res.status(200).json({"message": "Usuario actualizado"});
    } catch (error) {
        res.status(500).json({"message": "Error"});
    }
});

//DELETE
//BORRAR PROD X ID
app.delete('/productos/:id', async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = await Producto.findByPk(idProductoABorrar)
    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    try {
        await productoABorrar.destroy()
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
});

// 5 BORRAR UN USUARIO
app.delete('/usuarios/:id', async (req, res) => {
    const idUsuarioABorrar = parseInt(req.params.id);

    try {
        const usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar); 
        if (!usuarioABorrar) {
            return res.status(404).json({"message": "Usuario no encontrado"});
        }

        await usuarioABorrar.destroy(); 

        return res.status(200).json({"message": "Usuario eliminado con éxito"});
    } catch (error) {
        return res.status(500).json({"message": "Error"});
    }
});

//app use
app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate();
    console.log('Conexion con la base de datos establecida')
}catch(error){
    console.log('Error de conexion',error);
}


//app listen
app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
});
