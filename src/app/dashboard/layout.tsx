import DashboardBar from "./bar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    
  return <DashboardBar>{children}</DashboardBar>;
}
