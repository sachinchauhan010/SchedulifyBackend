import { Router } from "express";
import { setTimeTable, getUserName, getSchedule, updateAttendence, setDefaultAttendence, getTodayAttendence } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);
router.post('/update-attendence', updateAttendence);
router.post('/today-attendence', getTodayAttendence);
router.get('/getusername', getUserName);
router.get('/getschedule', getSchedule);
router.get('/set-default-attendence', setDefaultAttendence);

export default router;
