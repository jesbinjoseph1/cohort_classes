import jwt from "jsonwebtoken";

export const adminAuth = async(req,res,next)=>{
    try {
        
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"unauthorized: No token provided"});

        }
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!tokenDecoded){
            return res.status(401).json({messsage:"user not autherized"});

        }
        if (tokenDecoded.role !=='mentor' && tokenDecoded.role !=='admin'){
            return res.status(401).json({message:"not autherized"});
        }
        req.user = tokenDecoded;
        next();
    } catch (error) {
        console.error("Error verifying token:",error);
        return res.status(500).json({messsage:"internal server error"});
    }
}