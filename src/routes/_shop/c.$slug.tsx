import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/queries";

export const Route = createFileRoute("/_shop/c/$slug")({
  component: CategoryRedirect,
});

function CategoryRedirect() {
  const { slug } = Route.useParams();
  const { data: categories, isLoading } = useQuery(categoriesQuery());
  if (isLoading) return null;
  const cat = categories?.find((c) => c.slug === slug);
  if (!cat) return <Navigate to="/search" search={{ q: slug }} />;
  return <Navigate to="/search" search={{ categoryId: cat.id }} />;
}
