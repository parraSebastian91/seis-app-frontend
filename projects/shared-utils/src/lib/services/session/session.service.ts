import { computed, Injectable, signal } from '@angular/core';
import { Organization } from '../../models/organization.model';
import { SessionState } from '../../models/session.model';
import { User } from '../../models/user.model';

const INITIAL_STATE: SessionState = {
  user: null,
  activeOrg: null,
  isAuthenticated: false,
};

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly #state = signal<SessionState>(INITIAL_STATE);

  readonly user = computed(() => this.#state().user);
  readonly activeOrg = computed(() => this.#state().activeOrg);
  readonly isAuthenticated = computed(() => this.#state().isAuthenticated);
  readonly userRole = computed(() => this.#state().user?.rol ?? null);

  setSession(user: User, activeOrg: Organization | null): void {
    this.#state.set({ user, activeOrg, isAuthenticated: true });
  }

  setActiveOrg(org: Organization): void {
    this.#state.update(s => ({ ...s, activeOrg: org }));
  }

  clearSession(): void {
    this.#state.set(INITIAL_STATE);
  }
}
