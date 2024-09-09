import Mux from "@mux/mux-node";
import { prismadb } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        console.log('Auth userId:', userId); // Log auth userId
        console.log('Params courseId:', params.courseId); // Log courseId from params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId, // Ensure correct constraint
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }
        
        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                console.log('Deleting Mux asset with id:', chapter.muxData.assetId); // Log assetId being deleted
                try {
                    await mux.video.assets.delete(chapter.muxData.assetId); // Ensure correct method name and casing
                } catch (muxError) {
                    console.error(`Error deleting Mux asset with id ${chapter.muxData.assetId}:`, muxError);
                    // Optionally handle specific Mux errors here
                }
            }
        }

        const deletedCourse = await prismadb.course.delete({
            where: {
                id: params.courseId,
            }
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.error("COURSE_ID_DELETE", error); // Use console.error for errors
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH
    (
        req: Request,
        { params }: { params: { courseId: string } }
    ) {
    try {
        const { userId } = auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prismadb.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
