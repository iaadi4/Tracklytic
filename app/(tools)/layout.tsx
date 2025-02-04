import Sidebar from "@/components/ui/sidebar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-16 lg:ml-64">
              {children}
            </main>
          </div>
        </body>
      </html>
    );
  }