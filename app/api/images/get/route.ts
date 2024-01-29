import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/getUser';
const prisma = new PrismaClient();

export const GET = async (req: Request)=>{

    (req as any).user = getUser(req.headers.get("user"));

    if (!(req as any).user){
        return NextResponse.json({message: "Not authorized for this operation", success: false})
    }

    const images = await prisma.images.findMany({
        where: {user_id: (req as any).user.id}
    })

    const imagesToSend = []
    const imagesLen = images.length;

    for (let i=0; i<imagesLen; i++){
        const base64Data = images[i].content.toString("base64");
        const content = images[i].content
        const imageUrl = `data:${(content as any).contentType};base64,${base64Data}`;

        imagesToSend.push({imageUrl})
    }

    return NextResponse.json({images: imagesToSend, success: true})
}