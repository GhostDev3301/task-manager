import db from './config/db.js';

const pruebaConexion = async () => {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS resultado');
    console.log('Conexión exitosa:', rows);
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  }
};

pruebaConexion();
