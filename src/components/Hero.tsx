import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-8">
            <Icon name="Shield" size={20} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Безопасные сделки • Проверенные продавцы</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 glow-text">
            Маркетплейс аккаунтов<br />
            <span className="gold-text">Sword Master Story</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Покупай и продавай игровые аккаунты с прокачанными персонажами, редкими предметами и достижениями
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-border text-lg px-8 py-6">
              <Icon name="Search" size={24} />
              <span className="ml-2">Найти аккаунт</span>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6">
              <Icon name="Upload" size={24} />
              <span className="ml-2">Продать свой</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: 'Users', label: 'Активных пользователей', value: '5000+' },
              { icon: 'ShoppingCart', label: 'Продано аккаунтов', value: '1200+' },
              { icon: 'Star', label: 'Средний рейтинг', value: '4.9' },
              { icon: 'Shield', label: 'Гарантия безопасности', value: '100%' }
            ].map((stat, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:scale-105 transition-transform">
                <Icon name={stat.icon as any} size={32} className="text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold gold-text mb-1">{stat.value}</div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
