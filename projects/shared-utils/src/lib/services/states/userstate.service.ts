/*
https://docs.nestjs.com/providers#services
*/

import { computed, signal } from '@angular/core';
import { Injectable } from "@angular/core";

export interface UserImageSet {
    small: string;
    medium: string;
    large: string;
}

const DEFAULT_AVATAR = 'assets/placeholders/user.png';
const DEFAULT_BANNER = 'assets/placeholders/banner.png';

export interface UserState {
    id: string;
    username: string;
    NombreCompleto: string;
    email: string;
    avatarUrl: UserImageSet | string;
    bannerUrl: UserImageSet | string;
    role: string;
    status: 'LOADING' | 'READY' | 'ERROR';
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
    // Inicializamos con un estado por defecto/loading
    private _state = signal<UserState>({
        id: '',
        username: '',
        NombreCompleto: '',
        email: '',
        avatarUrl: DEFAULT_AVATAR,
        bannerUrl: DEFAULT_BANNER,
        role: '',
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
    setAvatar(url: UserImageSet | string) {
        if (typeof url === 'string') {
            // Si es una URL directa, convertimos a formato de objeto para mantener consistencia
            this._state.update(current => ({ ...current, avatarUrl: url }));
        } else {
            this._state.update(current => ({
                ...current,
                avatarUrl: {
                    small: url.small,
                    medium: url.medium,
                    large: url.large
                }
            }));
        }

    }

    setBanner(url: UserImageSet | string) {
        if (typeof url === 'string') {
            this._state.update(current => ({ ...current, bannerUrl: url }));
        } else {
            this._state.update(current => ({
                ...current,
                bannerUrl: {
                    small: url.small,
                    medium: url.medium,
                    large: url.large
                }
            }));
        }
    }

    reset() {
        this._state.set({
            id: '',
            username: '',
            NombreCompleto: '',
            email: '',
            avatarUrl: DEFAULT_AVATAR,
            bannerUrl: DEFAULT_BANNER,
            role: '',
            status: 'LOADING'
        });
    }

    private toImageSrc(image: UserImageSet | string, fallback: string): string {
        if (typeof image === 'string') {
            return image || fallback;
        }

        return image.medium || image.small || image.large || fallback;
    }
}