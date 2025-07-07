
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
  Settings,
  BedDouble,
  CalendarPlus,
  ClipboardList,
  BookCopy,
  ClipboardPenLine,
  FilePenLine,
  BookUp,
  MessageSquare,
  BookOpen,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher-dashboard', label: 'Teacher Dashboard', icon: ClipboardList },
  { href: '/teacher-dashboard/profile', label: 'My Profile', icon: User },
  { href: '/teacher-dashboard/calendar', label: 'My Calendar', icon: CalendarPlus },
  { href: '/teacher-dashboard/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/teacher-dashboard/classes', label: 'My Classes', icon: BookCopy },
  { href: '/teacher-dashboard/students', label: 'My Students', icon: Users },
  { href: '/teacher-dashboard/teachers', label: 'Teachers', icon: Contact },
  { href: '/teacher-dashboard/attendance', label: 'Attendance', icon: ClipboardPenLine },
  { href: '/teacher-dashboard/exam-attendance', label: 'Exam Attendance', icon: FilePenLine },
  { href: '/teacher-dashboard/grades', label: 'Grades', icon: GraduationCap },
  { href: '/teacher-dashboard/results', label: 'Submit Results', icon: BookUp },
  { href: '/teacher-dashboard/view-results', label: 'View Results', icon: BookCheck },
  { href: '/teacher-dashboard/noticeboard', label: 'Noticeboard', icon: Megaphone },
  { href: '/teacher-dashboard/library', label: 'Library', icon: Library },
  { href: '/teacher-dashboard/transport', label: 'Transport', icon: Bus },
  { href: '/student-dashboard', label: 'Student Dashboard', icon: GraduationCap },
  { href: '/student-dashboard/schedule', label: 'My Schedule', icon: CalendarDays },
  { href: '/student-dashboard/my-class', label: 'My Class', icon: BookCopy },
  { href: '/student-dashboard/exam-routine', label: 'Exam Routine', icon: ClipboardList },
  { href: '/student-dashboard/grades', label: 'Grades', icon: GraduationCap },
  { href: '/student-dashboard/results', label: 'My Results', icon: BookCheck },
  { href: '/student-dashboard/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/student-dashboard/library', label: 'Library', icon: Library },
  { href: '/student-dashboard/teachers', label: 'Teachers', icon: Contact },
  { href: '/student-dashboard/noticeboard', label: 'Noticeboard', icon: Megaphone },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/calendar', label: 'My Calendar', icon: CalendarPlus },
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
  { href: '/dormitories', label: 'Dormitories', icon: BedDouble },
  { href: '/accounting', label: 'Accounting', icon: DollarSign },
  { href: '/noticeboard', label: 'Noticeboard', icon: Megaphone },
  { href: '/admin', label: 'Admin', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
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
