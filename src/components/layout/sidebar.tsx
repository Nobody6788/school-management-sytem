
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  BookUser,
  CalendarDays,
  School,
  LogOut,
  Shield,
  UserCheck,
  Megaphone,
  Contact,
  GraduationCap,
  ClipboardCheck,
  BookCheck,
  Library,
  Bus,
  DollarSign,
  User,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/teachers', label: 'Teachers', icon: BookUser },
  { href: '/parents', label: 'Parents', icon: Contact },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/attendance', label: 'Attendance', icon: UserCheck },
  { href: '/exam-attendance', label: 'Exam Attendance', icon: ClipboardCheck },
  { href: '/grades', label: 'Grades', icon: GraduationCap },
  { href: '/results', label: 'Results', icon: BookCheck },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/transport', label: 'Transport', icon: Bus },
  { href: '/accounting', label: 'Accounting', icon: DollarSign },
  { href: '/noticeboard', label: 'Noticeboard', icon: Megaphone },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <School className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold">CampusFlow</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={<item.icon />}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
              <SidebarMenuButton icon={<LogOut />}>
                Logout
              </SidebarMenuButton>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
