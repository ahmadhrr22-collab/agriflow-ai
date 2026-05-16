import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ag-shell flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-7 py-6">
          <div className="mx-auto w-full max-w-[1520px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
