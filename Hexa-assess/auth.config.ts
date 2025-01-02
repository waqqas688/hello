import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongoDB from '@/lib/mongodb';
import User from '@/models/user';
import bcrypt from 'bcrypt';

const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          throw new Error('Invalid credentials provided.');
        }

        const { email, password } = credentials;

        await connectMongoDB();

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password.');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
