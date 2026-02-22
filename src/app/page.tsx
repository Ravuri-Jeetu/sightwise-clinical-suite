"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Mail, Phone, Globe, Lock, User, ShieldCheck, Stethoscope, Loader2, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession, signIn } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { data: session, status } = useSession();
  const banner = PlaceHolderImages.find(img => img.id === 'hero-banner');
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard/redirect');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-body">
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center text-[13px] gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Globe size={14} /> w: sightwise.clinical</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> e: info@sightwise.clinical</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> 1-800-SIGHT-WISE</span>
          </div>
          <div className="flex gap-4 font-bold">
            <span>CLINIC CODE: SWC-01</span>
            <span>PORTAL: v2.5.0</span>
          </div>
        </div>
      </div>

      {/* Header / Logo Section */}
      <header className="bg-white border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Eye size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-foreground leading-none">SIGHTWISE</h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">Advanced Ophthalmology Suite</p>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <div className="w-full relative h-[250px] md:h-[350px] overflow-hidden">
        <Image
          src={banner?.imageUrl || "https://picsum.photos/seed/sightwise-banner/1200/400"}
          alt="Clinic Banner"
          fill
          className="object-cover"
          data-ai-hint="medical clinic"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-lg text-center mx-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-2">Clinical Excellence & AI Insights</h2>
            <p className="text-sm text-muted-foreground">Access your dedicated clinical portal to manage patient care and health records.</p>
          </div>
        </div>
      </div>

      {/* Info Links Section */}
      <div className="py-6 text-center bg-muted/30 border-b">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            New User or Clinical Staff? <Link href="/register" className="text-primary font-bold hover:underline">Activate your Account</Link>
          </p>
        </div>
      </div>

      {/* Login Portals Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <LoginPortalCard
            title="Physician Login"
            icon={<Stethoscope className="size-16 text-white/40 absolute bottom-0 right-0 -mb-4 -mr-2" />}
            role="Doctor / Medical Staff"
            accentColor="bg-primary"
          />

          <LoginPortalCard
            title="Reception Login"
            icon={<ClipboardList className="size-16 text-white/40 absolute bottom-0 right-0 -mb-4 -mr-2" />}
            role="Front Desk / Registrar"
            accentColor="bg-accent"
          />

          <LoginPortalCard
            title="System Admin"
            icon={<ShieldCheck className="size-16 text-white/40 absolute bottom-0 right-0 -mb-4 -mr-2" />}
            role="IT / System Manager"
            accentColor="bg-slate-800"
          />

          <LoginPortalCard
            title="Patient Portal"
            icon={<User className="size-16 text-white/40 absolute bottom-0 right-0 -mb-4 -mr-2" />}
            role="Patient / Guardian"
            accentColor="bg-secondary text-secondary-foreground"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 px-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            Copyright © All rights reserved by SightWise Clinical Technologies. Anytown, USA.
          </p>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
            Powered by Vision Analytics Solutions Pvt Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
}

function LoginPortalCard({ title, icon, role, accentColor }: { title: string, icon: React.ReactNode, role: string, accentColor: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials provided.",
        });
      } else {
        router.push('/dashboard/redirect');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className={`${accentColor.includes('bg-') ? accentColor : 'bg-primary'} p-6 relative h-32 flex flex-col justify-center`}>
        <h3 className="text-lg font-headline font-bold text-white relative z-10">{title}</h3>
        <p className="text-[10px] text-white/80 relative z-10 uppercase tracking-wider">{role}</p>
        {icon}
      </div>
      <CardContent className="p-6 space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">Username :</Label>
            <Input
              type="email"
              placeholder="name@clinic.com"
              className="h-9 rounded-sm bg-muted/20 border-muted text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">Password :</Label>
            <Input
              type="password"
              className="h-9 rounded-sm bg-muted/20 border-muted"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full font-bold shadow-md h-9 text-xs" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin size-4" /> : 'LOGIN'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
