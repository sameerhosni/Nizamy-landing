import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Logo variant="dark" />
        </div>
      </div>
    </footer>
  );
}
