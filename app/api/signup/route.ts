import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { mailVerification } from "@/helpers/getMail";


let verificationCode: String;

export const PUT = async (req: Request, res: Response) =>{
    const payload = await req.json();
    if (!payload.email){
        return NextResponse.json({message: "Please provide an email address", success: false})
    }
    if (!payload.password || payload.password.length<8 || payload.password.length > 16){
        return NextResponse.json({message: "Please provide a password of minimum length 8 and maximum 16 characters.", success: false})
    }
    if (!payload.cpassword || payload.cpassword != payload.password){
        return NextResponse.json({message: "Please confirm your account password.", success: false})
    }
    if (!payload.name){
        return NextResponse.json({message: "Please give your account a name", success: false})
    }

    const user = await prisma.users.findFirst({
        where: {
            email: payload.email
        }
    })

    if (user){
        return NextResponse.json({message: "A user already exists with the provided email", success: false})
    }
    const email = payload.email;
    verificationCode = await mailVerification(req, res, email);
    return NextResponse.json({message: "We got your email", verificationCode, success: true})
}


export const POST = async (req: Request, res: Response)=>{
    const payload = await req.json();
    if (!payload.email){
        return NextResponse.json({message: "Please provide an email address", success: false})
    }
    if (!payload.password || payload.password.length<8 || payload.password.length > 16){
        return NextResponse.json({message: "Please provide a password of minimum length 8 and maximum 16 characters.", success: false})
    }
    if (!payload.cpassword || payload.cpassword != payload.password){
        return NextResponse.json({message: "Please confirm your account password.", success: false})
    }
    if (!payload.name){
        return NextResponse.json({message: "Please give your account a name", success: false})
    }
    if (!payload.code || payload.code != verificationCode){
        return NextResponse.json({message: "Provide the correct code for signing up", success: false})
    }

    const user = await prisma.users.findFirst({
        where: {
            email: payload.email
        }
    })

    if (user){
        return NextResponse.json({message: "A user already exists with the provided email", success: false})
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const newUser = await prisma.users.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            time_created: new Date()
        }
    })

    const id = { user: { id: newUser.id } }
    const token = jwt.sign(id, process.env.JWT_SECRET);
    return NextResponse.json({ token, success: true });
}