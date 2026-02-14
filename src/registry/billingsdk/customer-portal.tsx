"use client";

import React, { useState } from "react";
import {
    CreditCard,
    History,
    LayoutDashboard,
    Settings,
    Zap,
    Menu,
    X,
    ChevronRight,
    User,
    Bell,
    Shield
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const portalVariants = cva("flex flex-col md:flex-row min-h-[600px] w-full rounded-xl border overflow-hidden", {
    variants: {
        theme: {
            minimal: "bg-background",
            classic: "bg-card/30 backdrop-blur-md border-border/50 shadow-2xl",
        },
    },
    defaultVariants: {
        theme: "minimal",
    },
});

const sidebarItemVariants = cva(
    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-md mx-2 mb-1",
    {
        variants: {
            active: {
                true: "bg-primary/10 text-primary shadow-none ring-0",
                false: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            },
        },
        defaultVariants: {
            active: false,
        },
    }
);

const portalButtonVariants = cva(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden active:scale-[0.98]",
    {
        variants: {
            variant: {
                premium: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-sm hover:bg-white/20 hover:shadow-md hover:scale-[1.02]",
                outline: "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent/50 hover:text-accent-foreground",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "premium",
            size: "default",
        },
    }
);

interface CustomerPortalProps extends VariantProps<typeof portalVariants> {
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    children?: {
        overview?: React.ReactNode;
        subscription?: React.ReactNode;
        payment?: React.ReactNode;
        history?: React.ReactNode;
        profile?: React.ReactNode;
        notifications?: React.ReactNode;
        security?: React.ReactNode;
    };
    className?: string;
}

export function CustomerPortal({
    user,
    children,
    theme = "minimal",
    className,
}: CustomerPortalProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "subscription" | "payment" | "history" | "profile" | "notifications" | "security">("overview");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "subscription", label: "Subscription", icon: Zap },
        { id: "payment", label: "Payment Methods", icon: CreditCard },
        { id: "history", label: "Billing History", icon: History },
        { id: "profile", label: "Profile Settings", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ] as const;

    return (
        <div className={cn(portalVariants({ theme }), className)}>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-semibold text-sm">Customer Portal</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "md:w-64 border-r flex flex-col transition-all duration-300",
                isMobileMenuOpen ? "flex fixed inset-0 z-50 bg-background md:relative md:bg-transparent" : "hidden md:flex",
                theme === "classic" && "bg-muted/30"
            )}>
                <div className="p-6 hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg font-bold text-lg">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold truncate">{user?.name || "User"}</span>
                            <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={cn(sidebarItemVariants({ active: activeTab === item.id }), "group")}
                        >
                            <item.icon className="size-4 transition-transform group-hover:scale-110" />
                            <span>{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="ml-auto size-4 animate-in slide-in-from-left-2 duration-300" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t">
                    <button className={cn(portalButtonVariants({ variant: "ghost", className: "w-full justify-start gap-3 text-muted-foreground hover:text-foreground" }))}>
                        <Settings className="size-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b flex items-center px-8 hidden md:flex">
                    <h2 className="text-lg font-semibold capitalize">{activeTab.replace("-", " ")}</h2>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === "overview" && (children?.overview || <OverviewPlaceholder theme={theme ?? "minimal"} />)}
                        {activeTab === "subscription" && (children?.subscription || <ContentPlaceholder title="Subscription Management" />)}
                        {activeTab === "payment" && (children?.payment || <ContentPlaceholder title="Payment Methods" />)}
                        {activeTab === "history" && (children?.history || <ContentPlaceholder title="Invoice History" />)}
                        {activeTab === "profile" && (children?.profile || <ContentPlaceholder title="Profile Settings" />)}
                        {activeTab === "notifications" && (children?.notifications || <ContentPlaceholder title="Notification Preferences" />)}
                        {activeTab === "security" && (children?.security || <ContentPlaceholder title="Security Settings" />)}
                    </div>
                </div>
            </main>
        </div>
    );
}

function OverviewPlaceholder({ theme }: { theme: "minimal" | "classic" }) {
    return (
        <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className={cn(
                        "animate-pulse border-border/50",
                        theme === "classic" ? "bg-card/40" : "bg-muted/30"
                    )}>
                        <CardContent className="p-6">
                            <div className="h-4 w-24 bg-muted rounded mb-4" />
                            <div className="h-8 w-32 bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className={cn(
                "h-64 border-dashed animate-pulse flex items-center justify-center",
                theme === "classic" ? "bg-card/20" : "bg-muted/10"
            )}>
                <CardContent>
                    <div className="text-muted-foreground">Loading dynamic dashboard content...</div>
                </CardContent>
            </Card>
        </div>
    );
}

function ContentPlaceholder({ title }: { title: string }) {
    return (
        <Card className="h-64 flex flex-col items-center justify-center text-center border-dashed bg-muted/10">
            <CardHeader>
                <div className="mx-auto size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <LayoutDashboard className="size-8 text-muted-foreground/50" />
                </div>
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                    Integrate existing {title.toLowerCase()} components here.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
