# Визуелни Административни Подаци Србије / Visual Administrative Data Serbia

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

**Српски / Serbian** | [English](#english)

---

## О пројекту / О проекту

Овај пројекат представља платформу за визуелизацију и анализу административних података Републике Србије, интегрисану са званичним порталом отворених података [data.gov.rs](https://data.gov.rs). Платформа омогућава преглед, претрагу и визуелизацију података из различитих државних институција.

Этот проект представляет платформу для визуализации и анализа административных данных Республики Сербии, интегрированную с официальным порталом открытых данных [data.gov.rs](https://data.gov.rs). Платформа позволяет просмотр, поиск и визуализацию данных из различных государственных учреждений.

## Карактеристике / Особенности

- **🎯 Вишеструки језици**: Подршка за српску ћирилицу, латиницу и енглески језик
- **📊 Визуелизација података**: Интерактивне графиконе и мапе
- **🔍 Напредна претрага**: Претрага по категоријама, организацијама и темама
- **📱 Responsive дизајн**: Прилагођен свим уређајима
- **⚡ Брзина**: Изграђен са Next.js за оптималне перформансе
- **🎨 Tailwind CSS**: Модеран и одржив дизајн

## Инсталација / Установка

### Предуслови / Предварительные требования

- Node.js 18.17 или новији
- npm, yarn, или pnpm

### Кораци инсталације / Шаги установки

```bash
# Клонирање репозиторијума / Клонирование репозитория
git clone https://github.com/your-org/vizuelni-admin-srbije.git
cd vizuelni-admin-srbije

# Инсталација зависности / Установка зависимостей
npm install
# или / или
yarn install
# или / или
pnpm install

# Копирање променљивих окружења / Копирование переменных окружения
cp .env.example .env.local

# Покретање развојног сервера / Запуск сервера разработки
npm run dev
# или / или
yarn dev
```

Отворите [http://localhost:3000](http://localhost:3000) у вашем прегледачу.

## Структура пројекта / Структура проекта

```
vizuelni-admin-srbije/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── [locale]/          # Internationalization routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React компоненте
│   │   ├── ui/               # UI primitives
│   │   ├── layouts/          # Layout components
│   │   ├── visualizations/   # Data viz components
│   │   └── shared/           # Shared components
│   ├── lib/                   # Core libraries
│   │   ├── api/              # API client & services
│   │   ├── i18n/             # Internationalization
│   │   └── utils/            # Utilities
│   ├── types/                 # TypeScript types
│   └── styles/               # Global styles
├── public/                    # Static assets
│   ├── locales/              # Translation files
│   │   ├── sr-Cyrl/         # Serbian Cyrillic
│   │   ├── sr-Latn/         # Serbian Latin
│   │   └── en/              # English
│   └── images/               # Image assets
├── docs/                      # Documentation
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Конфигурација / Конфигурация

### Променљиве окружења / Переменные окружения

Креирајте `.env.local` фајл на основу `.env.example`:

Создайте файл `.env.local` на основе `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://data.gov.rs/api/1
NEXT_PUBLIC_API_VERSION=1

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Optional: Maps
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### Интеграција са data.gov.rs API

Пројекат је интегрисан са [data.gov.rs API](https://data.gov.rs) који пружа приступ:
- 3,412+ скупова података
- 6,589+ ресурса
- Подаци из 155 организација

Проект интегрирован с [data.gov.rs API](https://data.gov.rs) который предоставляет доступ к:
- 3,412+ наборов данных
- 6,589+ ресурсов
- Данные из 155 организаций

## Развој / Разработка

### Скрипте

```bash
# Развој / Разработка
npm run dev

# Градња / Сборка
npm run build

# Покретање производње / Запуск production
npm start

# Линтер / Линтер
npm run lint

# Форматирање / Форматирование
npm run format

# Тестирање / Тестирование
npm run test
```

### Конвенције кодирања / Конвенции кодирования

- Користимо TypeScript за безбедност типова
- Пратимо [Airbnb Style Guide](https://github.com/airbnb/javascript)
- Комит поруке прате [Conventional Commits](https://www.conventionalcommits.org/)

## Доприношење / Вклад

Видите [CONTRIBUTING.md](./CONTRIBUTING.md) за детаље о томе како допринети пројекту.

См. [CONTRIBUTING.md](./CONTRIBUTING.md) для получения подробной информации о том, как внести вклад в проект.

## Лиценца / Лицензия

Овај пројекат је лиценциран под MIT лиценцом - видите [LICENSE](./LICENSE) фајл за детаље.

Этот проект лицензирован по лицензии MIT - см. файл [LICENSE](./LICENSE) для подробной информации.

## Извори података / Источники данных

- [data.gov.rs](https://data.gov.rs) - Портал отворених података Републике Србије
- [API документација](https://data.gov.rs/api/1/swagger.json)

## Контакт / Контакты

- **Email**: opendata@ite.gov.rs
- **Twitter**: [@kancelarijaITE](https://twitter.com/kancelarijaITE)
- **LinkedIn**: [Канцеларија за ИТ и еУправу](https://www.linkedin.com/company/kancelarija-ite/)

---

<a name="english"></a>

## English

A platform for visualization and analysis of administrative data of the Republic of Serbia, integrated with the official open data portal [data.gov.rs](https://data.gov.rs).

### Features

- **🎯 Multi-language**: Support for Serbian Cyrillic, Latin, and English
- **📊 Data Visualization**: Interactive charts and maps
- **🔍 Advanced Search**: Search by categories, organizations, and topics
- **📱 Responsive Design**: Optimized for all devices
- **⚡ Performance**: Built with Next.js for optimal performance
- **🎨 Tailwind CSS**: Modern and maintainable design

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/vizuelni-admin-srbije.git
cd vizuelni-admin-srbije

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Data Sources

- [data.gov.rs](https://data.gov.rs) - Open Data Portal of the Republic of Serbia
- [API Documentation](https://data.gov.rs/api/1/swagger.json)

### License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

**Made with ❤️ for Serbia's Open Data Initiative**
