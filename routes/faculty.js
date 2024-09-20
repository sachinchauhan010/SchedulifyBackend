import { Router } from "express";
import { setTimeTable, getUserName } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);
router.get('/getusername', getUserName);

router.get('/faculty-get', (req, res) => {
  res.send(`${req?.cookies?.facultyToken} Hello from faculty authorised route`);
});

export default router;
