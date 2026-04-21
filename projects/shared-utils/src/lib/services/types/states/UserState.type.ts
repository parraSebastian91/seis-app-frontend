import { ISidebarMenu } from "../SidebarMenu.type";
import { UserImageSet } from "./userImageState.type";
import { UserOrgProfileState } from "./userOrgProfile.type";

export interface UserState {
    id: string;
    username: string;
    NombreCompleto: string;
    email: string;
    avatarUrl: UserImageSet;
    sidebarMenus: ISidebarMenu[];
    bannerUrl: UserImageSet;
    role: string;
    organizationProfile: UserOrgProfileState[];
    orgSelected: string; // UUID de la organización seleccionada (si el usuario pertenece a varias)
    status: 'LOADING' | 'READY' | 'ERROR';
}