import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiResponse } from "../types/api-response.model";
import { UserProfile } from "../types/userProfile.type";



@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  async getUserProfile(apiBase: string, correo: string): Promise<UserProfile> {
    const userProfile = this.http.get<ApiResponse<UserProfile>>(`${apiBase}/api/bff/usuario/profile`);
    try {
      const res = await firstValueFrom(userProfile);
      console.log(res);
      return res.data as UserProfile;
    } catch (err) {
      console.error('Error fetching user profile:');
      console.error(err);
      throw err;
    }
  }

}