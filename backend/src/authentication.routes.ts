import prisma from "./db";
import express, { Router } from "express";
class UserRepository{
    async addUser(name:string,email:string,password:string){
        const user = await prisma.user.create({
            data:{
                name:name,
                email:email,
                password:password
            }
        })
    }
}
class AuthRepository{
    async login(name:string,password:string){
        const user =await prisma.user.findFirst({
            where:{
                name:name,
                password:password
            }
        })
        return user
    }
}

const authRoutes = Router()
