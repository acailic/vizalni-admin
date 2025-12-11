import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface PriceData {
  id: string;
  naziv: string;
  proizvodjac: string;
  kategorija: string;
  cenaRegular: number;
  cenaPopust: number;
  cenaPoJedinici: string;
  valuta: string;
  lokacija: string;
  datum: string;
}

interface ApiResponse {
  data: PriceData[];
  stats: {
    totalProducts: number;
    averagePrice: number;
    categories: string[];
    retailers: string[];
  };
}

export default function CenePage({ initialData }: { initialData: ApiResponse }) {
  const [data, setData] = useState<PriceData[]>(initialData.data);
  const [filteredData, setFilteredData] = useState<PriceData[]>(initialData.data);
  const [filters, setFilters] = useState({
    kategorija: '',
    proizvodjac: '',
    minCena: '',
    maxCena: '',
    lokacija: '',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [...new Set(data.map(item => item.kategorija))].filter(Boolean);
  const manufacturers = [...new Set(data.map(item => item.proizvodjac))].filter(Boolean);
  const locations = [...new Set(data.map(item => item.lokacija))].filter(Boolean);

  useEffect(() => {
    let filtered = data;

    if (filters.kategorija) {
      filtered = filtered.filter(item => item.kategorija === filters.kategorija);
    }
    if (filters.proizvodjac) {
      filtered = filtered.filter(item => item.proizvodjac.toLowerCase().includes(filters.proizvodjac.toLowerCase()));
    }
    if (filters.minCena) {
      filtered = filtered.filter(item => item.cenaRegular >= parseFloat(filters.minCena));
    }
    if (filters.maxCena) {
      filtered = filtered.filter(item => item.cenaRegular <= parseFloat(filters.maxCena));
    }
    if (filters.lokacija) {
      filtered = filtered.filter(item => item.lokacija === filters.lokacija);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.naziv.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.proizvodjac.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, data]);

  const averagePrice = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + item.cenaRegular, 0) / filteredData.length
    : 0;

  return (
    <>
      <Head>
        <title>Анализа цена | Vizualni Admin</title>
        <meta name="description" content="Анализа и поређење цена производа у Србији" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Анализа цена</h1>
          <p className="text-gray-600">Поређење цена производа из различитих категорија</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Укупно производа</h3>
            <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Просечна цена</h3>
            <p className="text-2xl font-bold text-gray-900">{averagePrice.toFixed(2)} RSD</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Категорије</h3>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Произвођачи</h3>
            <p className="text-2xl font-bold text-gray-900">{manufacturers.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Филтери</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Претрага</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Назив производа..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категорија</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.kategorija}
                onChange={(e) => setFilters({ ...filters, kategorija: e.target.value })}
              >
                <option value="">Све категорије</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Произвођач</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Унесите произвођача..."
                value={filters.proizvodjac}
                onChange={(e) => setFilters({ ...filters, proizvodjac: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Минимална цена</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={filters.minCena}
                onChange={(e) => setFilters({ ...filters, minCena: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Максимална цена</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="999999"
                value={filters.maxCena}
                onChange={(e) => setFilters({ ...filters, maxCena: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Локација</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.lokacija}
                onChange={(e) => setFilters({ ...filters, lokacija: e.target.value })}
              >
                <option value="">Све локације</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Резултати претраге</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Назив производа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Произвођач
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категорија
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Регуларна цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена са попустом
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Локација
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Датум
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.naziv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.proizvodjac}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.kategorija}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cenaRegular.toLocaleString('sr-RS')} {item.valuta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cenaPopust > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {item.cenaPopust.toLocaleString('sr-RS')} {item.valuta}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lokacija}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.datum).toLocaleDateString('sr-RS')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 50 && (
              <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
                Приказано првих 50 од {filteredData.length} резултата
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Create sample data if no real data exists
    const sampleData: PriceData[] = [
      {
        id: '1',
        naziv: 'Лаптоп Dell Inspiron 15',
        proizvodjac: 'Dell',
        kategorija: 'Електроника',
        cenaRegular: 89999,
        cenaPopust: 79999,
        cenaPoJedinici: 'RSD/kom',
        valuta: 'RSD',
        lokacija: 'Београд',
        datum: new Date().toISOString()
      },
      {
        id: '2',
        naziv: 'Мобилни телефон Samsung Galaxy A54',
        proizvodjac: 'Samsung',
        kategorija: 'Електроника',
        cenaRegular: 54999,
        cenaPopust: 49999,
        cenaPoJedinici: 'RSD/kom',
        valuta: 'RSD',
        lokacija: 'Нови Сад',
        datum: new Date().toISOString()
      },
      {
        id: '3',
        naziv: 'Сунђер за судове',
        proizvodjac: 'Vileda',
        kатегорija: 'Кућне потрепштине',
        cenaRegular: 299,
        cenaPopust: 0,
        cenaPoJedinici: 'RSD/kom',
        valuta: 'RSD',
        lokacija: 'Ниш',
        datum: new Date().toISOString()
      },
      {
        id: '4',
        naziv: 'Пириначе Тamoти',
        proizvodjac: 'Podravka',
        kатегорija: 'Храна',
        cenaRegular: 189,
        cenaPopust: 149,
        cenaPoJedinici: 'RSD/kg',
        valuta: 'RSD',
        lokacija: 'Београд',
        datum: new Date().toISOString()
      },
      {
        id: '5',
        naziv: 'Сок наранџа 1L',
        proizvodjac: 'Nektar',
        kategorija: 'Пиће',
        cenaRegular: 250,
        cenaPopust: 0,
        cenaPoJedinici: 'RSD/l',
        valuta: 'RSD',
        lokacija: 'Суботица',
        datum: new Date().toISOString()
      }
    ];

    const stats = {
      totalProducts: sampleData.length,
      averagePrice: sampleData.reduce((sum, item) => sum + item.cenaRegular, 0) / sampleData.length,
      categories: [...new Set(sampleData.map(item => item.kategorija))],
      retailers: ['IDEA', 'Lidl', 'Delhaize', 'Maxi', 'Dis Market']
    };

    return {
      props: {
        initialData: {
          data: sampleData,
          stats
        }
      }
    };
  } catch (error) {
    return {
      props: {
        initialData: {
          data: [],
          stats: {
            totalProducts: 0,
            averagePrice: 0,
            categories: [],
            retailers: []
          }
        }
      }
    };
  }
};