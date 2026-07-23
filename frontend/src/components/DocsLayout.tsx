import { Outlet, Link, useLocation } from "react-router-dom"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Home", url: "/" },
  { title: "Install Guide", url: "/install" },
  { title: "Usage Guide", url: "/usage" },
  { title: "Changelog", url: "/changelog" },
  { title: "Sign Up", url: "/signup" },
  { title: "About", url: "/about" },
]

export function DocsLayout() {
  const location = useLocation()

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "220px" } as React.CSSProperties}
    >
      <Sidebar>
        <SidebarContent>
          <div className="px-4 py-5">
            <Link to="/" className="flex items-baseline gap-1 text-xl font-extrabold no-underline tracking-tight">
              <span className="text-white">GuardRail</span>
              <span className="text-orange-500">DB</span>
            </Link>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Documentation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={location.pathname === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="border-t border-[#1f1f1f] p-4 text-xs text-zinc-600">
          <a href="https://github.com/shivraj598/GuardRailDB--Secure_MCP_for_AI_to_Access_Database" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-8 md:p-12 max-w-4xl">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
