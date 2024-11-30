import { connect } from 'mongoose';

/**
 * Conecta la aplicación a la base de datos MongoDB.
 * Utiliza la variable de entorno `MONGO_URI` para la URI de conexión.
 * 
 * @async
 * @function connectDB
 * @throws {Error} Lanza un error si la conexión falla.
 */
const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI); // Intenta conectar a MongoDB
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error(err.message); // Muestra el error si ocurre
        process.exit(1); // Sale del proceso si la conexión falla
    }
};

export default connectDB;
