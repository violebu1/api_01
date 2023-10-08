import db from "../db/connection.js";
import { DataTypes } from "sequelize";

const Usuario=db.define('usuario', {
        nombre: { type: DataTypes.STRING},
        edad : {type: DataTypes.INTEGER},
        email: { type: DataTypes.STRING},
        telefono: { type: DataTypes.STRING}
    },
    {
        tableName: 'usuarios',
        timestamps: false, //le elimina el creatAt y el editedAt de la db
    }
    )
export default Usuario