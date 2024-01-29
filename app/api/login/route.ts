import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const POST = async (req: Request, res: Response)=>{  

    const payload = await req.json();

    if (!payload.email){
        return NextResponse.json({message: "You must provide your email address", success: false})
    }

    if (!payload.password){
        return NextResponse.json({message: "You must provide your password", success: false})
    }

    const user = await prisma.users.findFirst({
        where: {
            email: payload.email
        }
    })

    if (!user){
        return NextResponse.json({message: "No user found with the provided email address", success: false})
    }

    const passwordisCorrect  = await bcrypt.compare(payload.password, user.password);

    if (!passwordisCorrect){
        return NextResponse.json({message: "Incorrect password", success: false})
    }

    const id = { user: { id: user.id } }
    const token = jwt.sign(id, process.env.JWT_SECRET);
    return NextResponse.json({ message: token, success: true });
}