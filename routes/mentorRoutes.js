import e from "express";
import { checkMentor, mentorDeleteAccount, mentorLogin, mentorLogout, mentorProfile, mentorProfileUpdate, mentorResetPassword, mentorSignup } from "../controllers/mentorControllers.js";
import { mentorAuth } from "../middlewares/mentorAuth.js";

const router = e.Router();

router.post ('/signup',mentorSignup)
router.post('/login',mentorLogin)
router.get('/profile',mentorAuth,mentorProfile)
router.put('/logout',mentorAuth,mentorLogout)
router.put('/reset-password',mentorAuth,mentorResetPassword)
router.put('/profile-update',mentorAuth,mentorProfileUpdate)
router.delete('/delete-account',mentorAuth,mentorDeleteAccount)

router.get('/check-mentor',mentorAuth,checkMentor)

export {router as mentorRouter}