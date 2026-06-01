import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/queries";

export function CategoryNav() {
  const { data: categories = [] } = useQuery(categoriesQuery());
  return (
    <div className="border-b bg-surface">
      <div className="container-page flex h-11 items-center gap-1 overflow-x-auto">
        {categories.map((c) => (
          <Link
            key={c.id}
            to="/c/$slug"
            params={{ slug: c.slug }}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
            activeProps={{ className: "bg-muted" }}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
