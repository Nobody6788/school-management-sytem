'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserSquare, Home, ShieldCheck, School } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <School className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to CampusFlow</CardTitle>
          <CardDescription>Select a role to view the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button asChild size="lg" className="w-full justify-start">
            <Link href="/">
              <Shield className="mr-4 h-5 w-5" />
              Login as Admin
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full justify-start">
            <Link href="/teacher-dashboard">
              <UserSquare className="mr-4 h-5 w-5" />
              Login as Teacher
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full justify-start">
            <Link href="/student-dashboard">
              <Home className="mr-4 h-5 w-5" />
              Login as Student
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full justify-start">
            <Link href="/parent-dashboard">
              <ShieldCheck className="mr-4 h-5 w-5" />
              Login as Parent
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
