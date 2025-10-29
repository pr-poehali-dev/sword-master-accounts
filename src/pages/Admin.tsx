import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  id: number;
  title: string;
  level: number;
  power: string;
  price: number;
  rarity: string;
  status: string;
  seller_name: string;
  created_at: string;
}

export default function Admin() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    level: '',
    power: '',
    price: '',
    rarity: 'rare',
    image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80'
  });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await fetch('https://functions.poehali.dev/6d0b5ebb-af6a-4d0a-833a-adb6a2c6b1b4?status=active');
      const data = await res.json();
      setListings(data.listings || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить объявления',
        variant: 'destructive'
      });
    }
  };

  const createListing = async () => {
    if (!newListing.title || !newListing.level || !newListing.power || !newListing.price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://functions.poehali.dev/6d0b5ebb-af6a-4d0a-833a-adb6a2c6b1b4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newListing,
          level: parseInt(newListing.level),
          price: parseFloat(newListing.price),
          status: 'active'
        })
      });

      if (res.ok) {
        toast({
          title: 'Успешно',
          description: 'Объявление создано'
        });
        setNewListing({
          title: '',
          description: '',
          level: '',
          power: '',
          price: '',
          rarity: 'rare',
          image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80'
        });
        loadListings();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать объявление',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('https://functions.poehali.dev/6d0b5ebb-af6a-4d0a-833a-adb6a2c6b1b4', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (res.ok) {
        toast({
          title: 'Успешно',
          description: 'Статус обновлён'
        });
        loadListings();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black glow-text mb-2">Админ-панель</h1>
            <p className="text-foreground/70">Управление контентом маркетплейса</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="ArrowLeft" size={18} />
            <span className="ml-2">На главную</span>
          </Button>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="listings">
              <Icon name="ShoppingCart" size={16} />
              <span className="ml-2">Объявления</span>
            </TabsTrigger>
            <TabsTrigger value="create">
              <Icon name="Plus" size={16} />
              <span className="ml-2">Создать</span>
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="BarChart3" size={16} />
              <span className="ml-2">Статистика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" size={24} />
                  Все объявления
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Уровень</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Редкость</TableHead>
                      <TableHead>Продавец</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>{listing.level}</TableCell>
                        <TableCell className="gold-text font-bold">{listing.price.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell>
                          <Badge variant="outline">{listing.rarity}</Badge>
                        </TableCell>
                        <TableCell>{listing.seller_name || 'Admin'}</TableCell>
                        <TableCell>
                          <Badge className={
                            listing.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                            listing.status === 'sold' ? 'bg-gray-500/20 text-gray-400' : 
                            'bg-yellow-500/20 text-yellow-400'
                          }>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStatus(listing.id, listing.status === 'active' ? 'sold' : 'active')}
                            >
                              <Icon name={listing.status === 'active' ? 'CheckCircle2' : 'RefreshCw'} size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-card/80 backdrop-blur-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Plus" size={24} />
                  Создать объявление
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Название *</label>
                  <Input
                    placeholder="Легендарный аккаунт"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Описание</label>
                  <Textarea
                    placeholder="Описание аккаунта..."
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Уровень *</label>
                    <Input
                      type="number"
                      placeholder="85"
                      value={newListing.level}
                      onChange={(e) => setNewListing({ ...newListing, level: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Мощность *</label>
                    <Input
                      placeholder="1.2M"
                      value={newListing.power}
                      onChange={(e) => setNewListing({ ...newListing, power: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Цена (₽) *</label>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Редкость *</label>
                    <Select value={newListing.rarity} onValueChange={(v) => setNewListing({ ...newListing, rarity: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Обычный</SelectItem>
                        <SelectItem value="rare">Редкий</SelectItem>
                        <SelectItem value="epic">Эпический</SelectItem>
                        <SelectItem value="legendary">Легендарный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">URL изображения</label>
                  <Input
                    placeholder="https://..."
                    value={newListing.image_url}
                    onChange={(e) => setNewListing({ ...newListing, image_url: e.target.value })}
                  />
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary" 
                  onClick={createListing}
                  disabled={loading}
                >
                  <Icon name="Plus" size={18} />
                  <span className="ml-2">{loading ? 'Создание...' : 'Создать объявление'}</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground/70">Всего объявлений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black gold-text">{listings.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground/70">Активных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-primary">
                    {listings.filter(l => l.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-foreground/70">Продано</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-green-400">
                    {listings.filter(l => l.status === 'sold').length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
