// 'use client';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
// import { useTransition } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import * as z from 'zod';
// import GithubSignInButton from './github-auth-button';

// const formSchema = z.object({
//   email: z.string().email({ message: 'Enter a valid email address' })
// });

// type UserFormValue = z.infer<typeof formSchema>;

// export default function UserAuthForm() {
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl');
//   const [loading, startTransition] = useTransition();
//   const defaultValues = {
//     email: 'demo@gmail.com'
//   };
//   const form = useForm<UserFormValue>({
//     resolver: zodResolver(formSchema),
//     defaultValues
//   });

//   const onSubmit = async (data: UserFormValue) => {
//     startTransition(() => {
//       signIn('credentials', {
//         email: data.email,
//         callbackUrl: callbackUrl ?? '/dashboard'
//       });
//       toast.success('Signed In Successfully!');
//     });
//   };

//   return (
//     <>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full space-y-2"
//         >
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="email"
//                     placeholder="Enter your email..."
//                     disabled={loading}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button disabled={loading} className="ml-auto w-full" type="submit">
//             Continue With Email
//           </Button>
//         </form>
//       </Form>
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       <GithubSignInButton />
//     </>
//   );
// }
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import SignupModal from './signup-modal'; // Import the signup modal component

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // State to manage modal visibility
  const [loading, startTransition] = useTransition();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const { message } = await response.json();
          toast.success(message);

          // Redirect user to dashboard
          window.location.href = '/dashboard';
        } else {
          const { message } = await response.json();
          toast.error(message || 'Invalid credentials');
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again later.');
        console.error('Login error:', error);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>

      {/* Signup Link */}
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => setIsSignupModalOpen(true)}
        >
          Sign Up
        </span>
      </p>

      {/* Signup Modal */}
      {isSignupModalOpen && <SignupModal onClose={() => setIsSignupModalOpen(false)} />}
    </>
  );
}
