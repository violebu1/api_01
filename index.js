import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/productos.js'
import Usuario from './models/usuarios.js'
import jwt from 'jsonwebtoken'

const require = createRequire(import.meta.url)
const datos = require('./datos.json');
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'
const app = express()
const exposedPort = 1234
const usuarios = require('./datos.json');



// Middleware para la validacion de los token recibidos
function autenticacionDeToken(req, res, next){
    const headerAuthorization = req.headers['authorization']

    const tokenRecibido = headerAuthorization.split(" ")[1]

    if (tokenRecibido == null){
        return res.status(401).json({message: 'Token inválido'})
    }

    let payload = null

    try {
        // intentamos sacar los datos del payload del token
        payload = jwt.verify(tokenRecibido, process.env.SECRET_KEY)
    } catch (error) {
        return res.status(401).json({message: 'Token inválido'})
    }

    if (Date.now() > payload.exp){
        return res.status(401).json({message: 'Token caducado'})
    }

    // Pasadas las validaciones
    req.user = payload.sub

    next()
}

// Middleware que construye el body en req de tipo post y patch
app.use((req, res, next) =>{
    if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next()}

    if (req.headers['content-type'] !== 'application/json') { return next()}

    let bodyTemporal = ''

    req.on('data', (chunk) => {
        bodyTemporal += chunk.toString()
    })

    req.on('end', () => {
        req.body = JSON.parse(bodyTemporal)

        next()
})})


app.get('/', (req, res) => {
    res.status(200).send(html)
})

//validacion de los datos de logueo
app.post('/auth', async (req, res) => {

    //datos de logueo
    const usuarioABuscar = req.body.usuario
    const passwordRecibido = req.body.password

    let usuarioEncontrado = ''

    //usuario
    try {
        usuarioEncontrado = await Usuario.findAll(
            {where:{usuario:usuarioABuscar}});

        if (usuarioEncontrado == '')
        { return res.status(400).json({message: 'Usuario no encontrado'}) }
    } catch (error) {
        return res.status(400).json({message: 'Usuario no encontrado'})
    }

    // Comprobacion del pass
    if (usuarioEncontrado[0].password !== passwordRecibido){
        return res.status(400).json({message: 'Password incorrecto'})
    }

    //token
    const sub = usuarioEncontrado[0].id
    const usuario = usuarioEncontrado[0].usuario
    const nivel = usuarioEncontrado[0].nivel

    // firma 
    const token = jwt.sign({
        sub,
        usuario,
        nivel,
        exp: Date.now() + (240 * 1000)
    }, process.env.SECRET_KEY)

    res.status(200).json({ accessToken: token })
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
app.post('/productos', autenticacionDeToken,async(req, res) => {
    
    try {
        const productoAGuardar=new Producto(req.body)
        await productoAGuardar.save()

        res.status(201).json({"message": "Producto ingresado con éxito"});
    } catch (error) {
        res.status(204).json({"message": "Error"});
    }
});

// 3 AGREGAR NUEVO USUARIO
app.post('/usuarios', autenticacionDeToken, async(req, res) => {
    
    try {
        
            const usuarioAGuardar=new Usuario(req.body)
            await usuarioAGuardar.save()
        
        res.status(201).json({"message": "Usuario creado con éxito"});
    } catch (error) {
        res.status(204).json({"message": "Error"});
    }
});


//PATCH
//MODIFICAR PROD X ID
app.patch('/productos/:id', async(req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    try{
    let productoAActualizar = await Producto.findByPk(idProductoAEditar)
    if (!productoAActualizar) {
        return res.status(204).json({"message":"Producto no encontrado"})
    }

    await productoAActualizar.update(req.body)

    res.status(200).send('Producto actualizado')

    } catch (error) {
    res.status(204).json({"message":"Producto no encontrado"})
    }
})
// 4 MODIFICAR USUARIO
app.patch('/usuarios/:id', async (req, res) => {
    const idUsuarioAEditar = parseInt(req.params.id);

    try {
        let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar); // Busca el usuario por ID en la base de datos

        if (!usuarioAActualizar) {
            return res.status(404).json({"message": "Usuario no encontrado"});
        }
        await usuarioAActualizar.update(req.body)
        
        res.status(200).json({"message": "Usuario actualizado"});
    } catch (error) {
        res.status(500).json({"message": "Error al actualizar usuario"});
    }
});

//DELETE
//BORRAR PROD X ID
app.delete('/productos/:id', async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    try {
        let productoABorrar = await Producto.findByPk(idProductoABorrar);
        if (!productoABorrar){
            return res.status(204).json({"message":"Producto no encontrado"})
        }
        await productoABorrar.destroy()
        res.status(200).json({message:"Producto eliminado"})
    } catch (error) {
        res.status(204).json({message: error})
    }
})
// 5 BORRAR UN USUARIO
app.delete('/usuarios/:id', async (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id);

    try {
        let usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar); 
        if (!usuarioABorrar) {
            return res.status(404).json({"message": "Usuario no encontrado"});
        }

        await usuarioABorrar.destroy(); 

        res.status(200).json({"message": "Usuario eliminado con éxito"});
    } catch (error) {
        return res.status(500).json({message: error});
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
    console.error('Error de conexion',error);
}


//app listen
app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
});
