import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Review {
  id: number;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://functions.poehali.dev/ea9cac52-5bf0-4133-87c7-3c8d1cdae472')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center text-foreground/60">Загрузка отзывов...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-4 glow-text">
            Отзывы наших клиентов
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Более 1000 довольных покупателей и продавцов. Читай реальные отзывы от пользователей платформы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.slice(0, 6).map((review, index) => (
            <Card 
              key={review.id} 
              className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {review.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-foreground">{review.username}</h4>
                      {review.is_verified && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Icon name="CheckCircle2" size={14} />
                          <span>Проверено</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                      <span className="text-xs text-foreground/60 ml-2">
                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-black gold-text mb-1">4.9</div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-foreground/60">Средний рейтинг</div>
            </div>
            
            <div className="w-px h-16 bg-border"></div>
            
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-1">1000+</div>
              <div className="text-sm text-foreground/60">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
