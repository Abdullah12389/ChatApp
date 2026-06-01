import { createClient,RedisClientType } from "redis";
export const redisClient:RedisClientType = createClient({
    url:"redis://localhost:6379"
})
redisClient.on("connect",()=>{
    console.log("redis connected")
})
export const connectRedis = async () => {
    if(!redisClient.isOpen){
        await redisClient.connect()
    }
}