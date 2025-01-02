import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: 'Email or username already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json({ message: 'Signup successful!' }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error.', error: error.message }, { status: 500 });
  }
}
