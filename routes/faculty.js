import { Router } from "express";
import { login, signup, setTimeTable} from "../controllers/facultyController.js";

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/settimetable', setTimeTable);

export default router;
