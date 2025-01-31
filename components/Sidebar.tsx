"use client";

import { Target, CalendarCheck, HandCoins, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

const Sidebar = () => {
  const { user } = useUser();

  const menuItems = [
    { name: "Habit Tracker", icon: <Target size={20} />, path: "#" },
    { name: "Attendance", icon: <CalendarCheck size={20} />, path: "/attendance" },
    { name: "Money Jar", icon: <HandCoins size={20} />, path: "/jar" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 h-full hidden md:flex flex-col bg-black border-r border-gray-800/50",
        "md:w-16 lg:w-64"
      )}>
        <div className="flex items-center ml-5 h-16 border-b border-gray-800/50">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">🚀</span>
          <span className="ml-3 font-semibold text-white text-lg hidden lg:block">
            Tracklytic
          </span>
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-2 flex-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl text-gray-300",
                "hover:text-white hover:bg-gradient-to-r hover:from-green-400/20 hover:to-blue-500/10",
                "md:justify-center lg:justify-start"
              )}
            >
              <div className="text-gray-400 group-hover:text-green-400">
                {item.icon}
              </div>
              <span className="text-sm font-medium hidden lg:block">
                {item.name}
              </span>
              <div className="absolute left-14 px-2 py-1 bg-black text-white text-xs rounded-md hidden 
                group-hover:md:block group-hover:lg:hidden">
                {item.name}
              </div>
            </a>
          ))}
        </nav>

        <div className="border-t border-gray-800/50 p-4 mt-auto">
          <div className="flex items-center">
            <UserButton />
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-medium text-white">{user?.firstName || "Welcome"}</p>
              <p className="text-xs text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 md:hidden">
        <nav className="flex justify-around items-center p-2 max-w-md mx-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex flex-col items-center py-2 px-3"
            >
              <div className="text-gray-400 hover:text-green-400">
                {item.icon}
              </div>
              <span className="text-xs font-medium mt-1 text-gray-300">
                {item.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;