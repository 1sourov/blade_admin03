import React, { useState } from 'react';
import {
  BadgeCheck,
  BarChart3,
  Film,
  Flag,
  FolderKanban,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Upload,
  Users,
  X,
} from 'lucide-react';
import type { AdminRecord, NavSection } from '../types/blade';

interface AdminLayoutProps {
  admin: AdminRecord;
  activeSection: NavSection;
  breadcrumbDetail?: string;
  onNavigate: (section: NavSection) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'upload-video', label: 'Upload Video', icon: Upload },
  { id: 'verification', label: 'Verification', icon: BadgeCheck },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
  { id: 'categories', label: 'Categories', icon: FolderKanban },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'admins', label: 'Admin Management', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({
  admin,
  activeSection,
  breadcrumbDetail,
  onNavigate,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionLabel =
    activeSection === 'user-details'
      ? 'Users'
      : NAV_ITEMS.find((i) => i.id === activeSection)?.label ?? 'Dashboard';

  const handleNavClick = (id: NavSection) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-zinc-950 text-white w-64 select-none">
      <div className="px-5 h-16 flex items-center justify-between border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/assets/aistudio/Bold_Red_Geometric_B_Logo_701917dd.png"
            alt="BLADE"
            className="w-8 h-8 rounded object-cover shrink-0"
          />
          <span className="font-display font-bold tracking-tight text-sm text-white truncate">
            BLADE ADMIN PANEL
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeSection === item.id ||
            (item.id === 'users' && activeSection === 'user-details');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800 shrink-0">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs font-semibold text-white truncate">{admin.username}</div>
          <div className="text-[11px] text-zinc-400 truncate">{admin.email}</div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-zinc-800 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Collapsible Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between gap-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-700 hover:text-zinc-950 rounded-md"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="font-semibold text-zinc-500 whitespace-nowrap">BLADE</span>
              <span className="text-zinc-300" aria-hidden="true">/</span>
              <span className="font-bold text-zinc-950 truncate">{sectionLabel}</span>
              {breadcrumbDetail && (
                <>
                  <span className="text-zinc-300" aria-hidden="true">/</span>
                  <span className="text-zinc-600 font-mono text-xs truncate">
                    {breadcrumbDetail}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('upload-video')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Video
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-zinc-50/50">{children}</main>
      </div>
    </div>
  );
}
