import { Router } from "express";
import { setTimeTable, getUserName, getSchedule, updateAttendence } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);
router.post('/update-attendence', updateAttendence);
router.get('/getusername', getUserName);
router.get('/getschedule', getSchedule);

export default router;
