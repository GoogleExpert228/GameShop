import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const endcodedKey = new TextEncoder().encode(secretKey);

interface Payload extends JWTPayload {
    userId: string;
}

async function encode(payload: Payload) {
    return new SignJWT(payload) 
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2d')
        .sign(endcodedKey);
}

async function decode(session: string | undefined = '') {
    try {
      const { payload } = await jwtVerify<Payload>(session, endcodedKey, {
        algorithms: ['HS256'],
      });
      return payload;
    } catch {
      return null;
    }
  }

export async function createSession(payload: Payload) {
    const session = await encode(payload);
    const expires = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires, 
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const session = cookies().get('session')?.value;
    const payload = await decode(session);

    if(!session || !payload) {
        return null;
    }

    return payload;
}

export function deleteSession() {
    cookies().delete('session');
}