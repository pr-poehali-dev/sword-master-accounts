-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'seller', 'user')),
    avatar_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы объявлений
CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    power VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'moderation', 'rejected')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id),
    user_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'dispute')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Создание таблицы настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка админа по умолчанию (пароль: admin123)
INSERT INTO users (email, password_hash, username, role) 
VALUES ('admin@swordmaster.ru', '$2a$10$xQxN7v8K9YJZz8qH5L5h5.NxNJh7QzK9JxH5L5h5L5h5L5h5L5h5L', 'Admin', 'admin');

-- Вставка тестовых отзывов
INSERT INTO reviews (user_id, seller_id, rating, comment, is_verified, created_at) VALUES
(1, 1, 5, 'Отличный сервис! Купил аккаунт, всё быстро и безопасно. Продавец очень отзывчивый.', true, NOW() - INTERVAL '5 days'),
(1, 1, 5, 'Покупал здесь уже третий раз. Всегда быстрая обработка заказа и качественные аккаунты!', true, NOW() - INTERVAL '3 days'),
(1, 1, 4, 'Хороший маркетплейс, цены адекватные. Единственное - хотелось бы больше способов оплаты.', true, NOW() - INTERVAL '2 days'),
(1, 1, 5, 'Продал свой аккаунт за 2 часа! Комиссия небольшая, всё честно. Рекомендую!', true, NOW() - INTERVAL '1 day'),
(1, 1, 5, 'Лучший сайт для покупки аккаунтов Sword Master Story! Проверяют каждый аккаунт перед продажей.', true, NOW() - INTERVAL '12 hours');

-- Вставка базовых настроек сайта
INSERT INTO site_settings (setting_key, setting_value) VALUES
('commission_rate', '7.5'),
('site_name', 'Sword Master Story Marketplace'),
('contact_email', 'support@swordmaster.ru'),
('telegram_link', 'https://t.me/swordmaster_support');

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);