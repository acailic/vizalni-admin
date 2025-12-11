import type { NextApiRequest, NextApiResponse } from 'next';

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
    kategorija: 'Кућне потрепштине',
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
    kategorija: 'Храна',
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
  },
  {
    id: '6',
    naziv: 'Телевизор LG 55" 4K Smart TV',
    proizvodjac: 'LG',
    kategorija: 'Електроника',
    cenaRegular: 89999,
    cenaPopust: 79999,
    cenaPoJedinici: 'RSD/kom',
    valuta: 'RSD',
    lokacija: 'Крагујевац',
    datum: new Date().toISOString()
  },
  {
    id: '7',
    naziv: 'Кrema za ruke Nivea',
    proizvodjac: 'Nivea',
    kategorija: 'Козметика',
    cenaRegular: 399,
    cenaPopust: 299,
    cenaPoJedinici: 'RSD/kom',
    valuta: 'RSD',
    lokacija: 'Нови Сад',
    datum: new Date().toISOString()
  },
  {
    id: '8',
    naziv: 'Kafa Grand 200g',
    proizvodjac: 'Grand',
    kategorija: 'Пиће',
    cenaRegular: 450,
    cenaPopust: 0,
    cenaPoJedinici: 'RSD/kg',
    valuta: 'RSD',
    lokacija: 'Београд',
    datum: new Date().toISOString()
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      location,
      search
    } = req.query;

    let filteredData = [...sampleData];

    // Apply filters
    if (category && typeof category === 'string') {
      filteredData = filteredData.filter(item =>
        item.kategorija.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (brand && typeof brand === 'string') {
      filteredData = filteredData.filter(item =>
        item.proizvodjac.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (minPrice && typeof minPrice === 'string') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredData = filteredData.filter(item => item.cenaRegular >= min);
      }
    }

    if (maxPrice && typeof maxPrice === 'string') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredData = filteredData.filter(item => item.cenaRegular <= max);
      }
    }

    if (location && typeof location === 'string') {
      filteredData = filteredData.filter(item =>
        item.lokacija.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.naziv.toLowerCase().includes(searchLower) ||
        item.proizvodjac.toLowerCase().includes(searchLower) ||
        item.kategorija.toLowerCase().includes(searchLower)
      );
    }

    // Calculate statistics
    const stats = {
      totalProducts: filteredData.length,
      averagePrice: filteredData.length > 0
        ? filteredData.reduce((sum, item) => sum + item.cenaRegular, 0) / filteredData.length
        : 0,
      categories: [...new Set(filteredData.map(item => item.kategorija))],
      retailers: ['IDEA', 'Lidl', 'Delhaize', 'Maxi', 'Dis Market'],
      locations: [...new Set(filteredData.map(item => item.lokacija))]
    };

    res.status(200).json({
      data: filteredData,
      stats,
      total: filteredData.length
    });
  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch price data'
    });
  }
}