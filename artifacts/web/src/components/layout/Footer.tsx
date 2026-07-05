import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo variant="dark" />

          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span>Built in Riyadh · صُنع في الرياض</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
