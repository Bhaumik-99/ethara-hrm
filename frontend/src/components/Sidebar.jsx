import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
];

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        data-testid="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-[#E4E4E7] shadow-sm hover:bg-[#F5F5F0] transition-colors"
      >
        {mobileOpen ? <X className="h-5 w-5 text-[#1A4D2E]" /> : <Menu className="h-5 w-5 text-[#1A4D2E]" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-testid="sidebar"
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E4E4E7] z-40 flex flex-col transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1A4D2E] flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-tight">E</span>
            </div>
            <div>
              <h1 data-testid="brand-name" className="text-lg font-bold text-[#1A4D2E] tracking-tight leading-none">
                Ethara.AI
              </h1>
              <p className="text-xs text-[#71717A] mt-0.5">HRMS Lite</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = item.to === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.to);
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                data-testid={`nav-${item.label.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#F5F5F0] text-[#1A4D2E]"
                    : "text-[#71717A] hover:bg-[#FAFAFA] hover:text-[#1A4D2E]"
                )}
              >
                <item.icon className={cn("h-[18px] w-[18px]", isActive ? "text-[#1A4D2E]" : "text-[#A1A1AA]")} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E4E4E7]">
          <p className="text-xs text-[#A1A1AA]">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
