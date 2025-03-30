import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET;

type Expiration =
    | `${number}`
    | `${number}h`
    | `${number}m`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const result = await prisma.account.findUnique({
      where: {
        username: username,
      },
    });

    const hashedPassword = result ? result.password : '';

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch && SECRET_KEY) {
      // Generate a JWT token
      const expiration = process.env.JWT_EXPIRATION as Expiration || '1h' ;
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: expiration });

      // Set the token in an HTTP-only cookie for secure storage
      const response = NextResponse.json({ message: 'Login successful' });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
