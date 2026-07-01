import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../types/api-response.model";
import { UserProfile } from "../types/userProfile.type";
import { UserImageProfile } from "../types/imageProfile.type";
import { userOrgProfile } from "../types/userOrgProfile.type";


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

  /** Base URL configurable — vacía por defecto (rutas relativas detrás de Kong) */
  private resolveApiBase(): string {
    return this.config?.apiBase || '';
  }

  private resolveBffPath(): string {
    return this.config?.bffPath || "";
  }

  async getUserProfile(): Promise<UserProfile> {
    const url = `${this.resolveApiBase()}/api/bff/usuario/profile`;
    const userProfile = this.http.get<ApiResponse<UserProfile>>(url, {
      observe: 'response',
      withCredentials: true
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

  async getUserImage(): Promise<UserImageProfile> {
    const url = `${this.resolveApiBase()}/api/bff/usuario/profile/img`;
    const userProfile = this.http.get<ApiResponse<UserImageProfile> | UserImageProfile>(url, {
      observe: 'response',
      withCredentials: true
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

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    const url = `${this.resolveApiBase()}/api/bff/usuario/profile`;
    console.log('Updating user profile with data:', profileData);
    try {
      const response = await firstValueFrom(this.http.put(url, profileData, {
        observe: 'response',
        withCredentials: true
      }));
      if (response.status !== 200) {
        throw new Error('Error al actualizar el perfil del usuario.');
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  }

  async getUserOrganizationProfile(): Promise<userOrgProfile> {
    const url = `${this.resolveApiBase()}/api/bff/usuario/profile/organizacion`;
    try {
      const response = await firstValueFrom(this.http.get<ApiResponse<userOrgProfile>>(url, {
        observe: 'response',
        withCredentials: true
      }));
      if (response.status !== 200 || !response.body?.data) {
        throw new Error('Perfil de organización sin contenido.');
      }
      return response.body.data;
    } catch (err) {
      console.error('Error fetching user organization profile:');
      console.error(err);
      throw err;
    }
  }
}
