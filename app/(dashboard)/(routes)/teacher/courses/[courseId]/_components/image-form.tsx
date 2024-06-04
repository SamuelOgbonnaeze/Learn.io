"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";


interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    }),
})

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData?.imageUrl || "",
        },
    })



    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log("Submitting values:", values); // Log the values to see what is being sent
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course decription updated")
            toggleEdit();
            router.refresh()
        } catch (error) {
            toast.error("Something went wrong")
        }
    }


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4" >
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button
                    className="flex items-center justify-between  "
                    variant="ghost"
                    onClick={toggleEdit}

                >
                    {isEditing && (
                        <>Cancel</>
                    )
                    }

                    {!isEditing && !initialData?.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add image
                        </>
                    )}

                    {!isEditing && initialData?.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>

            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex justify-center items-center h-60 bg-slate-700 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500 " />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="Upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}

            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageForm;