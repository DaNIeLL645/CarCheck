import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // 1. Rută pentru pozele mașinii
  carImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Poză încărcată cu succes:", file.url);
  }),

  // 2. Rută pentru fișiere video/audio cu motorul
  engineMedia: f({
    video: { maxFileSize: "16MB" },
    audio: { maxFileSize: "8MB" },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Video/Audio motor încărcat:", file.url);
  }),

  // 3. Rută pentru rezultatul diagnozei (PDF sau poză)
  diagnosticFile: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Fișier diagnoză încărcat:", file.url);
  }),

  // 4. Rută pentru fișiere 3D
  model3D: f({ blob: { maxFileSize: "16MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("Model 3D încărcat:", file.url);
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
