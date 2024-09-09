import { createUploadthing } from 'uploadthing/express';
// Create an instance of Uploadthing
const f = createUploadthing();

// Define the upload router
export const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    }).onUploadComplete((data) => {
        console.log('Upload completed', data);
    }),
};

