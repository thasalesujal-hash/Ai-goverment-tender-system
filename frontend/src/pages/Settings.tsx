import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <AppLayout>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-slate-900'>{t('settings.title')}</h1>
          <p className='mt-2 text-slate-600'>
            {t('settings.description') || 'Manage your account preferences and application settings.'}
          </p>
        </div>

        <div className='grid gap-6'>
          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <User size={24} />
              </div>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold text-slate-900'>{t('settings.account') || 'Account'}</h2>
                <p className='text-sm text-slate-500'>
                  {t('settings.accountDescription') || 'Manage your account details and preferences.'}
                </p>
              </div>
              <Button variant='outline'>{t('common.edit') || 'Edit'}</Button>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <Bell size={24} />
              </div>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold text-slate-900'>{t('settings.notifications') || 'Notifications'}</h2>
                <p className='text-sm text-slate-500'>
                  {t('settings.notificationsDescription') || 'Configure how and when you receive alerts.'}
                </p>
              </div>
              <Button variant='outline'>{t('settings.configure') || 'Configure'}</Button>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <Shield size={24} />
              </div>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold text-slate-900'>{t('settings.privacySecurity') || 'Privacy & Security'}</h2>
                <p className='text-sm text-slate-500'>
                  {t('settings.privacySecurityDescription') || 'Manage your privacy settings and security options.'}
                </p>
              </div>
              <Button variant='outline'>{t('settings.manage') || 'Manage'}</Button>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <Palette size={24} />
              </div>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold text-slate-900'>{t('settings.appearance') || 'Appearance'}</h2>
                <p className='text-sm text-slate-500'>
                  {t('settings.appearanceDescription') || 'Customize the look and feel of the application.'}
                </p>
              </div>
              <Button variant='outline'>{t('settings.customize') || 'Customize'}</Button>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                <Globe size={24} />
              </div>
              <div className='flex-1'>
                <h2 className='text-lg font-semibold text-slate-900'>{t('settings.language') || 'Language'}</h2>
                <p className='text-sm text-slate-500'>
                  {t('settings.languageDescription') || 'Choose your preferred language for the interface.'}
                </p>
              </div>
              <div className='md:flex-shrink-0'>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
                  className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                >
                  <option value='en'>English</option>
                  <option value='hi'>??????</option>
                  <option value='mr'>?????</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
