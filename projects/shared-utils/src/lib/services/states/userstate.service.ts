/*
https://docs.nestjs.com/providers#services
*/

import { computed, signal } from '@angular/core';
import { Injectable } from "@angular/core";
import { UserState } from '../types/states/UserState.type';
import { UserOrgProfileState } from '../types/states/userOrgProfile.type';
import { UserImageSet } from '../types/states/userImageState.type';


const DEFAULT_AVATAR = 'assets/placeholders/user.png';
const DEFAULT_BANNER = 'assets/placeholders/banner.png';



@Injectable({ providedIn: 'root' })
export class UserStateService {
    // Inicializamos con un estado por defecto/loading
    private _state = signal<UserState>({
        id: '',
        username: '',
        NombreCompleto: '',
        email: '',
        avatarUrl: {
            small: DEFAULT_AVATAR,
            medium: DEFAULT_AVATAR,
            large: DEFAULT_AVATAR
        },
        bannerUrl: {
            small: DEFAULT_BANNER,
            medium: DEFAULT_BANNER,
            large: DEFAULT_BANNER
        },
        sidebarMenus: [],
        role: '',
        organizationProfile: [{
            razonSocial: '',
            uuid: ''
        }],
        orgSelected: '',
        status: 'LOADING'
    });

    // Exponemos el estado completo y también "selectores" específicos
    // Esto evita que los componentes tengan que hacer user().avatarUrl
    state = this._state.asReadonly();
    avatar = computed(() => this._state().avatarUrl);
    banner = computed(() => this._state().bannerUrl);
    userName = computed(() => this._state().username);
    fullName = computed(() => this._state().NombreCompleto);
    email = computed(() => this._state().email);
    role = computed(() => this._state().role);
    avatarSrc = computed(() => this.toImageSrc(this._state().avatarUrl, DEFAULT_AVATAR));
    bannerSrc = computed(() => this.toImageSrc(this._state().bannerUrl, DEFAULT_BANNER));
    displayName = computed(() => this._state().NombreCompleto || this._state().username || 'Usuario');
    isLoading = computed(() => this._state().status === 'LOADING');
    isReady = computed(() => this._state().status === 'READY');
    isError = computed(() => this._state().status === 'ERROR');
    sidebarMenus = computed(() => this._state().sidebarMenus);
    organizationProfile = computed(() => this._state().organizationProfile);
    orgSelected = computed(() => this._state().orgSelected);


    // Método para cargar datos iniciales (desde el Shell o el MFE de Auth)
    initialize(userData: Partial<UserState>) {
        this._state.update(current => ({ ...current, ...userData, status: 'READY' }));
    }

    patch(userData: Partial<UserState>) {
        this._state.update(current => ({ ...current, ...userData }));
    }

    setStatus(status: UserState['status']) {
        this._state.update(current => ({ ...current, status }));
    }

    // Método específico para el "hot-swap" del avatar cuando Rust termine
    setAvatar(url: UserImageSet) {
        this._state.update(current => ({
            ...current,
            avatarUrl: {
                small: url.small,
                medium: url.medium,
                large: url.large
            }
        }));
    }

    setBanner(url: UserImageSet) {
        this._state.update(current => ({
            ...current,
            bannerUrl: {
                small: url.small,
                medium: url.medium,
                large: url.large
            }
        }));
    }

    setBasicInfo(id: string, username: string, fullName: string, email: string, role: string) {
        this._state.update(current => ({
            ...current,
            id,
            username,
            NombreCompleto: fullName,
            email,
            role
        }));
    }

    setOrganizationProfile(profile: UserOrgProfileState[]) {
        this._state.update(current => ({
            ...current,
            organizationProfile: profile
        }));
    }

    setOrgSelected(orgSelected: string) {
        this._state.update(current => ({
            ...current,
            orgSelected
        }));
    }    

    reset() {
        this._state.set({
            id: '',
            username: '',
            NombreCompleto: '',
            email: '',
            avatarUrl: {
                small: DEFAULT_AVATAR,
                medium: DEFAULT_AVATAR,
                large: DEFAULT_AVATAR
            },
            bannerUrl: {
                small: DEFAULT_BANNER,
                medium: DEFAULT_BANNER,
                large: DEFAULT_BANNER
            },
            sidebarMenus: [],
            role: '',
            organizationProfile: [{
                razonSocial: '',
                uuid: ''
            }],
            orgSelected: '',
            status: 'LOADING'
        });
    }

    private toImageSrc(image: UserImageSet, fallback: string): string {
        return image.medium || image.small || image.large || fallback;
    }
}