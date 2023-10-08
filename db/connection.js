import { Sequelize } from 'sequelize';


//creo el objeto


const db = new Sequelize(
    'ktxatsjk', //base de datos
    'ktxatsjk', //usuario
    'FFZ36V44uZMWzlPiTnFkgPCyLaaDcgkH', //password
    {
        host: 'silly.db.elephantsql.com',
        dialect : 'postgres',
        logging : true
    })

export default db