import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../types/api-response.model";
import { UserProfile } from "../types/userProfile.type";
import { UserImageProfile } from "../types/imageProfile.type";

export interface UserProfileServiceConfig {
  apiBase?: string;
  bffPath?: string;
}

export const USER_PROFILE_SERVICE_CONFIG = new InjectionToken<UserProfileServiceConfig>(
  "USER_PROFILE_SERVICE_CONFIG"
);



@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private http: HttpClient,
    @Optional() @Inject(USER_PROFILE_SERVICE_CONFIG)
    private config?: UserProfileServiceConfig
  ) { }

  private joinUrl(base: string, path: string): string {
    return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  private getDefaultBase(): string {
    const locationRef = globalThis?.location;
    if (!locationRef) {
      return "";
    }
    return locationRef.origin || `${locationRef.protocol}//${locationRef.host}`;
  }

  private resolveApiBase(apiBase?: string): string {
    return apiBase || this.config?.apiBase || this.getDefaultBase();
  }

  private resolveBffPath(): string {
    return this.config?.bffPath || "";
  }

  async getUserProfile(apiBase?: string): Promise<UserProfile> {
    const base = this.resolveApiBase(apiBase);
    const bffPath = this.resolveBffPath();
    const profileUrl = this.joinUrl(this.joinUrl(base, bffPath), "api/bff/usuario/profile");

    const userProfile = this.http.get<ApiResponse<UserProfile>>(profileUrl, {
      observe: 'response'
    });
    try {
      const response = await firstValueFrom(userProfile);

      // 2xx llega aquí; status fuera de 2xx cae en catch como HttpErrorResponse.
      if (response.status !== 200 || !response.body?.data) {
        throw new Error('Perfil de usuario sin contenido.');
      }

      return response.body.data;
    } catch (err) {
      console.error('Error fetching user profile:');
      console.error(err);
      throw err;
    }
  }

  async getUserImage(apiBase?: string): Promise<UserImageProfile> {
    const base = this.resolveApiBase(apiBase);
    const userProfile = this.http.get<ApiResponse<UserImageProfile> | UserImageProfile>(this.joinUrl(base, "api/bff/usuario/profile/img"), {
      observe: 'response'
    });
    try {
      const response = await firstValueFrom(userProfile);
      if (response.status !== 200 || !response.body) {
        throw new Error('Imagen de perfil sin contenido.');
      }
      const body = response.body as ApiResponse<UserImageProfile> | UserImageProfile;
      if ('data' in body && body.data) {
        return body.data;
      }

      return body as UserImageProfile;
    } catch (err) {
      console.error('Error fetching user profile image:');
      console.error(err);
      throw err;
    }
  }

  async updateUserProfile(apiBase: string | undefined, profileData: Partial<UserProfile>): Promise<void> {
    const base = this.resolveApiBase(apiBase);
    console.log('Updating user profile with data:', profileData);
    try {
      const response = await firstValueFrom(this.http.put(this.joinUrl(base, "api/bff/usuario/profile"), profileData, {
        observe: 'response'
      }));
      if (response.status !== 200) {
        throw new Error('Error al actualizar el perfil del usuario.');
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  }


}