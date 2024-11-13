import e from "express";
import { adminLogin, adminLogout, adminProfile, adminResetPassword, adminSignup,adminProfileUpdate,adminDeleteAccount, fetchUsers, fetchMentors,fetchCourses, checkAdmin, freezeUser} from "../controllers/adminControllers.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = e.Router();

router.post('/signup',adminSignup)
router.post('/login',adminLogin)
router.get('/profile',adminAuth,adminProfile)
router.put('/logout',adminAuth,adminLogout)
router.put('/reset-password',adminAuth,adminResetPassword)
router.put('/profile-update',adminAuth,adminProfileUpdate)
router.delete('/delete-account',adminAuth,adminDeleteAccount)
router.get('/fetch-users',adminAuth,fetchUsers)
router.get('/fetch-mentors',adminAuth,fetchMentors)
router.get('/fetch-courses',adminAuth,fetchCourses)
router.get('/check-admin',adminAuth,checkAdmin)
router.put('/freezeUser/:userId',adminAuth,freezeUser)

export {router as adminRouter}