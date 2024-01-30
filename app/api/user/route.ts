import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/helpers/getUser';
const prisma = new PrismaClient();

export const GET = async (req: NextRequest)=>{
    (req as any).user = getUser(req.headers.get("user"));

    if (!(req as any).user){
        return NextResponse.json({message: "Not authorized for this operation", success: false})
    }

    const user = await prisma.users.findUnique({
        where: {
            id: parseInt((req as any).user.id)
        },
        select: {
            id: true,
            email: true,
            name: true,
            time_created: true
        }
    })

    return NextResponse.json({user, success: true})
}