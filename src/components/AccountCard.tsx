import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AccountCardProps {
  title: string;
  level: number;
  power: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  seller: string;
  rating: number;
}

const rarityColors = {
  common: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  rare: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  epic: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  legendary: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
};

const rarityLabels = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный'
};

export default function AccountCard({ title, level, power, price, image, rarity, seller, rating }: AccountCardProps) {
  return (
    <Card className="group overflow-hidden hover:scale-105 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader className="p-0 relative">
        <div className="aspect-video overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <Badge className={`absolute top-3 left-3 ${rarityColors[rarity]} border font-semibold`}>
          {rarityLabels[rarity]}
        </Badge>
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-background/50 rounded-lg p-2">
            <div className="text-xs text-foreground/60 mb-1">Уровень</div>
            <div className="text-lg font-bold text-primary">{level}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-2">
            <div className="text-xs text-foreground/60 mb-1">Мощность</div>
            <div className="text-lg font-bold text-secondary">{power}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-foreground/70 mb-3">
          <Icon name="User" size={16} />
          <span>{seller}</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black gold-text">{price.toLocaleString('ru-RU')} ₽</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-border">
          <Icon name="ShoppingCart" size={18} />
          <span className="ml-2">Купить</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
