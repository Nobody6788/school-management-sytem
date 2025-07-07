
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { settings as initialSettings } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

type SchoolSettings = typeof initialSettings;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SchoolSettings>({ ...initialSettings });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          setSettings((prev) => ({ ...prev, logo: loadEvent.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    Object.assign(initialSettings, settings);
    setIsEditing(false);
    toast({
      title: 'Settings Updated',
      description: 'The general settings have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setSettings({ ...initialSettings });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your school's general information and branding.</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={settings.logo} alt="School Logo" data-ai-hint="school logo" />
                <AvatarFallback>{settings.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change school logo</span>
                </Button>
              )}
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="hidden"
                accept="image/*"
                disabled={!isEditing}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{settings.name}</h2>
              <p className="text-sm text-muted-foreground">School Logo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input id="name" name="name" value={settings.name} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">School Email</Label>
              <Input id="email" name="email" type="email" value={settings.email} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">School Phone</Label>
              <Input id="phone" name="phone" type="tel" value={settings.phone} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">School Address</Label>
              <Input id="address" name="address" value={settings.address} onChange={handleInputChange} disabled={!isEditing} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>Edit Settings</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
