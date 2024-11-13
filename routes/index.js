import e from "express";
import { userRouter } from "./userRoutes.js";
import { mentorRouter } from "./mentorRoutes.js";
import { adminRouter } from "./adminRoutes.js";


const router = e.Router()

router.use('/user', userRouter)
router.use('/mentor',mentorRouter)
router.use("/admin",adminRouter)

export{router as apiRouter}