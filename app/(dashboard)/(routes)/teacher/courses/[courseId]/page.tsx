import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { CircleDollarSign, LayoutList, ListChecks, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";

const CourseIdPage = async ({ params }:
    { params: { courseId: string } }
) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }

    const course = await prismadb.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            attachments:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }
    })

    if (!course) {
        return redirect("/")
    }

    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        },  
    })


    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-16">
                {/* Left side */}
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge size="sm" variant="default" icon={LayoutList} />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id}
                        options={categories.map((category) => ({
                            label: category?.name,
                            value: category?.id
                        }))}
                    />
                </div>

                {/* Right side */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="sm" variant="default" icon={ListChecks} />
                            <h2 className="text-xl">Course Chapters</h2>
                        </div>
                        <div>
                            TODO: CHAPTERS
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="sm" variant="default" icon={CircleDollarSign} />
                            <h2 className="text-xl">Price</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="sm" variant="default" icon={File} />
                            <h2 className="text-xl">Resources & Attachments</h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseIdPage; 