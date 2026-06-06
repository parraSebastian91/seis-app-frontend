import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class NotificationSocketService {
    
    private socket: Socket | undefined;

    // Signal para que el Shell y MFEs lean las notificaciones
    public notifications = signal<any[]>([]);
    public unreadCount = signal(0);

    private readonly defaultSocketUrl = typeof window !== 'undefined' ? `${window.location.origin}/notifications` : 'http://localhost:8000/notifications';
    private readonly defaultSocketPath = '/api/bff/socket.io';

    constructor() {}

    private listenToNotifications() {
        this.socket?.on('new_notification', (data) => {
            // Actualizamos el Signal añadiendo la nueva notificación al inicio
            this.notifications.update(prev => [data, ...prev]);
            this.unreadCount.update(count => count + 1);

            // Aquí podrías disparar un Toast de una librería externa
            console.log('¡Grito recibido del BFF!', data);
        });
    }

    connect(userId: string, socketUrl = this.defaultSocketUrl, socketPath = this.defaultSocketPath) {
        console.log('Conectando al WebSocket');
        if (this.socket?.connected) return; // Evita duplicados
 
        this.socket = io(socketUrl, {
            path: socketPath,
            query: { userId },
            reconnectionAttempts: 5,
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('WebSocket conectado:', this.socket?.id);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Error de conexión WebSocket:', error);
        });

        this.listenToNotifications();
    }

    sendMessage(eventName: string, payload: unknown) {
        if (!this.socket) {
            console.warn('Socket no inicializado. Debes llamar connect() primero.');
            return;
        }

        this.socket.emit(eventName, payload);
    }

    onMessage(eventName: string, handler: (payload: unknown) => void) {
        if (!this.socket) {
            console.warn('Socket no inicializado. Debes llamar connect() primero.');
            return;
        }

        this.socket.on(eventName, handler);
    }

    offMessage(eventName: string, handler?: (payload: unknown) => void) {
        if (!this.socket) {
            return;
        }

        if (handler) {
            this.socket.off(eventName, handler);
            return;
        }

        this.socket.off(eventName);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = undefined;
        }
    }
}