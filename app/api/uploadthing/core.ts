import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error; // Re-throw to ensure the error propagates correctly
  }
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Course image upload complete");
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Course attachment upload complete");
    }),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Chapter video upload complete");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
