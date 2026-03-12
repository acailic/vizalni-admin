import { Box, Container } from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";

import { Header } from "@/components/header";
import { useLocale } from "@/locales/use-locale";
import { cyrillicToLatin } from "@/utils/serbian-script";

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

type LocaleMode = "sr-Cyrl" | "sr-Latn" | "en";

const ENGLISH_TEXT: Record<string, string> = {
  "Лаптоп Dell Inspiron 15": "Dell Inspiron 15 laptop",
  "Мобилни телефон Samsung Galaxy A54": "Samsung Galaxy A54 mobile phone",
  "Сунђер за судове": "Dish sponge",
  "Пириначе Тamoти": "Tamoti rice",
  "Сок наранџа 1L": "Orange juice 1L",
  Електроника: "Electronics",
  "Кућне потрепштине": "Household supplies",
  Храна: "Food",
  Пиће: "Beverages",
  Београд: "Belgrade",
  "Нови Сад": "Novi Sad",
  Ниш: "Nis",
  Суботица: "Subotica",
};

const getLocaleMode = (locale: string): LocaleMode => {
  if (locale === "en") return "en";
  return locale === "sr-Cyrl" ? "sr-Cyrl" : "sr-Latn";
};

const localizeText = (value: string, localeMode: LocaleMode) => {
  if (!value) return value;

  if (localeMode === "sr-Cyrl") {
    return value;
  }

  if (localeMode === "en") {
    return ENGLISH_TEXT[value] ?? cyrillicToLatin(value);
  }

  return cyrillicToLatin(value);
};

