'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Info, Activity, Code, BarChart3 } from 'lucide-react';

const navItems = [
  {
    name: 'Blockchain',
    href: '/',
    icon: Home,
  },
  {
    name: 'Protocols',
    href: '/protocols',
    icon: Activity,
  },
  {
    name: 'Outage Analysis',
    href: '/outage-analysis',
    icon: BarChart3,
  },
  {
    name: 'API Demo',
    href: '/api-demo',
    icon: Code,
  },
  {
    name: 'About',
    href: '/about',
    icon: Info,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-2xl">⚡</span>
              <span>Solana Outage Tracker</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              December 10, 2024
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
