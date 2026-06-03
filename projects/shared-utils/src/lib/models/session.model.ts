import { User } from './user.model';
import { Organization } from './organization.model';

export interface SessionState {
  user: User | null;
  activeOrg: Organization | null;
  isAuthenticated: boolean;
}
