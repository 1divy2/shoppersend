import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User as UserIcon, Mail, Phone, Calendar, Shield, Package, MapPin, CreditCard, Settings, LogOut, ChevronRight, Edit3, Heart } from "lucide-react";
import { useState } from "react";
import { meQuery, ordersQuery, wishlistQuery } from "@/lib/queries";
import { authService } from "@/services/auth.service";
import { addressService } from "@/services/orders.service";

export const Route = createFileRoute("/_shop/profile")({
  head: () => ({ meta: [{ title: "My Profile — ShoppersEnd" }] }),
  component: ProfilePage,
});

type Tab = "overview" | "orders" | "addresses" | "payments" | "settings";

function ProfilePage() {
  const { data: meData, isLoading } = useQuery(meQuery());
  const { data: orders } = useQuery({ ...ordersQuery(), enabled: !!meData?.user });
  const { data: wishlist } = useQuery({ ...wishlistQuery(), enabled: !!meData?.user });
  const { data: addresses } = useQuery({ queryKey: ["addresses"], queryFn: addressService.list, enabled: !!meData?.user });
  const user = meData?.user;
  
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.invalidateQueries();
      navigate({ to: "/" });
    },
  });

  if (isLoading) return <div className="container-page py-10 text-sm text-muted-foreground">Loading profile…</div>;

  if (!user) {
    return (
      <div className="container-page py-12 text-center">
        <h1 className="text-xl font-semibold">Sign in to view your profile</h1>
        <Link to="/login" className="mt-4 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
          Sign in
        </Link>
      </div>
    );
  }

  const TABS = [
    { id: "overview", label: "Profile Overview", icon: UserIcon },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Manage Addresses", icon: MapPin },
    { id: "payments", label: "Payment Methods", icon: CreditCard },
    { id: "settings", label: "Account Settings", icon: Settings },
  ] as const;

  return (
    <div className="bg-[var(--surface-2)] min-h-[calc(100vh-140px)] py-8">
      <div className="container-page">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0">
            {/* User Mini Card */}
            <div className="bg-card rounded-xl border p-5 mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-primary-foreground">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Hello,</div>
                <div className="font-bold text-base truncate">{user.fullName}</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-card rounded-xl border overflow-hidden">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-sm font-medium transition-colors border-b last:border-b-0
                      ${isActive ? "bg-[var(--primary)]/5 text-[var(--primary)] border-l-4 border-l-[var(--primary)]" : "text-muted-foreground hover:bg-[var(--surface-2)] hover:text-foreground border-l-4 border-l-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-[var(--primary)]" : "text-muted-foreground"} />
                      {tab.label}
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${isActive ? "text-[var(--primary)]" : "opacity-40"}`} />
                  </button>
                );
              })}
              <button
                onClick={() => logout.mutate()}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors border-l-4 border-l-transparent"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            
            {activeTab === "overview" && (
              <>
                <h1 className="text-2xl font-bold">Profile Overview</h1>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <Package size={20} />
                    </div>
                    <div className="text-2xl font-bold">{orders?.length || 0}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Total Orders</div>
                  </div>
                  <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                      <Heart size={20} />
                    </div>
                    <div className="text-2xl font-bold">{wishlist?.items.length || 0}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Wishlist</div>
                  </div>
                  <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <MapPin size={20} />
                    </div>
                    <div className="text-2xl font-bold">{addresses?.length || 0}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Addresses</div>
                  </div>
                  <div className="bg-card border rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                      <Shield size={20} />
                    </div>
                    <div className="text-2xl font-bold capitalize">{user.role.toLowerCase()}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">Account Role</div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div className="border-b px-6 py-4 flex items-center justify-between bg-muted/20">
                    <h2 className="font-semibold text-lg">Personal Information</h2>
                    <button onClick={() => setActiveTab("settings")} className="text-sm font-medium text-[var(--primary)] hover:underline">Edit</button>
                  </div>
                  <div className="p-6 grid sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Full Name</div>
                      <div className="font-medium text-base">{user.fullName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Email Address</div>
                      <div className="font-medium text-base">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Phone Number</div>
                      <div className="font-medium text-base">{user.phone || <span className="text-muted-foreground italic">Not provided</span>}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Member Since</div>
                      <div className="font-medium text-base">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">My Orders</h1>
                  <Link to="/orders" className="text-sm font-medium text-[var(--primary)] hover:underline">View All</Link>
                </div>
                
                {orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="rounded-xl border bg-card p-5 hover:shadow-sm transition-shadow">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 mb-4">
                          <div>
                            <div className="text-sm font-semibold">Order #{o.orderNumber}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Placed on {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                          </div>
                          <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                            {o.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2 overflow-hidden">
                            {o.items.slice(0, 3).map((it, idx) => (
                              <img key={idx} src={it.productImage} alt={it.productName} className="inline-block h-10 w-10 rounded-full ring-2 ring-card bg-[var(--surface-2)] object-cover" />
                            ))}
                            {o.items.length > 3 && (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-card bg-muted text-xs font-medium text-muted-foreground">
                                +{o.items.length - 3}
                              </div>
                            )}
                          </div>
                          <Link to="/orders" className="text-sm font-medium text-[var(--primary)] hover:underline">Track Order</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border rounded-xl p-10 text-center flex flex-col items-center">
                    <Package size={48} className="text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Looks like you haven't placed an order recently.</p>
                    <Link to="/" className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </>
            )}

            {activeTab === "addresses" && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Manage Addresses</h1>
                  <button className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">
                    <MapPin size={16} /> Add New
                  </button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses?.map((addr) => (
                    <div key={addr.id} className="relative bg-card border rounded-xl p-5 hover:border-[var(--primary)]/50 transition-colors group">
                      {addr.isDefault && (
                        <span className="absolute top-5 right-5 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                          Default
                        </span>
                      )}
                      <div className="font-semibold text-base mb-1 pr-16">{addr.fullName}</div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>{addr.city}, {addr.state} {addr.pincode}</p>
                        <p>Phone: {addr.phone}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="hover:text-[var(--primary)] flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                        <button className="hover:text-destructive flex items-center gap-1">Remove</button>
                      </div>
                    </div>
                  ))}
                  
                  {(!addresses || addresses.length === 0) && (
                    <div className="col-span-full bg-card border border-dashed rounded-xl p-10 text-center flex flex-col items-center">
                      <MapPin size={48} className="text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-1">No saved addresses</h3>
                      <p className="text-sm text-muted-foreground">Add a delivery address for faster checkout.</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === "payments" && (
              <>
                <h1 className="text-2xl font-bold mb-4">Payment Methods</h1>
                <div className="bg-card border rounded-xl p-10 text-center flex flex-col items-center">
                  <CreditCard size={48} className="text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">No saved cards</h3>
                  <p className="text-sm text-muted-foreground">Save your credit or debit cards for faster checkout.</p>
                </div>
              </>
            )}
            
            {activeTab === "settings" && (
              <>
                <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
                <div className="bg-card border rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                  <form className="max-w-md space-y-4" onSubmit={e => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Current Password</label>
                      <input type="password" disabled className="w-full h-10 rounded-md border bg-muted/50 px-3 text-sm" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                      <input type="password" disabled className="w-full h-10 rounded-md border bg-muted/50 px-3 text-sm" placeholder="••••••••" />
                    </div>
                    <button disabled className="rounded-md bg-[var(--primary)] px-6 py-2 text-sm font-semibold text-primary-foreground opacity-50 cursor-not-allowed">
                      Update Password
                    </button>
                    <p className="text-xs text-muted-foreground mt-2">Password updates are disabled in this demo.</p>
                  </form>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
