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

    async getPresignedUrl(apiBase: string, typeUpload: string): Promise<{ url: string, key: string }> {
        const response = this.http.get<ApiResponse<{ url: string, key: string }>>(`${apiBase}/api/bff/object/presigned-url/${typeUpload}`);
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
            console.log(file);
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type || 'application/octet-stream'
                }
            });

            if (!response.ok) {
                throw new Error(`Upload to presigned URL failed: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.error('Error uploading to presigned URL:');
            console.error(err);
            throw err;
        }
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

}