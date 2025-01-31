import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center text-center px-4 pt-16">
        <nav className="absolute top-5 left-5 text-lg font-semibold flex items-center gap-3 mx-10">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">🚀</span>
          <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent ">
            Tracklytic
          </span>
        </nav>

        <div className="absolute top-5 right-10 text-sm flex gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded-lg shadow-md">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href={'/habit'} className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-2 rounded-lg shadow-md">
              Sign In
            </Link>
          </SignedIn>
        </div>

        <div className="max-w-4xl mt-20 md:mt-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
            The Simplest Way to Track Your Goals
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-lg mx-auto">
            Stay on top of your habits, savings, attendance, and more with Tracklytic. Achieve your goals faster and smarter.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
            <SignedOut>
              <Link href="/habit">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg">
                  Start Using Tracklytic
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/habit">
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg">
                  Go to dashboard
                </button>
              </Link>
            </SignedIn>
          </div>

          <p className="mt-4 text-sm text-gray-400 italic">100% Free Forever</p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full px-4">
          {[
            { title: 'Habit Tracker', desc: 'Build and maintain healthy habits with ease.' },
            { title: 'Money Goals', desc: 'Track your savings and financial goals effortlessly.' },
            { title: 'Attendance Tracker', desc: 'Keep track of your attendance and punctuality.' },
            { title: 'Custom Goals', desc: 'Set and achieve personalized goals tailored to your needs.' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-800 duration-300">
              <h2 className="text-xl font-bold text-white">{feature.title}</h2>
              <p className="mt-2 text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-sm text-gray-500 py-6">
          <p>© {new Date().getFullYear()} Tracklytic. All rights reserved.</p>
        </footer>
    </div>
  );
}