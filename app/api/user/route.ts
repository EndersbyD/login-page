import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the POST method for the authentication API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    

    // Replace this with actual user validation logic (e.g., database query)
    if (username && password) {
      // Generate a JWT token
      await prisma.account.create({
        data: {
          id: uuidv4(),
          username,
          password: await bcrypt.hash(password, 10),
        },
      });

      // Set the token in an HTTP-only cookie for secure storage
      const response = NextResponse.json({ message: 'Account Created' });

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