import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../types/api-response.model";
import { UserProfile } from "../types/userProfile.type";
import { CORRELATION_ID_HEADER, nuevoCorrelationId } from '../../interceptors/correlation-id.interceptor';



@Injectable({
    providedIn: 'root'
})
export class ObjectUploadService {


    constructor(private http: HttpClient) { }

    /**
     * @param correlationId identificador que va a seguir a esta operación por
     *   todo el pipeline (BFF → orquestador → worker → ms-core) y que termina en
     *   `factura.correlation_id`. Pasarlo es lo que permite, después, saber qué
     *   factura nació de esta subida: sin él, el interceptor genera uno al vuelo
     *   y quien subió el archivo nunca se entera de cuál fue.
     */
    async getPresignedPutUrl(apiBase: string, typeUpload: string, fileName: string, fileType: string, userUuid: string, organization?: string, idFactura?: string, correlationId?: string): Promise<{ url: string, key: string, assetId: string }> {
        console.log('[UPLOAD] getPresignedPutUrl - Organization recibida:', organization);
        const safeUserUuid = (userUuid || '').trim();
        const safeTypeUpload = (typeUpload || '').trim();
        if (!safeUserUuid) {
            throw new Error('[UPLOAD] userUuid is required to request a presigned URL.');
        }
        if (!safeTypeUpload) {
            throw new Error('[UPLOAD] typeUpload is required to request a presigned URL.');
        }

        let params = new HttpParams()
            .set('fileName', `${fileName}_${Date.now()}`)
            .set('fileType', fileType)
            .set('userName', safeUserUuid);


        const safeOrganization = (organization || '').trim();
        if (safeOrganization) {
            params = params.set('organization', safeOrganization);
        }
        const safeIdFactura = (idFactura || '').trim();
        if (safeIdFactura) {
            params = params.set('idFactura', safeIdFactura);
        }

        const headers = correlationId
            ? new HttpHeaders({ [CORRELATION_ID_HEADER]: correlationId })
            : undefined;

        const response = this.http.get<ApiResponse<{ url: string, key: string, assetId: string }>>(`${apiBase}/api/bff/object/presigned-url/${safeTypeUpload}`, {
            params,
            headers,
            withCredentials: true
        });
        try {
            const res = await firstValueFrom(response);
            console.log('[UPLOAD] Presigned URL response:', res);
            return res.data as any;
        } catch (err) {
            console.error('[UPLOAD] Error fetching presigned URL:');
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

    /**
     * Sube un archivo y devuelve también el `correlationId` con el que viajó,
     * para poder reconocer después lo que el pipeline haya creado a partir de
     * él. Si no se pasa uno, se genera y se devuelve igual.
     */
    /**
     * Pide la URL firmada y sube el archivo directo al bucket.
     *
     * Devuelve el `assetId` además de la key: con una factura que nace recién
     * cuando el worker leyó el documento, el assetId es lo único que ata el
     * archivo recién subido con la fila que está esperando en pantalla.
     */
    async uploadFileUsingPresignedUrl(apiBase: string, typeUpload: string, file: File, useruuid: string, organization?: string, idFactura?: string, correlationId?: string): Promise<{ key: string, assetId: string, objectUrl: string, correlationId: string }> {
        console.log('[UPLOAD] uploadFileUsingPresignedUrl - Organization recibida:', organization);
        const safeUserUuid = (useruuid || '').trim();
        const safeTypeUpload = (typeUpload || '').trim();
        if (!safeUserUuid) {
            throw new Error('[UPLOAD] Cannot upload without a valid userUuid.');
        }
        if (!safeTypeUpload) {
            throw new Error('[UPLOAD] Cannot upload without a valid typeUpload.');
        }

        const correlacion = (correlationId || '').trim() || nuevoCorrelationId();
        const presigned = await this.getPresignedPutUrl(apiBase, safeTypeUpload, file.name, file.type, safeUserUuid, organization, idFactura, correlacion);

        if (!presigned?.url) {
            throw new Error('Presigned URL not received from API.');
        }

        await this.uploadToPresignedUrl(presigned.url, file);

        return {
            key: presigned.key,
            assetId: presigned.assetId,
            objectUrl: presigned.url.split('?')[0],
            correlationId: correlacion,
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