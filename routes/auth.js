import { Router } from "express";
import { login, logout, signup, check_auth, verifyEmailById } from "../controllers/auth.js";

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/check_auth', check_auth);
router.get('/verify-email/:userId', verifyEmailById);

export default router;
