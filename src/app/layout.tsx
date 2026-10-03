import type { Metadata } from 'next';
import './globals.css';
import { SocialProvider } from '@/context/SocialContext';
import SidebarNav from '@/components/SidebarNav';
import TrendingSidebar from '@/components/TrendingSidebar';

export const metadata: Metadata = {
  title: 'PulseSocial | Real-Time Reactive Social Feed',
  description: 'Production-ready Full-Stack Social Feed Application with real-time updates, interactive developer polls, media embeds, and profile ecosystems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-slate-950 text-slate-100 flex justify-center">
        <SocialProvider>
          <div className="flex w-full max-w-7xl">
            {/* Left Navigation */}
            <SidebarNav />

            {/* Center Main Stream Content */}
            <main className="flex-1 min-w-0 min-h-screen border-r border-slate-800">
              {children}
            </main>

            {/* Right Trending & Recommendations Sidebar */}
            <TrendingSidebar />
          </div>
        </SocialProvider>
      </body>
    </html>
  );
}
