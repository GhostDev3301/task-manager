import pool from '../config/db.js';

export const getMeetings = async (req, res) => {
  try {
    const [meetings] = await pool.query('SELECT * FROM meetings');
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo meetings' });
  }
};