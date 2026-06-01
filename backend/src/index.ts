import express, {Application,Response,Request, response} from "express"
import prisma from "./db"
import http from "http"
import { Server } from "socket.io"
import bcrypt from "bcrypt"
import cors from "cors"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { connectRedis,redisClient } from "./redis"
const app:Application = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  }
})
await connectRedis()

app.post("/login",async (req:Request,res:Response)=>{
  const {name,password} = req.body
  const user = await prisma.user.findFirst({
    where:{
      name:name
    }
  })
  if(!user) return res.status(303).json({"error":"not found"})
  const isAuth = await bcrypt.compare(password,user.password)
  if(isAuth){
    const secret_key = process.env.JWT_TOKEN || ""
    const token =await jwt.sign({name:name,password:password},secret_key)
    const tokenKey = `authtoken:${token}`
    await redisClient.set(tokenKey,JSON.stringify(user),{EX:3600})
    res.cookie("token",token,{
      httpOnly:true,
      sameSite:"lax",
      maxAge: 24*60*60*1000
    })
    return res.status(200).json({"user":user})
  }
  return res.status(404).json({"error":"unauthorized"})
})

app.post("/signup",async (req:Request,res:Response)=>{
  const {name,email,password} = req.body
  const hashPass = await bcrypt.hash(password,10)
  const user = await prisma.user.create({
    data:{
      name:name,
      email:email,
      password:hashPass
    }
  })
  const secret_key = process.env.JWT_TOKEN || ""
  const token =await jwt.sign({name:name,password:password},secret_key)
  const tokenKey = `authtoken:${token}`
  await redisClient.set(tokenKey,JSON.stringify(user),{EX:3600})
  res.cookie("token",token,{
    httpOnly:true,
    sameSite:"lax",
    maxAge: 24*60*60*1000
  })
  return res.status(200).json({
    "user":user
  })
})
app.get("/me", async (req:Request,res:Response)=>{
  const token = req.cookies.token
  const tokenKey = `authtoken:${token}`
  const user = await redisClient.get(tokenKey) || null
  return res.json({
    "user": user?JSON.parse(user):null
  })
})
app.get("/communities/:userId",async (req:Request<{userId:string}>,res:Response)=>{
  const { userId } = req.params
  const user = await prisma.user.findUnique({
    where:{id:userId},
    include:{communities:true}
  })
  return res.json({"coms":user?.communities || []})
})
app.post("/:userId/joinCommunity",async (req:Request,res:Response)=>{
  const { userId } = req.params
  const { name } = req.body
  const community =prisma.$transaction(async (tx)=>{
    const comm = await tx.community.update({
      where:{name:name},
      data:{
        memberIds:{push:userId}
      }
    })
    await tx.user.update({
      where:{id:userId as string},
      data:{
        communityIds:{push:comm.id}
      }
    })
    return comm
  })
  res.json({"comm":community})  
})
app.post("/:userId/createCommunity",async (req:Request<{userId:string}>,res:Response)=>{
    const { name } = req.body
    const { userId } = req.params
    const community = await prisma.$transaction(async (tx)=>{
      const newComm = await tx.community.create({
        data:{
          name:name,
          admin:userId,
          memberIds:[userId]
        }
      })
      await tx.user.update({
        where:{id:userId},
        data:{
          communityIds:{
            push:newComm.id
          }
        }
      })
      return newComm
    })
    return res.json({"comm":community})
})
app.get("/:communityId/messages",async (req:Request<{communityId:string}>,res:Response)=>{
    const {communityId} = req.params
    const messages = await prisma.message.findMany({
      where:{
        communityId:communityId
      }
    })
    return res.json(messages)
})

io.on("connection",(socket)=>{
  socket.on("joinCommunity",(data:{communityId:string})=>{
    socket.join(data.communityId)
    console.log("joined")
  })
  socket.on("messages",async (data:{communityId:string,content:string,senderId:string})=>{
    const message = await prisma.message.create({
      data:{
        content:data.content,
        sender: data.senderId,
        communityId:data.communityId,
        status:"sent"
      }
    })
    io.in(data.communityId).emit("messages",message)
  })
  socket.on("typing",async(data:{communityId:string,senderId:string})=>{
    if(data.senderId)
      socket.to(data.communityId).emit("typing",`${data.senderId} is typing`)
    else
      socket.to(data.communityId).emit("typing",null)
  })
})
server.listen(3000,()=>{
  console.log("App running on http://localhost:3000/")
})