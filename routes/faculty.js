import { Router } from "express";
import { setTimeTable, getUserName, getSchedule } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);
router.get('/getusername', getUserName);
router.get('/getschedule', getSchedule);

export default router;
