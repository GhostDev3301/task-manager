import express from 'express';
import { getMeetings } from '../controllers/meetingsController.js';

const router = express.Router();
router.get('/', getMeetings);
export default router;