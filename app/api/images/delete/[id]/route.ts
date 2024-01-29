import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/getUser';
const prisma = new PrismaClient();

export const DELETE = async (req: NextRequest)=>{

    (req as any).user = getUser(req.headers.get("user"));

    if (!(req as any).user){
        return NextResponse.json({message: "Not authorized for this operation", success: false})
    }

    const url = new URL(req.url)
    const id = url.href[url.href.length-1]      

    const image = await prisma.images.findFirst({
        where: {id: parseInt(id)}
    })

    if (!image){
        return NextResponse.json({message: "Image not found", success: false})
    }

    if (image?.user_id != parseInt((req as any).user.id)){
        return NextResponse.json({message: "Not authorized for this operation", success: false})
    }

    await prisma.images.delete({
        where: {id: parseInt(id)}
    })

    return NextResponse.json({message: "Image deleted", success: true})
}