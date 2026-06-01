import { json, or } from "sequelize"
import {redisClient,connectRedis} from "./redis"
import { Request,Response, NextFunction } from "express"

async function RateLimiter(req:Request,res:Response,next:NextFunction){
    const userIp = req.ip
    const currentTime =  Date.now()
    const window = 60*1000
    const ipKey = `userIp:${userIp}`
    const result = await redisClient.get(ipKey)
    if(!result){ //cache miss
        const object =  JSON.stringify({"startTime":currentTime,"requests":1})
        await redisClient.set(ipKey,object,{EX:60*60})
        return next()
    }
    const jsresult = JSON.parse(result)
    const timeDiff = currentTime-jsresult.startTime
    if(timeDiff<window){
        jsresult.requests+=1
        await redisClient.set(ipKey,JSON.stringify(jsresult),{KEEPTTL:true})
        if(jsresult.requests>50){
            return res.status(400).json({'error':"Too many requests"})
        }
        return next()
    }
    if(timeDiff>=window){
        const object =  JSON.stringify({"startTime":currentTime,"requests":1})
        await redisClient.set(ipKey,object,{EX:60*60})
        return next()
    }
}