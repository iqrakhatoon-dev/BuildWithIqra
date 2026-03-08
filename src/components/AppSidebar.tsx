import { useState } from "react";
import { LayoutDashboard, Clock, BookOpen, Rocket, LogIn, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { SupportModal } from "@/components/SupportModal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Coding Log", url: "/coding-log", icon: Clock },
  { title: "Problem Library", url: "/problems", icon: BookOpen },
  { title: "Projects", url: "/projects", icon: Rocket },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarContent>
          <div className="p-4">
            {!collapsed && (
              <h2 className="fluid-text-lg font-bold text-gradient-rosy tracking-tight">
                Build With Iqra
              </h2>
            )}
            {collapsed && (
              <span className="text-gradient-rosy font-bold text-xl">B</span>
            )}
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground fluid-text-xs uppercase tracking-widest">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary"
                        activeClassName="bg-secondary text-primary font-semibold glow-rosy"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {!user && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to="/auth"
                        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary"
                        activeClassName="bg-secondary text-primary font-semibold"
                      >
                        <LogIn className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>Sign In</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-auto p-4">
            <button
              onClick={() => setSupportOpen(true)}
              className="w-full flex items-center gap-2 bg-gradient-rosy text-primary-foreground rounded-lg px-3 py-2.5 fluid-text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Heart className="h-4 w-4 fill-current shrink-0" />
              {!collapsed && <span>Support My Journey</span>}
            </button>
          </div>
        </SidebarContent>
      </Sidebar>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
