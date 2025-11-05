import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Get the current session from cookies
 */
export async function getSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      // Clean up expired session
      await prisma.session.delete({
        where: { id: session.id },
      });
    }
    return null;
  }

  return session;
}

/**
 * Get the current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Delete a session
 */
export async function deleteSession(token: string) {
  await prisma.session.deleteMany({
    where: { token },
  });
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
