import {
  ColumnChart,
  PieChart,
  type StoryConfig,
} from "@/components/demos/charts";

export const economyStory: StoryConfig = {
  id: "economy",
  theme: "economy",
  difficulty: "intermediate",
  estimatedTime: "6 min",
  title: {
    sr: "Ekonomska Tranzicija: Regionalne Nejednakosti i Razvoj",
    en: "Economic Transition: Regional Disparities and Development",
  },
  description: {
    sr: "Istražite ekonomske nejednakosti između regiona Srbije i analize energetskog miksa.",
    en: "Explore economic inequalities between Serbian regions and analyze the energy mix.",
  },
  steps: [
    {
      id: "regional-gdp",
      title: {
        sr: "Regionalni BDP Rast",
        en: "Regional GDP Growth",
      },
      chart: ColumnChart,
      chartProps: {
        data: [
          { label: "Beograd", value: 4.3 },
          { label: "Vojvodina", value: 3.1 },
          { label: "Šumadija", value: 2.7 },
          { label: "Južna/Istočna", value: 2.1 },
        ],
        color: "#f59e0b",
      },
      narrative: {
        sr: "Beograd vodi sa 4.3% rasta BDP-a, dok južne i istočne regione zaostaju sa samo 2.1%. Ova nejednakost odražava historijsku koncentraciju investicija i infrastrukture u glavnom gradu.",
        en: "Belgrade leads with 4.3% GDP growth, while southern and eastern regions lag behind at only 2.1%. This inequality reflects the historical concentration of investments and infrastructure in the capital city.",
      },
      insights: {
        sr: [
          "Beograd doprinosi sa preko 40% nacionalnog BDP-a uprkos što ima samo 25% stanovništva.",
          "Vojvodina i Šumadija pokazuju stabilan rast od 2.7-3.1% zahvaljujući poljoprivrednoj industriji.",
          "Južna i istočna Srbija se suočavaju sa odlivom populacije i manjakom stranih investicija.",
        ],
        en: [
          "Belgrade contributes over 40% of national GDP despite having only 25% of the population.",
          "Vojvodina and Šumadija show stable growth of 2.7-3.1% thanks to the agricultural industry.",
          "Southern and eastern Serbia face population outflow and lack of foreign investment.",
        ],
      },
      callout: {
        sr: "Regionalna diskparitetnost je ključni izazov za održivi razvoj Srbije.",
        en: "Regional disparity is a key challenge for Serbia's sustainable development.",
      },
    },
    {
      id: "energy-mix",
      title: {
        sr: "Energetski Miks: Zavisnost od Ugla",
        en: "Energy Mix: Coal Dependency",
      },
      chart: PieChart,
      chartProps: {
        data: [
          { label: "Ugalj", value: 64 },
          { label: "Hidro", value: 20 },
          { label: "Vetar", value: 8 },
          { label: "Sunce", value: 4 },
          { label: "Gas", value: 3 },
          { label: "Ostalo", value: 1 },
        ],
        color: "#f59e0b",
      },
      narrative: {
        sr: "Čak 64% električne energije u Srbiji i dalje dolazi iz uglja, što je najviši procenat u Evropi. Ova zavisnost predstavlja veliku prepreku za tranziciju ka zelenoj energetici.",
        en: "As much as 64% of electricity in Serbia still comes from coal, the highest percentage in Europe. This dependency represents a major obstacle to the transition to green energy.",
      },
      insights: {
        sr: [
          "Srbija ima najveći udeo uglja u proizvodnji elektriciteta u Evropi.",
          "Obnovljivi izvori (vetar, sunce) čine samo 12%, mnogo ispod EU proseka od 22%.",
          "Zemlja se suočava sa pritiskom EU da dekarbonizuje energetski sektor do 2050.",
        ],
        en: [
          "Serbia has the highest share of coal in electricity production in Europe.",
          "Renewable sources (wind, solar) make up only 12%, far below the EU average of 22%.",
          "The country faces EU pressure to decarbonize the energy sector by 2050.",
        ],
      },
      callout: {
        sr: "Energetska tranzicija je neizbežna za evropske integracije.",
        en: "Energy transition is inevitable for European integration.",
      },
    },
    {
      id: "digital-skills",
      title: {
        sr: "Digitalni Jaz: Nedostatak Veština",
        en: "Digital Skills Gap: Skills Shortage",
      },
      chart: ColumnChart,
      chartProps: {
        data: [
          { label: "Mladost 15-24", value: 58 },
          { label: "Odrasli 25-54", value: 51 },
          { label: "Stariji 55+", value: 28 },
        ],
        color: "#f59e0b",
      },
      narrative: {
        sr: "Samo 42% stanovništva ima osnovne digitalne veštine, što ometa ekonomski rast i privlačenje investicija u IT sektor.",
        en: "Only 42% of the population has basic digital skills, hindering economic growth and attracting investment in the IT sector.",
      },
      insights: {
        sr: [
          "Mlada populacija (15-24) ima najviši nivo digitalnih veština sa 58%, ali i dalje ispod EU proseka.",
          "Samo polovina radno aktivnog stanovništva (25-54) ima adekvatne digitalne veštine.",
          "Starija populacija (55+) je posebno ugrožena sa samo 28% osnovnih digitalnih veština.",
        ],
        en: [
          "Young population (15-24) has the highest level of digital skills at 58%, but still below the EU average.",
          "Only half of the working-age population (25-54) has adequate digital skills.",
          "Older population (55+) is particularly vulnerable with only 28% having basic digital skills.",
        ],
      },
      callout: {
        sr: "Digitalna edukacija je kritična za budućnost tržišta rada.",
        en: "Digital education is critical for the future of the labor market.",
      },
    },
  ],
};
