import pool from '../config/db.js';

export const getTeamTasks = async (req, res) => {
  try {
    const [team_tasks] = await pool.query('SELECT * FROM team_tasks');
    res.json(team_tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo tareas de equipo' });
  }
};