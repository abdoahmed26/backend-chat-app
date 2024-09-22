import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/connectDB.js"
import { app, server } from "./socket/socketServer.js"
import path, {dirname} from "path"
import {fileURLToPath} from "url"
import { authRouter } from "./routes/authRoute.js"
import { userRouter } from "./routes/userRoute.js"
import { passwordRouter } from "./routes/passwordRoute.js"

dotenv.config()

// const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const allowedOrigins = [process.env.FRONT_END_URL,"http://localhost:5173"]
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);  // السماح بالوصول
        } else {
          callback(new Error('Not allowed by CORS'));  // رفض الوصول
        }
    },
    credentials : true,
}))

const filename = fileURLToPath(import.meta.url)
const __dirname = dirname(filename)
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

connectDB()

app.use("/api/v1/auth",authRouter)

app.use("/api/v1/user",userRouter)

app.use("/api/v1/password",passwordRouter)

app.all("*",(req,res)=>{
    return res.status(404).json({status:"error",message:"this resource is not valid"})
})

server.listen(process.env.PORT,() => console.log(`Server is running on port http://localhost:${process.env.PORT}`))