import { Router } from "express";
import { login, logout, signup, check_auth } from "../controllers/auth.js";

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/check_auth', check_auth);

export default router;
