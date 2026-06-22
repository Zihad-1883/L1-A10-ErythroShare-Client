import { Sidebar } from "../components/dashboardLayout/Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-neutral-50/50 p-2">
            <Sidebar />
            <main className="flex-1 w-full relative">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
