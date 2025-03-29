import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET;

// Define the POST method for the authentication API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const { password: hashedPassword } = await prisma.account.findUnique({
      where: {
        username: username, // The unique field you're searching by
      },
    });

    const isMatch = await bcrypt.compare(password, hashedPassword);

    // Replace this with actual user validation logic (e.g., database query)
    if (isMatch && SECRET_KEY) {
      // Generate a JWT token
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1m' });

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

    // If credentials are invalid, return an error response
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
