import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

const rpName = 'Crypto Portfolio Dashboard';
const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
const origin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, username, response: credentialResponse } = body;

    if (step === 'options') {
      // Step 1: Generate registration options
      if (!username || typeof username !== 'string' || username.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }

      const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: username,
        userName: username,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
          authenticatorAttachment: 'platform',
        },
      });

      // Store challenge temporarily (in production, use Redis or session)
      // For now, we'll send it back and expect it in the verification step
      return NextResponse.json({ options });
    }

    if (step === 'verify') {
      // Step 2: Verify registration response
      if (!username || !credentialResponse) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const verification = await verifyRegistrationResponse({
        response: credentialResponse,
        expectedChallenge: credentialResponse.challenge || '',
        expectedOrigin: origin,
        expectedRPID: rpID,
      });

      if (!verification.verified || !verification.registrationInfo) {
        return NextResponse.json(
          { error: 'Registration verification failed' },
          { status: 400 }
        );
      }

      const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;

      // Create user and credential
      const user = await prisma.user.create({
        data: {
          username,
          credentials: {
            create: {
              credentialID: Buffer.from(credentialID).toString('base64'),
              credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
              counter,
              transports: credentialResponse.response?.transports || [],
            },
          },
        },
        include: { credentials: true },
      });

      // Create session
      const sessionToken = await createSession(user.id);

      const response = NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username },
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
