import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

//creo el objeto
dotenv.config();
//instancia sequelize
const db = new Sequelize(
    process.env.DB_NAME, //base de datos
    process.env.DB_USERNAME, //usuario
    process.env.DB_PASSWORD, //password
    {
        host: process.env.DB_HOSTNAME,
        dialect : process.env.DB_DIALECT,
        logging : true
    })

export default db;