import { useState } from 'react';
import AccountCard from './AccountCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const mockAccounts = [
  {
    id: 1,
    title: 'Аккаунт с легендарными героями',
    level: 85,
    power: '1.2M',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    rarity: 'legendary' as const,
    seller: 'ProGamer2024',
    rating: 4.9
  },
  {
    id: 2,
    title: 'Топовый аккаунт для PvP',
    level: 78,
    power: '980K',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    rarity: 'epic' as const,
    seller: 'MasterSword',
    rating: 4.8
  },
  {
    id: 3,
    title: 'Прокачанный аккаунт с артефактами',
    level: 72,
    power: '850K',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80',
    rarity: 'epic' as const,
    seller: 'GameLegend',
    rating: 4.7
  },
  {
    id: 4,
    title: 'Аккаунт с редкими скинами',
    level: 65,
    power: '720K',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    rarity: 'rare' as const,
    seller: 'SwordKing',
    rating: 4.6
  },
  {
    id: 5,
    title: 'Стартовый аккаунт для новичков',
    level: 45,
    power: '450K',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    rarity: 'rare' as const,
    seller: 'Newbie Pro',
    rating: 4.5
  },
  {
    id: 6,
    title: 'Аккаунт с максимальными скиллами',
    level: 90,
    power: '1.5M',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
    rarity: 'legendary' as const,
    seller: 'UltraPlayer',
    rating: 5.0
  }
];

export default function Catalog() {
  const [sortBy, setSortBy] = useState('popular');
  const [filterRarity, setFilterRarity] = useState('all');

  return (
    <section id="catalog" className="py-20 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-4 glow-text">
            Каталог аккаунтов
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Выбери аккаунт своей мечты среди сотен предложений от проверенных продавцов
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              variant={filterRarity === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterRarity('all')}
              className={filterRarity === 'all' ? 'bg-primary' : ''}
            >
              Все
            </Button>
            <Button 
              variant={filterRarity === 'legendary' ? 'default' : 'outline'}
              onClick={() => setFilterRarity('legendary')}
              className={filterRarity === 'legendary' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
            >
              <Icon name="Crown" size={16} />
              <span className="ml-2">Легендарные</span>
            </Button>
            <Button 
              variant={filterRarity === 'epic' ? 'default' : 'outline'}
              onClick={() => setFilterRarity('epic')}
              className={filterRarity === 'epic' ? 'bg-purple-600' : ''}
            >
              Эпические
            </Button>
            <Button 
              variant={filterRarity === 'rare' ? 'default' : 'outline'}
              onClick={() => setFilterRarity('rare')}
              className={filterRarity === 'rare' ? 'bg-blue-600' : ''}
            >
              Редкие
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/70">Сортировка:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">По популярности</SelectItem>
                <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                <SelectItem value="level">По уровню</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockAccounts
            .filter(acc => filterRarity === 'all' || acc.rarity === filterRarity)
            .map((account, index) => (
              <div key={account.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <AccountCard {...account} />
              </div>
            ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <Icon name="Plus" size={20} />
            <span className="ml-2">Загрузить ещё</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
