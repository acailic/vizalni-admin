import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        {/* Header */}
        <header className="w-full text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Визуелни Администратор Србије</h1>
          <p className="text-xl text-gray-600">
            Visual Admin Serbia - Open Data Visualization Platform
          </p>
        </header>

        {/* Hero Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gov-primary to-gov-secondary rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Истражите отворене податке Србије</h2>
            <p className="text-xl mb-6">
              Explore Serbia&apos;s Open Data - Create interactive visualizations from government
              datasets
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/sr-Cyrl/browse"
                className="bg-white text-gov-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Претражи скупове података / Browse Datasets
              </Link>
              <Link
                href="/sr/create"
                className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gov-primary transition"
              >
                Креирај визуелизацију / Create Visualization
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Карактеристике / Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-bold mb-2">Интерактивни графикови</h4>
              <p className="text-gray-600">
                Interactive Charts - Create dynamic charts from Serbian government data
              </p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="text-xl font-bold mb-2">Мапе</h4>
              <p className="text-gray-600">Maps - Visualize geographic data across Serbia</p>
            </div>
            <div className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">🔄</div>
              <h4 className="text-xl font-bold mb-2">Уживо подаци</h4>
              <p className="text-gray-600">Live Data - Connect to real-time data.gov.rs feeds</p>
            </div>
          </div>
        </section>

        {/* Data Categories */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Категорије података / Data Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Јавне финансије', nameEn: 'Public Finance', icon: '💰' },
              { name: 'Мобилност', nameEn: 'Mobility', icon: '🚗' },
              { name: 'Образовање', nameEn: 'Education', icon: '🎓' },
              { name: 'Здравље', nameEn: 'Health', icon: '🏥' },
              { name: 'Животна средина', nameEn: 'Environment', icon: '🌿' },
              { name: 'Управа', nameEn: 'Administration', icon: '🏛️' },
              { name: 'Рањиве групе', nameEn: 'Vulnerable Groups', icon: '👥' },
              { name: 'ODS циљеви', nameEn: 'SDG Goals', icon: '🎯' },
            ].map(category => (
              <div
                key={category.name}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-gray-600">{category.nameEn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-8 text-center">Статистика / Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gov-primary">3,412</div>
              <p className="text-gray-600">Скупова података</p>
              <p className="text-sm text-gray-500">Datasets</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-primary">6,589</div>
              <p className="text-gray-600">Ресурса</p>
              <p className="text-sm text-gray-500">Resources</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-primary">155</div>
              <p className="text-gray-600">Организација</p>
              <p className="text-sm text-gray-500">Organizations</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gov-primary">74</div>
              <p className="text-gray-600">Примера употребе</p>
              <p className="text-sm text-gray-500">Use Cases</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <p className="mb-2">
            Подаци са{' '}
            <a
              href="https://data.gov.rs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gov-secondary hover:underline"
            >
              data.gov.rs
            </a>
          </p>
          <p className="text-sm">Data from data.gov.rs | Open Source Project | MIT License</p>
        </footer>
      </div>
    </main>
  )
}
