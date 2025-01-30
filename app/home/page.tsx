import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <ClerkProvider>
        <SignedIn>
          <div>
            hello
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    </div>
  )
}