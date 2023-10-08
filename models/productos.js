import db from '../db/connection.js';
import { DataTypes } from 'sequelize';

const Producto = db.define('Producto',
    {
        nombre: { type: DataTypes.STRING},
        tipo: { type: DataTypes.STRING},
        precio: { type: DataTypes.DOUBLE}
    },
    {
        tableName: 'productos',
        timestamps: false, //le elimina el creatAt y el editedAt de la db
    }
    )

export default Producto