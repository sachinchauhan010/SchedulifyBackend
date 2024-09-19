import { Router } from "express";
import { setTimeTable } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);

export default router;
