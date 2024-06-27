import { MuxData } from '@prisma/client';
import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const ownCourse = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        })

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await prismadb.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        const MuxData = await prismadb.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        })

        if (!chapter || !MuxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const publishedChapter = await prismadb.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json(publishedChapter)

    } catch (error) {
        console.log("CHAPTER_PUBLISH", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}