import express from 'express';
import { getTeamTasks } from '../controllers/teamTasksController.js';

const router = express.Router();
router.get('/', getTeamTasks);
export default router;