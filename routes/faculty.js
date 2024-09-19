import { Router } from "express";
import { setTimeTable } from "../controllers/facultyController.js";

const router = Router();

router.post('/settimetable', setTimeTable);

router.get('/faculty-get', (req, res) => {
  res.send(`${req?.cookies?.facultyToken} Hello from faculty authorised route`);
});

export default router;
