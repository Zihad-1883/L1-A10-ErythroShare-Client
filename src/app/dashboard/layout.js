import { Sidebar } from "../components/dashboardLayout/Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#080202] text-neutral-100 p-2 md:p-4 relative overflow-hidden font-sans">
            {/* Background radial glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-red-950/10 blur-[130px]" />
                <div className="absolute bottom-[-10%] right-[0%] w-[550px] h-[550px] rounded-full bg-red-950/5 blur-[110px]" />
            </div>
            
            {/* Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015] z-0"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(239,68,68,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <Sidebar />
            
            <main className="flex-1 w-full relative z-10 min-w-0">
                <div className="p-3 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
