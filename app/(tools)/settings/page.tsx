'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, LogOut } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

interface UserSettings {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
}

export default function SettingsPage() {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const { data } = await axios.get('/api/settings');
            return data.data as UserSettings;
        }
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (newName) {
                await updateName();
                toast.success('Name updated successfully');
            }
            if (newEmail) {
                await updateEmail();
                toast.success('Email updated successfully');
            }
            setIsEditingProfile(false);
        } catch (error) {
            console.log(error);
            toast.error('Failed to update profile');
        }
    };

    const updateName = async () => {
        try {
            await authClient.updateUser({
                name: newName,
            });
        } catch (error) {
            throw error;
        }
    };

    const updateEmail = async () => {
        try {
            await authClient.changeEmail({
                newEmail,
            });
        } catch (error) {
            throw error;
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password too short");
            return;
        }
        try {
            setUpdatingPassword(true);
            const resp = await authClient.changePassword({
                newPassword,
                currentPassword: oldPassword,
                revokeOtherSessions: true,
            });
            if (resp.error?.code == "INVALID_PASSWORD") {
                toast.error('Invalid current password');
                return;
            }
            toast.success('Password updated successfully');
            setNewPassword('');
            setConfirmNewPassword('');
            setOldPassword('');
        } catch (error) {
            console.log(error);
            toast.error('Failed to update password');
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            redirect('/login');
        } catch (error) {
            console.log(error);
            toast.error('Failed to logout');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </Button>
                </div>

                <Separator className="bg-gray-200" />
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription className="text-gray-600">
                            Manage your personal information and email preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleProfileUpdate} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="border-gray-300"
                                            placeholder={settings?.name}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            type="email"
                                            className="border-gray-300"
                                            placeholder={settings?.email}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                                        Save Changes
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm text-gray-500">Name</Label>
                                <div className="text-lg font-medium">{settings?.name}</div>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Email</Label>
                                <div className="text-lg font-medium">{settings?.email}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription className="text-gray-600">
                            Ensure your account stays secure by updating your password regularly
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                            <DialogTrigger asChild>
                                <Button className="bg-black hover:bg-gray-800 text-white">
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="border-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="border-gray-300"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-black hover:bg-gray-800 text-white"
                                        disabled={updatingPassword}
                                    >
                                        {updatingPassword ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}