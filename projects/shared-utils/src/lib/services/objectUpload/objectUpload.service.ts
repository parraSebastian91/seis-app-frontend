import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../types/api-response.model";
import { UserProfile } from "../types/userProfile.type";



@Injectable({
    providedIn: 'root'
})
export class ObjectUploadService {
    

    constructor(private http: HttpClient) { }

    async getPresignedPutUrl(apiBase: string, typeUpload: string, fileName: string, fileType: string): Promise<{ url: string, key: string }> {
        const response = this.http.get<ApiResponse<{ url: string, key: string }>>(`${apiBase}/api/bff/object/presigned-url/${typeUpload}?fileName=${fileName}_${Date.now()}&fileType=${fileType}`);
        try {
            const res = await firstValueFrom(response);
            console.log('Presigned URL response:', res);
            return res.data as any;
        } catch (err) {
            console.error('Error fetching presigned URL:');
            console.error(err);
            throw err;
        }
    }

    async uploadToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
        try {
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type || 'application/octet-stream',
                },
                body: file,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Upload to presigned URL failed: ${response.status} ${response.statusText}. Body: ${errorBody}`);
            }
        } catch (err) {
            console.error('Error uploading to presigned URL:');
            console.error(err);
            throw err;
        }
    }

    async uploadFileUsingPresignedUrl(apiBase: string, typeUpload: string, file: File): Promise<{ key: string, objectUrl: string }> {
        const presigned = await this.getPresignedPutUrl(apiBase, typeUpload, file.name, file.type);

        if (!presigned?.url) {
            throw new Error('Presigned URL not received from API.');
        }

        await this.uploadToPresignedUrl(presigned.url, file);

        return {
            key: presigned.key,
            objectUrl: presigned.url.split('?')[0]
        };
    }


    async uploadObject(formData: FormData, apiBase: string, typeUpload: string): Promise<UserProfile> {
        const userProfile = this.http.post<ApiResponse<any>>(`${apiBase}/api/bff/object/${typeUpload}`, formData);
        try {
            const res = await firstValueFrom(userProfile);
            console.log('User profile response:', res);
            return res.data as any;
        } catch (err) {
            console.error('Error fetching user profile:');
            console.error(err);
            throw err;
        }
    }

    // EjecutarResizeImagen(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {

    // }

}