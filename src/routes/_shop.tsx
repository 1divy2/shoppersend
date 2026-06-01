import { createFileRoute } from "@tanstack/react-router";
import { ShopLayout } from "@/components/layout/ShopLayout";

export const Route = createFileRoute("/_shop")({
  component: ShopLayout,
});
