import { ReactNode } from 'react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';

type SiteFrameProps = {
  children: ReactNode;
};

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb absolute left-[-12rem] top-[-10rem] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(200,169,94,0.2),_transparent_68%)]" />
        <div className="ambient-orb absolute right-[-9rem] top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(143,120,214,0.18),_transparent_70%)]" />
        <div className="ambient-orb absolute bottom-[-12rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(95,143,214,0.16),_transparent_72%)]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 lg:px-8">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
