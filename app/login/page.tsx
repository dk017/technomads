"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/components/AuthContext';
import { supabase } from '../supabaseClient';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      router.push('/');
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  };


  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
            <Button type="submit" className="w-full">Log In</Button>
          </form>
          <div className="mt-4">
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
              Log In with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}