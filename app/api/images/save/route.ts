import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/helpers/getUser';
const prisma = new PrismaClient();

export const POST = async (req: Request, res: Response) => {

    (req as any).user = getUser(req.headers.get("user"));

    if (!(req as any).user){
        return NextResponse.json({message: "Not authorized for this operation", success: false})
    }

    const formData = await req.formData();
    const file: File | null = formData.get("image") as unknown as File

    const allowedExtensions = ["png", "jpg", "jpeg", "jfif"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase() as string;

    if (!allowedExtensions.includes(fileExtension)){
        return NextResponse.json({message: "Only png, jpg, jpeg and jfif images are allowed", success: false})
    }

    if (!file){
        return NextResponse.json({message: "Image required", success: false})
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());

    await prisma.images.create({
        data: {
            user: {
                connect: {id: parseInt((req as any).user.id)}
            },
            content: imageBuffer
        }
    })

    return NextResponse.json({message: "Image uploaded", success: true})
};  

