'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(
    urlError === 'UnauthorizedAdmin'
      ? 'Akses terbatas untuk akun Administrator.'
      : urlError
      ? 'Email atau password salah.'
      : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email atau kata sandi tidak cocok.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan saat masuk. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-stone-200/90 dark:border-stone-800/90 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-3xl p-2 sm:p-4">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
          <BookOpen className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Masuk ke Akun
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Nikmati pengalaman membaca novel tanpa batas dan simpan kemajuan membaca Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-700 dark:text-red-300 text-xs font-medium animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Alamat Email
            </label>
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl font-semibold shadow-sm" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
          </Button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-1">
          Belum memiliki akun?{' '}
          <Link href="/register" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
            Daftar Akun Baru
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-[#f7f5f0] via-[#f5f2ea] to-[#f7f5f0] dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-3 py-1.5 rounded-full hover:bg-white/60 dark:hover:bg-stone-900/60"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      <Suspense fallback={<div className="text-xs text-stone-500">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
