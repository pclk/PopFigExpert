import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    return new Response('hi')
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    return new Response(JSON.stringify(body))
}