const formatRsd = (value: number, localeMode: LocaleMode) =>
  new Intl.NumberFormat(localeMode === "en" ? "en-US" : "sr-RS", {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function CenePage({
  initialData,
}: {
  initialData: ApiResponse;
}) {
  const locale = useLocale();
  const localeMode = getLocaleMode(locale);
  const isCyrillic = localeMode === "sr-Cyrl";
  const isSerbian = localeMode !== "en";
  const [data, _setData] = useState<PriceData[]>(initialData.data);
  const [filteredData, setFilteredData] = useState<PriceData[]>(
    initialData.data
  );
  const [filters, setFilters] = useState({
    kategorija: "",
    proizvodjac: "",
    minCena: "",
    maxCena: "",
    lokacija: "",
    searchTerm: "",
  });

  const categories = [...new Set(data.map((item) => item.kategorija))].filter(
    Boolean
  );
  const locations = [...new Set(data.map((item) => item.lokacija))].filter(
    Boolean
  );

  useEffect(() => {
    let filtered = data;

    if (filters.kategorija) {
      filtered = filtered.filter(
        (item) => item.kategorija === filters.kategorija
      );
    }
    if (filters.proizvodjac) {
      filtered = filtered.filter((item) =>
        item.proizvodjac
          .toLowerCase()
          .includes(filters.proizvodjac.toLowerCase())
      );
    }
    if (filters.minCena) {
      filtered = filtered.filter(
        (item) => item.cenaRegular >= parseFloat(filters.minCena)
      );
    }
    if (filters.maxCena) {
      filtered = filtered.filter(
        (item) => item.cenaRegular <= parseFloat(filters.maxCena)
      );
    }
    if (filters.lokacija) {
      filtered = filtered.filter((item) => item.lokacija === filters.lokacija);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.naziv.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.proizvodjac
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, data]);

  const averagePrice =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.cenaRegular, 0) /
        filteredData.length
      : 0;
  const filteredCategories = [
    ...new Set(filteredData.map((item) => item.kategorija)),
  ].filter(Boolean);
  const filteredManufacturers = [
    ...new Set(filteredData.map((item) => item.proizvodjac)),
  ].filter(Boolean);

  const copy = {
    title: isCyrillic
      ? "Analiza cena"
      : isSerbian
        ? "Analiza cena"
        : "Price analysis",
    description: isCyrillic
      ? "Poređenje cena proizvoda iz različitih kategorija"
      : isSerbian
        ? "Poređenje cena proizvoda iz različitih kategorija"
        : "Compare product prices across categories",
    totalProducts: isCyrillic
      ? "Ukupno proizvoda"
      : isSerbian
        ? "Ukupno proizvoda"
        : "Total products",
    averagePrice: isCyrillic
      ? "Prosečna cena"
      : isSerbian
        ? "Prosečna cena"
        : "Average price",
    categories: isCyrillic
      ? "Kategorije"
      : isSerbian
        ? "Kategorije"
        : "Categories",
    manufacturers: isCyrillic
      ? "Proizvođači"
      : isSerbian
        ? "Proizvođači"
        : "Manufacturers",
    filters: isCyrillic ? "Filteri" : isSerbian ? "Filteri" : "Filters",
    search: isCyrillic ? "Pretraga" : isSerbian ? "Pretraga" : "Search",
    category: isCyrillic ? "Kategorija" : isSerbian ? "Kategorija" : "Category",
    manufacturer: isCyrillic
      ? "Proizvođač"
      : isSerbian
        ? "Proizvođač"
        : "Manufacturer",
    minPrice: isCyrillic
      ? "Minimalna cena"
      : isSerbian
        ? "Minimalna cena"
        : "Minimum price",
    maxPrice: isCyrillic
      ? "Maksimalna cena"
      : isSerbian
        ? "Maksimalna cena"
        : "Maximum price",
    location: isCyrillic ? "Lokacija" : isSerbian ? "Lokacija" : "Location",
    allCategories: isCyrillic
      ? "Sve kategorije"
      : isSerbian
        ? "Sve kategorije"
        : "All categories",
    allLocations: isCyrillic
      ? "Sve lokacije"
      : isSerbian
        ? "Sve lokacije"
        : "All locations",
    productPlaceholder: isCyrillic
      ? "Naziv proizvoda..."
      : isSerbian
        ? "Naziv proizvoda..."
        : "Product name...",
    manufacturerPlaceholder: isCyrillic
      ? "Unesite proizvođača..."
      : isSerbian
        ? "Unesite proizvođača..."
        : "Enter a manufacturer...",
    resultsTitle: isCyrillic
      ? "Резултати претраге"
      : isSerbian
        ? "Rezultati pretrage"
        : "Search results",
    tableName: isCyrillic
      ? "Назив производа"
      : isSerbian
        ? "Naziv proizvoda"
        : "Product name",
    tableManufacturer: isCyrillic
      ? "Произвођач"
      : isSerbian
        ? "Proizvođač"
        : "Manufacturer",
    tableCategory: isCyrillic
      ? "Категорија"
      : isSerbian
        ? "Kategorija"
        : "Category",
    tableRegularPrice: isCyrillic
      ? "Регуларна цена"
      : isSerbian
        ? "Regularna cena"
        : "Regular price",
    tableDiscountPrice: isCyrillic
      ? "Цена са попустом"
      : isSerbian
        ? "Cena sa popustom"
        : "Discount price",
    tableLocation: isCyrillic
      ? "Локација"
      : isSerbian
        ? "Lokacija"
        : "Location",
    tableDate: isCyrillic ? "Датум" : isSerbian ? "Datum" : "Date",
    noDiscount: isCyrillic
      ? "Без попуста"
      : isSerbian
        ? "Bez popusta"
        : "No discount",
    firstResults: isCyrillic
      ? `Приказано првих 50 од ${filteredData.length} резултата`
      : isSerbian
        ? `Prikazano prvih 50 od ${filteredData.length} rezultata`
        : `Showing the first 50 of ${filteredData.length} results`,
  };

  return (
    <>
      <Head>
        <title>{`${copy.title} | Vizualni Admin`}</title>
        <meta name="description" content={copy.description} />
      </Head>

      <Header />
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {copy.title}
          </h1>
          <p className="text-gray-600">{copy.description}</p>
        </Box>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {copy.totalProducts}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {filteredData.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {copy.averagePrice}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatRsd(averagePrice, localeMode)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {copy.categories}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {filteredCategories.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {copy.manufacturers}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {filteredManufacturers.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{copy.filters}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.search}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={copy.productPlaceholder}
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.category}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.kategorija}
                onChange={(e) =>
                  setFilters({ ...filters, kategorija: e.target.value })
                }
              >
                <option value="">{copy.allCategories}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {localizeText(cat, localeMode)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.manufacturer}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={copy.manufacturerPlaceholder}
                value={filters.proizvodjac}
                onChange={(e) =>
                  setFilters({ ...filters, proizvodjac: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.minPrice}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                value={filters.minCena}
                onChange={(e) =>
                  setFilters({ ...filters, minCena: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.maxPrice}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="999999"
                value={filters.maxCena}
                onChange={(e) =>
                  setFilters({ ...filters, maxCena: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {copy.location}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.lokacija}
                onChange={(e) =>
                  setFilters({ ...filters, lokacija: e.target.value })
                }
              >
                <option value="">{copy.allLocations}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {localizeText(loc, localeMode)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{copy.resultsTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableName}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableManufacturer}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableCategory}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableRegularPrice}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableDiscountPrice}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableLocation}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {copy.tableDate}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {localizeText(item.naziv, localeMode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.proizvodjac}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {localizeText(item.kategorija, localeMode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatRsd(item.cenaRegular, localeMode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cenaPopust > 0 ? (
                        <span className="text-green-600 font-semibold">
                          {formatRsd(item.cenaPopust, localeMode)}
                        </span>
                      ) : (
                        copy.noDiscount
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {localizeText(item.lokacija, localeMode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.datum).toLocaleDateString(
                        localeMode === "en" ? "en-US" : "sr-RS"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 50 && (
              <div className="px-6 py-3 bg-gray-50 text-center text-sm text-gray-500">
                {copy.firstResults}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Create sample data if no real data exists
    const sampleData: PriceData[] = [
      {
        id: "1",
        naziv: "Лаптоп Dell Inspiron 15",
        proizvodjac: "Dell",
        kategorija: "Електроника",
        cenaRegular: 89999,
        cenaPopust: 79999,
        cenaPoJedinici: "RSD/kom",
        valuta: "RSD",
        lokacija: "Београд",
        datum: new Date().toISOString(),
      },
      {
        id: "2",
        naziv: "Мобилни телефон Samsung Galaxy A54",
        proizvodjac: "Samsung",
        kategorija: "Електроника",
        cenaRegular: 54999,
        cenaPopust: 49999,
        cenaPoJedinici: "RSD/kom",
        valuta: "RSD",
        lokacija: "Нови Сад",
        datum: new Date().toISOString(),
      },
      {
        id: "3",
        naziv: "Сунђер за судове",
        proizvodjac: "Vileda",
        kategorija: "Кућне потрепштине",
        cenaRegular: 299,
        cenaPopust: 0,
        cenaPoJedinici: "RSD/kom",
        valuta: "RSD",
        lokacija: "Ниш",
        datum: new Date().toISOString(),
      },
      {
        id: "4",
        naziv: "Пириначе Тamoти",
        proizvodjac: "Podravka",
        kategorija: "Храна",
        cenaRegular: 189,
        cenaPopust: 149,
        cenaPoJedinici: "RSD/kg",
        valuta: "RSD",
        lokacija: "Београд",
        datum: new Date().toISOString(),
      },
      {
        id: "5",
        naziv: "Сок наранџа 1L",
        proizvodjac: "Nektar",
        kategorija: "Пиће",
        cenaRegular: 250,
        cenaPopust: 0,
        cenaPoJedinici: "RSD/l",
        valuta: "RSD",
        lokacija: "Суботица",
        datum: new Date().toISOString(),
      },
    ];

    const stats = {
      totalProducts: sampleData.length,
      averagePrice:
        sampleData.reduce((sum, item) => sum + item.cenaRegular, 0) /
        sampleData.length,
      categories: [
        ...new Set(sampleData.map((item) => item.kategorija)),
      ].filter(Boolean),
      retailers: ["IDEA", "Lidl", "Delhaize", "Maxi", "Dis Market"],
    };

    return {
      props: {
        initialData: {
          data: sampleData,
          stats,
        },
      },
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
            retailers: [],
          },
        },
      },
    };
  }
};
