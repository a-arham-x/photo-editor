import { NextRequest, NextResponse } from "next/server"
import {getUser} from './getUser';


export const middleware = async (req: NextRequest, res: Response) => {
    const userToken = req.headers.get("user") || ''

    if (!userToken) {
        return NextResponse.json({ message: "The user is unauthorized for this operation", success: false })
    }

    // console.log("Working");
    // // const string = verify(userToken.toString(), process.env.JWT_SECRET!);
    // // console.log("Working 2");
    // (req as any).user = getUser(userToken);
    // console.log((req as any).user)

}

export const config = {
    matcher: [
        "/api/images/save",
        "/api/images/get",
        "/api/images/delete/:id",
    ]
}