import { Outlet } from "@tanstack/react-router";
import { Header } from "./Header";
import { CategoryNav } from "./CategoryNav";
import { Footer } from "./Footer";

export function ShopLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
