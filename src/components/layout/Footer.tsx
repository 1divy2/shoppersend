export function Footer() {
  return (
    <footer className="mt-16 border-t bg-[var(--primary)] text-primary-foreground">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold tracking-tight">ShoppersEnd</div>
          <p className="mt-2 text-sm text-primary-foreground/70">
            A demonstration e-commerce frontend built on a swappable service layer.
            All catalog content shown is sample data.
          </p>
        </div>
        <FooterCol title="Shop" links={["All products", "Categories", "Deals", "New arrivals"]} />
        <FooterCol title="Help" links={["Order tracking", "Returns & refunds", "Shipping", "Contact us"]} />
        <FooterCol title="Company" links={["About", "Careers", "Press", "Privacy"]} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} ShoppersEnd demo. No real transactions are processed.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <span className="cursor-default text-primary-foreground/85">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
