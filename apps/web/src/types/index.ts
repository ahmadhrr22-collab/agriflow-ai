export type UserRole = 'ADMIN' | 'ANALYST' | 'DISTRIBUTOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}