import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Swords" size={32} className="text-primary" />
          <h1 className="text-2xl font-bold glow-text">Sword Master Story</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#catalog" className="text-foreground/80 hover:text-primary transition-colors">
            Каталог
          </a>
          <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">
            О нас
          </a>
          <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex border-primary/50 text-primary hover:bg-primary/10">
            <Icon name="User" size={18} />
            <span className="ml-2">Войти</span>
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-border">
            <Icon name="Plus" size={18} />
            <span className="ml-2">Продать аккаунт</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
