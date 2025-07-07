
'use client';

import React from 'react';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  Home,
  ShieldCheck,
  UserSquare,
  UsersRound,
  ChevronRight,
} from 'lucide-react';


const adminMenu = {
    title: "Admin",
    icon: Shield,
    links: [
        { href: '/admin', label: 'Academic Setup', icon: Shield },
        { href: '/students', label: 'Students', icon: Users },
        { href: '/teachers', label: 'Teachers', icon: BookUser },
        { href: '/parents', label: 'Parents', icon: Contact },
        { href: '/schedule', label: 'Schedule', icon: CalendarDays },
        { href: '/attendance', label: 'Attendance', icon: UserCheck },
        { href: '/exam-attendance', label: 'Exam Attendance', icon: ClipboardCheck },
        { href: '/grades', label: 'Grades', icon: GraduationCap },
        { href: '/results', label: 'Results', icon: BookCheck },
        { href: '/noticeboard', label: 'Noticeboard', icon: Megaphone },
        { href: '/library', label: 'Library', icon: Library },
        { href: '/transport', label: 'Transport', icon: Bus },
        { href: '/dormitories', label: 'Dormitories', icon: BedDouble },
        { href: '/accounting', label: 'Accounting', icon: DollarSign },
        { href: '/calendar', label: 'Events Calendar', icon: CalendarPlus },
        { href: '/profile', label: 'My Profile', icon: User },
        { href: '/settings', label: 'Settings', icon: Settings },
    ]
};

const teacherMenu = {
    title: "Teacher",
    icon: UserSquare,
    links: [
        { href: '/teacher-dashboard', label: 'Dashboard', icon: UserSquare },
        { href: '/teacher-dashboard/profile', label: 'My Profile', icon: User },
        { href: '/teacher-dashboard/calendar', label: 'My Calendar', icon: CalendarPlus },
        { href: '/teacher-dashboard/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/teacher-dashboard/classes', label: 'My Classes', icon: BookCopy },
        { href: '/teacher-dashboard/students', label: 'My Students', icon: Users },
        { href: '/teacher-dashboard/teachers', label: 'Colleagues', icon: UsersRound },
        { href: '/teacher-dashboard/attendance', label: 'Take Attendance', icon: ClipboardPenLine },
        { href: '/teacher-dashboard/exam-attendance', label: 'Exam Attendance', icon: FilePenLine },
        { href: '/teacher-dashboard/grades', label: 'Grading System', icon: GraduationCap },
        { href: '/teacher-dashboard/results', label: 'Submit Results', icon: BookUp },
        { href: '/teacher-dashboard/view-results', label: 'View Results', icon: BookCheck },
        { href: '/teacher-dashboard/noticeboard', label: 'Noticeboard', icon: Megaphone },
        { href: '/teacher-dashboard/library', label: 'Library', icon: Library },
        { href: '/teacher-dashboard/transport', label: 'Transport', icon: Bus },
    ]
};

const studentMenu = {
    title: "Student",
    icon: Home,
    links: [
        { href: '/student-dashboard', label: 'Dashboard', icon: Home },
        { href: '/student-dashboard/profile', label: 'My Profile', icon: User },
        { href: '/student-dashboard/calendar', label: 'My Calendar', icon: CalendarPlus },
        { href: '/student-dashboard/schedule', label: 'My Schedule', icon: CalendarDays },
        { href: '/student-dashboard/my-class', label: 'My Class', icon: BookCopy },
        { href: '/student-dashboard/exam-routine', label: 'Exam Routine', icon: ClipboardList },
        { href: '/student-dashboard/grades', label: 'Grades', icon: GraduationCap },
        { href: '/student-dashboard/results', label: 'My Results', icon: BookCheck },
        { href: '/student-dashboard/subjects', label: 'Subjects', icon: BookOpen },
        { href: '/student-dashboard/library', label: 'Library', icon: Library },
        { href: '/student-dashboard/teachers', label: 'Teachers', icon: BookUser },
        { href: '/student-dashboard/noticeboard', label: 'Noticeboard', icon: Megaphone },
        { href: '/student-dashboard/messaging', label: 'Messaging', icon: MessageSquare },
    ]
};

const parentMenu = {
    title: "Parent",
    icon: ShieldCheck,
    links: [
        { href: '/parent-dashboard', label: 'Dashboard', icon: ShieldCheck },
        { href: '/parent-dashboard/profile', label: 'My Profile', icon: User },
        { href: '/parent-dashboard/calendar', label: 'My Calendar', icon: CalendarPlus },
        { href: '/parent-dashboard/schedule', label: "Child's Schedule", icon: CalendarDays },
        { href: '/parent-dashboard/exam-routine', label: "Exam Routine", icon: ClipboardList },
        { href: '/parent-dashboard/grades', label: 'Grading System', icon: GraduationCap },
        { href: '/parent-dashboard/results', label: "Child's Results", icon: BookCheck },
        { href: '/parent-dashboard/teachers', label: 'Teachers', icon: BookUser },
        { href: '/parent-dashboard/library', label: 'Library', icon: Library },
        { href: '/parent-dashboard/parents', label: 'Other Parents', icon: UsersRound },
        { href: '/parent-dashboard/messaging', label: 'Messaging', icon: MessageSquare },
        { href: '/parent-dashboard/noticeboard', label: 'Noticeboard', icon: Megaphone },
    ]
};

const menuGroups = [adminMenu, teacherMenu, studentMenu, parentMenu];


const CollapsibleSidebarMenu = ({
  menu,
  pathname,
}: {
  menu: { title: string; icon: React.ElementType; links: { href: string; label: string; icon: React.ElementType }[] };
  pathname: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(menu.links.some(link => pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')));
  const TitleIcon = menu.icon;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="justify-between">
          <div className="flex items-center gap-2">
            <TitleIcon />
            <span>{menu.title}</span>
          </div>
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu className="pl-4 pt-1">
          {menu.links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  icon={<link.icon />}
                >
                  {link.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
};


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
            <SidebarMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <SidebarMenuButton
                    isActive={pathname === '/'}
                    icon={<LayoutDashboard />}
                    >
                    Dashboard
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            {menuGroups.map((group) => (
                <SidebarMenuItem key={group.title}>
                    <CollapsibleSidebarMenu menu={group} pathname={pathname} />
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
           <SidebarMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <SidebarMenuButton icon={<LogOut />}>
                  Logout
                </SidebarMenuButton>
              </Link>
           </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
