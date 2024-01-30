import { NextRequest, NextResponse } from "next/server"


export const middleware = async (req: NextRequest, res: Response) => {

    const userToken = req.headers.get("user") || ''

    if (!userToken) {
        return NextResponse.json({ message: "The user is unauthorized for this operation", success: false })
    }

}

export const config = {
    matcher: [
        "/api/images/save",
        "/api/images/get",
        "/api/images/delete/:id",
        "/api/user"
    ]
}