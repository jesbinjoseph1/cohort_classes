import e from "express";
import { userLogin, userProfile, userSignup,userLogout, checkUser, userResetPassword, userProfileUpdate, userDeleteAccount } from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.get('/profile',userAuth,userProfile)
router.put('/logout',userAuth,userLogout)
router.put('/reset-password',userAuth,userResetPassword)
router.put('/profile-update',userAuth,userProfileUpdate)
router.delete('/delete-account',userAuth,userDeleteAccount)

router.get('/check-user',userAuth,checkUser)

export {router as userRouter}