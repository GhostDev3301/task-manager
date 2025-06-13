import pool from '../config/db.js';

export const getTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo tareas' });
  }
};
