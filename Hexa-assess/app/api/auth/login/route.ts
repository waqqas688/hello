import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.AUTH_SECRET!, {
      expiresIn: '1d',
    });

    return NextResponse.json({ message: 'Login successful.', token }, { status: 200 });
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error.', error: error.message }, { status: 500 });
  }
}
