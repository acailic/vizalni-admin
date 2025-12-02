import { GetStaticProps } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";

import SerbianDashboard from "@/components/serbian/serbian-dashboard";
import { SerbianLanguageVariant } from "@/components/serbian/serbian-language-utils";

interface SerbianDataPageProps {
  initialData?: any;
}

const SerbianDataPage: React.FC<SerbianDataPageProps> = ({ initialData }) => {
  const [language, setLanguage] = useState<SerbianLanguageVariant>("sr-Latn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect user's preferred language/script
    if (typeof window !== 'undefined') {
      const userLang = navigator.language;
      if (userLang.startsWith('sr')) {
        // Check if user prefers Cyrillic (this is a simple heuristic)
        const prefersCyrillic = localStorage.getItem('serbian-script') === 'cyrillic';
        setLanguage(prefersCyrillic ? 'sr-Cyrl' : 'sr-Latn');
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {language === "sr-Latn"
            ? "Srpski Podaci - Vizualizacija otvorenih podataka Republike Srbije"
            : language === "sr-Cyrl"
            ? "Српски Подаци - Визуализација отворених података Републике Србије"
            : "Serbian Data - Open Data Visualization Republic of Serbia"
          }
        </title>
        <meta name="description" content={
          language === "sr-Latn"
            ? "Interaktivna vizualizacija srpskih državnih podataka: budžet, kvalitet vazduha, demografija, energija"
            : language === "sr-Cyrl"
            ? "Интерактивна визуализација српских државних података: буџет, квалитет ваздуха, демографија, енергија"
            : "Interactive visualization of Serbian government data: budget, air quality, demographics, energy"
        } />
        <meta name="keywords" content={
          language === "sr-Latn"
            ? "Srbija, otvoreni podaci, vizualizacija, budžet, demografija, energija, kvalitet vazduha"
            : language === "sr-Cyrl"
            ? "Србија, отворени подаци, визуализација, буџет, демографија, енергија, квалитет ваздуха"
            : "Serbia, open data, visualization, budget, demographics, energy, air quality"
        } />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph tags */}
        <meta property="og:title" content={
          language === "sr-Latn"
            ? "Srpski Podaci - Vizualizacija otvorenih podataka"
            : language === "sr-Cyrl"
            ? "Српски Подаци - Визуализација отворених података"
            : "Serbian Data - Open Data Visualization"
        } />
        <meta property="og:description" content={
          language === "sr-Latn"
            ? "Interaktivna vizualizacija srpskih državnih podataka"
            : language === "sr-Cyrl"
            ? "Интерактивна визуализација српских државних података"
            : "Interactive visualization of Serbian government data"
        } />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/serbian-data-og.png" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={
          language === "sr-Latn"
            ? "Srpski Podaci - Vizualizacija"
            : language === "sr-Cyrl"
            ? "Српски Подаци - Визуализација"
            : "Serbian Data - Visualization"
        } />
        <meta name="twitter:description" content={
          language === "sr-Latn"
            ? "Interaktivna vizualizacija srpskih državnih podataka"
            : language === "sr-Cyrl"
            ? "Интерактивна визуализација српских државних података"
            : "Interactive visualization of Serbian government data"
        } />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-gray-900">
                    🇷🇸 Srpski Podaci
                  </h1>
                </div>
                <nav className="hidden md:ml-10 md:flex md:space-x-8">
                  <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {language === "sr-Latn" ? "Početna" : language === "sr-Cyrl" ? "Почетна" : "Home"}
                  </a>
                  <a href="#datasets" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {language === "sr-Latn" ? "Datasetovi" : language === "sr-Cyrl" ? "Датасетови" : "Datasets"}
                  </a>
                  <a href="#about" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    {language === "sr-Latn" ? "O projektu" : language === "sr-Cyrl" ? "О пројекту" : "About"}
                  </a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {language === "sr-Latn" ? "Jezik:" : language === "sr-Cyrl" ? "Језик:" : "Language:"}
                  </span>
                  <select
                    value={language}
                    onChange={(e) => {
                      const newLang = e.target.value as SerbianLanguageVariant;
                      setLanguage(newLang);
                      localStorage.setItem('serbian-script', newLang === 'sr-Cyrl' ? 'cyrillic' : 'latin');
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="sr-Latn">Latinica</option>
                    <option value="sr-Cyrl">Ћирилица</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === "sr-Latn"
                ? "Vizualizacija otvorenih podataka Republike Srbije"
                : language === "sr-Cyrl"
                ? "Визуализација отворених података Републике Србије"
                : "Open Data Visualization Republic of Serbia"
              }
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === "sr-Latn"
                ? "Istrajite u interaktivne vizualizacije srpskih državnih podataka iz oblasti budžeta, kvaliteta vazduha, demografije i energije."
                : language === "sr-Cyrl"
                ? "Истражите интерактивне визуализације српских државних података из области буџета, квалитета ваздуха, демографије и енергије."
                : "Explore interactive visualizations of Serbian government data covering budget, air quality, demographics, and energy."
              }
            </p>
          </div>

          {/* Dashboard Component */}
          <SerbianDashboard
            initialLanguage={language}
            showInteractiveFeatures={true}
            height={500}
            activeDataset="overview"
          />

          {/* Additional Information Sections */}
          <div className="mt-16 space-y-16">
            {/* Dataset Information */}
            <section id="datasets">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {language === "sr-Latn"
                  ? "Dostupni datasetovi"
                  : language === "sr-Cyrl"
                  ? "Доступни датасетови"
                  : "Available Datasets"
                }
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h4 className="font-semibold text-lg mb-2">
                    {language === "sr-Latn" ? "Budžet" : language === "sr-Cyrl" ? "Буџет" : "Budget"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "sr-Latn"
                      ? "Državni budžeti i finansije"
                      : language === "sr-Cyrl"
                      ? "Државни буџети и финансије"
                      : "State budgets and finances"
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🌍</div>
                  <h4 className="font-semibold text-lg mb-2">
                    {language === "sr-Latn" ? "Kvalitet vazduha" : language === "sr-Cyrl" ? "Квалитет ваздуха" : "Air Quality"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "sr-Latn"
                      ? "Environmentalni podaci i monitorinzi"
                      : language === "sr-Cyrl"
                      ? "Енvironmentални подаци и мониторинзи"
                      : "Environmental data and monitoring"
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h4 className="font-semibold text-lg mb-2">
                    {language === "sr-Latn" ? "Demografija" : language === "sr-Cyrl" ? "Демографија" : "Demographics"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "sr-Latn"
                      ? "Popis stanovništva i projekcije"
                      : language === "sr-Cyrl"
                      ? "Попис становништва и пројекције"
                      : "Population census and projections"
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="font-semibold text-lg mb-2">
                    {language === "sr-Latn" ? "Energija" : language === "sr-Cyrl" ? "Енергија" : "Energy"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === "sr-Latn"
                      ? "Proizvodnja i potrošnja energije"
                      : language === "sr-Cyrl"
                      ? "Производња и потрошња енергије"
                      : "Energy production and consumption"
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {language === "sr-Latn"
                  ? "O projektu"
                  : language === "sr-Cyrl"
                  ? "О пројекту"
                  : "About the Project"
                }
              </h3>
              <div className="prose prose-lg max-w-none">
                <p>
                  {language === "sr-Latn"
                    ? "Ovaj platforma pruža interaktivan pristup otvorenim podacima Republike Srbije. Cilj je da se građanima, istraživačima i developerima omogući lak pristup i razumevanje državnih podataka kroz moderne vizualizacije."
                    : language === "sr-Cyrl"
                    ? "Овај платформа пружа интерактиван приступ отвореним подацима Републике Србије. Циљ је да се грађанима, истраживачима и developerима омогући лак приступ и разумевање државних података кроз модерне визуализације."
                    : "This platform provides interactive access to open data of the Republic of Serbia. The goal is to enable citizens, researchers, and developers to easily access and understand government data through modern visualizations."
                  }
                </p>
                <p>
                  {language === "sr-Latn"
                    ? "Svi podaci su preuzeti sa zvaničnog portala otvorenih podataka data.gov.rs i redovno se ažuriraju."
                    : language === "sr-Cyrl"
                    ? "Сви подаци су преузети са званичног портала отворених података data.gov.rs и редовно се ажурирају."
                    : "All data is sourced from the official open data portal data.gov.rs and is regularly updated."
                  }
                </p>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                © 2024 {language === "sr-Latn" ? "Srpski Podaci" : language === "sr-Cyrl" ? "Српски Подаци" : "Serbian Data"}.
                {language === "sr-Latn"
                  ? " Sva prava zadržana."
                  : language === "sr-Cyrl"
                  ? " Сва права задржана."
                  : " All rights reserved."
                }
              </div>
              <div className="flex space-x-6 text-sm text-gray-500">
                <a href="https://data.gov.rs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                  data.gov.rs
                </a>
                <a href="https://www.euprava.gov.rs" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                  eUprava
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<SerbianDataPageProps> = async () => {
  // Fetch initial data if needed
  // This could include pre-fetching some dataset metadata
  return {
    props: {
      initialData: null
    },
    revalidate: 3600 // Revalidate every hour
  };
};

export default SerbianDataPage;