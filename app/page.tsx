"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LineChartIcon,
  BarChartIcon,
  PiggyBankIcon,
  TargetIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-black">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-md">
            <LineChartIcon className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Tracklytic</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="text-black border-black hover:bg-black hover:text-white"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-black text-white hover:bg-gray-800">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12 flex flex-col items-center text-center mt-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Track Everything That Matters
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          One app to track your habits, budget, expenses, and more. Take control
          of your life with Tracklytic.
        </p>
        <div className="flex gap-3">
          <Link href="/signup">
            <Button className="bg-black text-white hover:bg-gray-800">
              Get Started — It&apos;s Free
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-black border-black hover:bg-black hover:text-white"
          >
            Learn More
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Everything you need in one place
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-black text-white p-2 rounded-md inline-block mb-3">
              <BarChartIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Habit Tracking</h3>
            <p className="text-gray-600 text-sm">
              Build better habits and track your progress with daily, weekly,
              and monthly insights.
            </p>
          </div>

          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-black text-white p-2 rounded-md inline-block mb-3">
              <PiggyBankIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Budget Management</h3>
            <p className="text-gray-600 text-sm">
              Set budgets, track expenses, and visualize where your money goes
              each month.
            </p>
          </div>

          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-black text-white p-2 rounded-md inline-block mb-3">
              <TargetIcon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">Goal Setting</h3>
            <p className="text-gray-600 text-sm">
              Set financial and personal goals with deadlines and track your
              progress over time.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          How Tracklytic Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold mb-3">
              1
            </div>
            <h3 className="text-lg font-bold mb-2">Set Your Goals</h3>
            <p className="text-gray-600 text-sm">
              Define what matters to you and what you want to track.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold mb-3">
              2
            </div>
            <h3 className="text-lg font-bold mb-2">Track Daily</h3>
            <p className="text-gray-600 text-sm">
              Log your activities, expenses, and habits with ease.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-bold mb-3">
              3
            </div>
            <h3 className="text-lg font-bold mb-2">See Results</h3>
            <p className="text-gray-600 text-sm">
              Gain insights from your data and improve over time.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Ready to take control?</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Join users who have transformed their habits and finances with
            Tracklytic.
          </p>
          <Link href="/signup">
            <Button className="bg-black text-white hover:bg-gray-800">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-black text-white p-1.5 rounded-md">
              <LineChartIcon className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">Tracklytic</span>
          </div>

          <div className="text-gray-600 text-xs">
            © 2023 Tracklytic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
