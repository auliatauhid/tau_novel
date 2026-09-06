import { getServerSession } from 'next-auth';
import { authOptions } from './options';
import { redirect } from 'next/navigation';

export async function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session?.user) return null;
  return session.user as {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'USER' | 'ADMIN';
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?error=UnauthorizedAdmin');
  }
  return user;
}
