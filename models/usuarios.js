import db from "../db/connection.js";
import { DataTypes } from "sequelize";

const Usuario=db.define('usuario', {
        id: { type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true },
        nombre: { type: DataTypes.STRING},
        edad : {type: DataTypes.INTEGER},
        email: { type: DataTypes.STRING},
        telefono: { type: DataTypes.STRING},
        usuario : { type:DataTypes.STRING},
        password: { type:DataTypes.STRING},
        nivel:{type:DataTypes.INTEGER}
    },
    {
        tableName: 'usuarios',
        timestamps: false, //le elimina el creatAt y el editedAt de la db
    }
    )
export default Usuario