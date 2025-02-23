"use client"

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  PiggyBank,
  Settings,
  LogOut,
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { authClient } from '@/lib/auth-client';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const [screenType, setScreenType] = useState('laptop');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const toolsIndexArray: [string, number][] = [
    ["habits", 0],
    ["attendance", 1],
    ["expense", 2],
    ["budget", 3],
    ["settings", 4]
  ]

  const toolsIndexMap = new Map<string, number>(toolsIndexArray);
  const pathname = usePathname();
  const path = pathname?.slice(1);

  useEffect(() => {
    if (path) {
      setActiveItem(toolsIndexMap.get(path) ?? null);
    }
  }, [path]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setScreenType('laptop');
        setIsCollapsed(false);
      } else if (width >= 768) {
        setScreenType('tablet');
        setIsCollapsed(true);
      } else {
        setScreenType('mobile');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <Calendar className="h-5 w-5" />, label: 'Habit Tracker', page: '/habits' },
    { icon: <Clock className="h-5 w-5" />, label: 'Attendance Tracker', page: '/attendance' },
    { icon: <DollarSign className="h-5 w-5" />, label: 'Money Tracker', page: '/expense' },
    { icon: <PiggyBank className="h-5 w-5" />, label: 'Budget Tracker', page: '/budget' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', page: '/settings' }
  ];

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect('/login');
        },
      },
    });
  };

  if (screenType === 'mobile') {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 flex justify-around items-center h-16">
        {menuItems.map((item, index) => (
          <Link
            href={item.page}
            key={index}
            onClick={() => setActiveItem(index)}
            className={`
              group flex flex-col items-center justify-center
              cursor-pointer transition-all duration-200 
              p-2 rounded-lg
              ${activeItem === index
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
            `}
          >
            <div className={`
              flex items-center justify-center
              transition-transform duration-200
              ${activeItem === index ? 'scale-110' : 'group-hover:scale-110'}
            `}>
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={`
      fixed top-0 left-0 h-full
      bg-gradient-to-b from-gray-50 to-white
      border-r border-gray-200
      transition-all duration-300 ease-in-out
      ${screenType === 'laptop' ? 'w-64' : isCollapsed ? 'w-16' : 'w-64'}
      shadow-lg flex flex-col
    `}>
      <div className="flex items-center justify-between p-4">
        <h1 className={`
          font-bold text-xl text-gray-800 
          transition-opacity duration-300 
          ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
        `}>
          Tracklytic
        </h1>
      </div>

      <ScrollArea className="flex-grow">
        <div className={`p-4 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
          {menuItems.map((item, index) => (
            <Link
              href={item.page}
              key={index}
              onClick={() => setActiveItem(index)}
              className={`
                group flex items-center rounded-lg
                cursor-pointer transition-all duration-200
                ${isCollapsed ? 'justify-center p-2' : 'p-3'}
                ${activeItem === index
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
              `}
            >
              <div className={`
                flex items-center justify-center
                transition-transform duration-200
                ${activeItem === index ? 'scale-110' : 'group-hover:scale-110'}
                ${isCollapsed ? 'w-8 h-8' : 'w-6'}
              `}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="ml-4 text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </ScrollArea>

      {(screenType === 'laptop' || screenType === 'tablet') && (
        <div className={`p-4 ${isCollapsed ? 'px-2' : ''} border-t border-gray-200`}>
          <div onClick={handleSignOut} className={`
            group flex items-center rounded-lg
            cursor-pointer transition-all duration-200
            bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white
            shadow-sm hover:shadow-md
            ${isCollapsed ? 'justify-center p-2' : 'p-3'}
          `}>
            <div className={`
              flex items-center justify-center
              transition-transform duration-200
              group-hover:scale-110 group-hover:rotate-12
              ${isCollapsed ? 'w-8 h-8' : 'w-6'}
            `}>
              <LogOut className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="ml-4 text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;