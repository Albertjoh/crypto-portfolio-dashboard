import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
const origin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, email, response: credentialResponse } = body;

    if (step === 'options') {
      // Step 1: Generate authentication options
      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      // Find user and their credentials
      const user = await prisma.user.findUnique({
        where: { email },
        include: { credentials: true },
      });

      if (!user || user.credentials.length === 0) {
        return NextResponse.json(
          { error: 'User not found or no credentials registered' },
          { status: 404 }
        );
      }

      const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: user.credentials.map((cred) => ({
          id: Buffer.from(cred.credentialID, 'base64'),
          type: 'public-key',
          transports: cred.transports as AuthenticatorTransport[],
        })),
        userVerification: 'preferred',
      });

      return NextResponse.json({ options });
    }

    if (step === 'verify') {
      // Step 2: Verify authentication response
      if (!email || !credentialResponse) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Find user and credential
      const user = await prisma.user.findUnique({
        where: { email },
        include: { credentials: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const credentialID = credentialResponse.id;
      const credential = user.credentials.find(
        (cred) => cred.credentialID === Buffer.from(credentialID, 'base64url').toString('base64')
      );

      if (!credential) {
        return NextResponse.json(
          { error: 'Credential not found' },
          { status: 404 }
        );
      }

      const verification = await verifyAuthenticationResponse({
        response: credentialResponse,
        expectedChallenge: credentialResponse.challenge || '',
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
          credentialID: Buffer.from(credential.credentialID, 'base64'),
          credentialPublicKey: Buffer.from(credential.credentialPublicKey, 'base64'),
          counter: credential.counter,
        },
      });

      if (!verification.verified) {
        return NextResponse.json(
          { error: 'Authentication verification failed' },
          { status: 400 }
        );
      }

      // Update counter
      await prisma.credential.update({
        where: { id: credential.id },
        data: { counter: verification.authenticationInfo.newCounter },
      });

      // Create session
      const sessionToken = await createSession(user.id);

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, email: user.email },
      });

      // Set session cookie
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid step' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
