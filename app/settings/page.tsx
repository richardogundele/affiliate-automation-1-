'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SettingsForm {
  openaiApiKey: string;
  googleApiKey: string;
  twitterApiKey: string;
  twitterApiSecret: string;
  facebookAccessToken: string;
}

export default function SettingsPage() {
  const { register, handleSubmit, setValue } = useForm<SettingsForm>();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('affiliateSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key as keyof SettingsForm, value as string);
      });
    }
  }, [setValue]);

  const onSubmit = (data: SettingsForm) => {
    try {
      localStorage.setItem('affiliateSettings', JSON.stringify(data));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input
                type="password"
                {...register('openaiApiKey')}
                placeholder="sk-..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Google API Key</label>
              <Input
                type="password"
                {...register('googleApiKey')}
                placeholder="Enter Google API key"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Twitter API Key</label>
              <Input
                type="password"
                {...register('twitterApiKey')}
                placeholder="Enter Twitter API key"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Twitter API Secret</label>
              <Input
                type="password"
                {...register('twitterApiSecret')}
                placeholder="Enter Twitter API secret"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Facebook Access Token</label>
              <Input
                type="password"
                {...register('facebookAccessToken')}
                placeholder="Enter Facebook access token"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}