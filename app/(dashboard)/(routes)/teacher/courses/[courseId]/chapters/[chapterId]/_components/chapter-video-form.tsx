"use client"

import { z } from "zod"
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { FileUpload } from "@/components/file-upload";


interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
})

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current)



    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log("Submitting values:", values); // Log the values to see what is being sent
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter updated")
            toggleEdit();
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4" >
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button
                    className="flex items-center justify-between  "
                    variant="ghost"
                    onClick={toggleEdit}

                >
                    {isEditing && (
                        <>Cancel</>
                    )
                    }

                    {!isEditing && !initialData?.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}

                    {!isEditing && initialData?.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>

            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex justify-center items-center h-60 bg-slate-700 rounded-md">
                        <Video className="h-10 w-10 text-slate-500 " />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2 rounded-md ">
                        chapter video uploaded
                        {/* <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                            className="h-[300px]"
                        /> */}
                    </div>
                )
            )}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a while to process. Refresh the page if video fails to appear.
                </div>
            )}
        </div>
    );
}

export default ChapterVideoForm;