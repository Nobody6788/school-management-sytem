
'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminProfile as initialAdminProfile } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const [adminProfile, setAdminProfile] = useState({ ...initialAdminProfile });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          setAdminProfile((prev) => ({ ...prev, profilePicture: loadEvent.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, this would call an API to save the data.
    // For this prototype, we just update the state and show a toast.
    Object.assign(initialAdminProfile, adminProfile);

    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };
  
  const handleCancel = () => {
    setAdminProfile({ ...initialAdminProfile });
    setIsEditing(false);
  }

  const handlePasswordUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New password and confirm password do not match.',
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Password must be at least 6 characters long.',
        });
        return;
    }
    // In a real app, you would verify the current password and then update it.
    toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
    });
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
                <Avatar className="h-20 w-20 border">
                    <AvatarImage
                    src={adminProfile.profilePicture}
                    alt={adminProfile.name}
                    data-ai-hint="user avatar"
                    />
                    <AvatarFallback>{adminProfile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isEditing && (
                    <Button 
                        size="icon" 
                        variant="outline"
                        className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                        onClick={() => fileInputRef.current?.click()}>
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change profile picture</span>
                    </Button>
                )}
                <Input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <div>
              <CardTitle className="text-2xl">{adminProfile.name}</CardTitle>
              <CardDescription>
                View and manage your personal profile information.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={adminProfile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={adminProfile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={adminProfile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={adminProfile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password here.</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" required value={passwordData.currentPassword} onChange={handlePasswordInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" required value={passwordData.newPassword} onChange={handlePasswordInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={handlePasswordInputChange} />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Update Password</Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
