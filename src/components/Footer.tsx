import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Swords" size={28} className="text-primary" />
              <h3 className="text-xl font-bold glow-text">Sword Master</h3>
            </div>
            <p className="text-foreground/60 text-sm">
              Маркетплейс для безопасной покупки и продажи игровых аккаунтов
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Разделы</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><a href="#catalog" className="hover:text-primary transition-colors">Каталог</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">О нас</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#contacts" className="hover:text-primary transition-colors">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><a href="#" className="hover:text-primary transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Правила</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Безопасность</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Гарантии</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Социальные сети</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors">
                <Icon name="MessageCircle" size={20} className="text-primary" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors">
                <Icon name="Send" size={20} className="text-primary" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors">
                <Icon name="Youtube" size={20} className="text-primary" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
          <p>© 2024 Sword Master Story Marketplace. Все права защищены.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
