import {
  LineChart,
  ColumnChart,
  type StoryConfig,
} from "@/components/demos/charts";

const climateStoryConfig: StoryConfig = {
  id: "climate",
  theme: "climate",
  difficulty: "beginner",
  estimatedTime: "5 min",
  title: {
    sr: "Klimatske Promene: Porast Temperature i Zagađenje",
    en: "Climate Change: Temperature Rise and Pollution",
  },
  description: {
    sr: "Istražite kako se klimatske promene odražavaju na Srbiju kroz podatke o temperaturi, kvalitetu vazduha i prelasku na obnovljive izvore energije.",
    en: "Explore how climate change affects Serbia through data on temperature, air quality, and the transition to renewable energy sources.",
  },
  steps: [
    {
      id: "temperature-rise",
      title: {
        sr: "Porast Temperature: 2°C Od 1980",
        en: "Temperature Rise: +2°C Since 1980",
      },
      narrative: {
        sr: "Prosečna godišnja temperatura u Srbiji porasla je 2°C u poslednjih 40 godina, što je veće od globalnog proseka. Ovo zagrevanje utiče na poljoprivredu, vodne resurse i javno zdravlje.",
        en: "Average annual temperature in Serbia has increased 2°C over the past 40 years, exceeding the global average. This warming impacts agriculture, water resources, and public health.",
      },
      chart: LineChart,
      chartProps: {
        data: [
          { label: "1980", value: 11 },
          { label: "1990", value: 11.3 },
          { label: "2000", value: 11.8 },
          { label: "2010", value: 12.1 },
          { label: "2020", value: 12.8 },
          { label: "2023", value: 13 },
        ],
        xLabel: {
          sr: "Godina",
          en: "Year",
        },
        yLabel: {
          sr: "Prosečna Temperatura (°C)",
          en: "Average Temperature (°C)",
        },
        color: "#10b981",
        showTrendline: true,
      },
      insights: [
        {
          sr: "Sustzan porast temperature od 2°C samo 40 godina ukazuje na ubrzanu klimatsku promenu",
          en: "A sustained temperature increase of 2°C in just 40 years indicates accelerated climate change",
        },
        {
          sr: "Poslednja decenija pokazuje najbrže zagrevanje, sa skokom od 0.7°C između 2010. i 2020.",
          en: "The last decade shows the fastest warming, with a jump of 0.7°C between 2010 and 2020.",
        },
        {
          sr: "Ovaj trend odgovara predviđanjima naučnika za region jugoistočne Evrope",
          en: "This trend aligns with scientists' projections for the Southeast Europe region",
        },
      ],
      callout: {
        sr: "Svaki stepen zagrevanja donosi značajne promene u ekosistemu i svakodnevnom životu",
        en: "Every degree of warming brings significant changes to ecosystems and daily life",
      },
    },
    {
      id: "air-quality",
      title: {
        sr: "Kvalitet Vazduha: PM10 Premašuje WHO Smernice",
        en: "Air Quality: PM10 Exceeds WHO Guidelines",
      },
      narrative: {
        sr: "Veći gradovi u Srbiji konzistentno premašuju bezbedne granice Svetske zdravstvene organizacije za PM10 zagađenje. Čestice PM10 dolaze saobraćaja, industrije i grejanja, predstavljajući rizik za respiratorno zdravlje.",
        en: "Major cities in Serbia consistently exceed WHO safe limits for PM10 pollution. PM10 particles come from traffic, industry, and heating, posing risks to respiratory health.",
      },
      chart: ColumnChart,
      chartProps: {
        data: [
          { label: { sr: "Beograd", en: "Belgrade" }, value: 45 },
          { label: { sr: "Novi Sad", en: "Novi Sad" }, value: 42 },
          { label: { sr: "Niš", en: "Niš" }, value: 48 },
          { label: { sr: "Kragujevac", en: "Kragujevac" }, value: 35 },
          {
            label: { sr: "WHO Granica", en: "WHO Limit" },
            value: 20,
            isBenchmark: true,
          },
        ],
        xLabel: {
          sr: "Grad",
          en: "City",
        },
        yLabel: {
          sr: "PM10 (µg/m³)",
          en: "PM10 (µg/m³)",
        },
        color: "#10b981",
        showBenchmark: true,
      },
      insights: [
        {
          sr: "Niš ima najviši nivo PM10 zagađenja, 2.4 puta iznad WHO dozvoljenih granica",
          en: "Niš has the highest PM10 pollution level, 2.4 times above WHO permitted limits",
        },
        {
          sr: "Čak i Kragujevac, najčišći od merenih gradova, premašuje WHO smernice za 75%",
          en: "Even Kragujevac, the cleanest of measured cities, exceeds WHO guidelines by 75%",
        },
        {
          sr: "Zimska sezona obično donosi još gori kvalitet vazduha zbog grejanja",
          en: "Winter season typically brings even worse air quality due to heating",
        },
      ],
      callout: {
        sr: "Dugoročna izloženost visokom nivou PM10 povećava rizik od srčanih i respiratornih bolesti",
        en: "Long-term exposure to high PM10 levels increases risk of heart and respiratory diseases",
      },
    },
    {
      id: "renewable-transition",
      title: {
        sr: "Tranzicija na Obovljive Izvore",
        en: "Transition to Renewable Sources",
      },
      narrative: {
        sr: "U poslednjih 5 godina, učešće obnovljivih izvora energije u Srbiji poraslo je sa 2% na 15%. Iako je napredak značajan,ugalj i dalje dominira u energetskom miksu. Budućnost leži u daljoj ekspanziji solarne, vetske i hidro energije.",
        en: "In the last 5 years, renewable energy share in Serbia grew from 2% to 15%. While progress is significant, coal still dominates the energy mix. The future lies in further expansion of solar, wind, and hydro energy.",
      },
      chart: ColumnChart,
      chartProps: {
        data: [
          { label: "2018", value: 2 },
          { label: "2019", value: 4 },
          { label: "2020", value: 6 },
          { label: "2021", value: 10 },
          { label: "2022", value: 12 },
          { label: "2023", value: 15 },
        ],
        xLabel: {
          sr: "Godina",
          en: "Year",
        },
        yLabel: {
          sr: "Udeo Obnovljivih Izvora (%)",
          en: "Renewable Energy Share (%)",
        },
        color: "#10b981",
      },
      insights: [
        {
          sr: "Obnovljivi izvori porasli su 7.5 puta u samo 5 godina, pokazujući snažan momentum",
          en: "Renewable sources grew 7.5 times in just 5 years, showing strong momentum",
        },
        {
          sr: "Najveći skok desio se između 2020. i 2021. (+4 procentna poena) nakon pojačanih investicija",
          en: "The biggest jump occurred between 2020 and 2021 (+4 percentage points) after increased investments",
        },
        {
          sr: "Da bi se dostigle EU ciljeve za 2030., neophodno je dalje ubrzanje tranzicije",
          en: "To reach EU 2030 targets, further acceleration of the transition is necessary",
        },
      ],
      callout: {
        sr: "Svaki procenat obnovljive energije smanjuje zavisnost od ugalja i poboljšava kvalitet vazduha",
        en: "Every percent of renewable energy reduces coal dependence and improves air quality",
      },
    },
  ],
};

export default climateStoryConfig;
