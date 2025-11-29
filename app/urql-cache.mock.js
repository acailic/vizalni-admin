import { stringifyComponentId } from "@/graphql/make-component-id";
import { ScaleType } from "@/graphql/query-hooks";
import { getCachedComponents } from "@/urql-cache";

export const getCachedComponentsMock = {
  serbianRegionsAndDistricts: {
    dimensions: [
      {
        __typename: "GeoShapesDimension",
        cubeIri: "https://data.gov.rs/dataset/administrative-division",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/administrative-division",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/district",
        }),
        label: "Okrug",
        scaleType: "Nominal" as ScaleType,
        isNumerical: false,
        isKeyDimension: true,
        values: [
          {
            value: "https://data.gov.rs/district/1",
            label: "Severnobački okrug",
            identifier: 1,
            alternateName: "RS01",
          },
          {
            value: "https://data.gov.rs/district/2",
            label: "Srednjebanatski okrug",
            identifier: 2,
            alternateName: "RS02",
          },
          {
            value: "https://data.gov.rs/district/3",
            label: "Južnobanatski okrug",
            identifier: 3,
            alternateName: "RS03",
          },
          {
            value: "https://data.gov.rs/district/4",
            label: "Zapadnobački okrug",
            identifier: 4,
            alternateName: "RS04",
          },
          {
            value: "https://data.gov.rs/district/5",
            label: "Južnobački okrug",
            identifier: 5,
            alternateName: "RS05",
          },
          {
            value: "https://data.gov.rs/district/6",
            label: "Sremski okrug",
            identifier: 6,
            alternateName: "RS06",
          },
          {
            value: "https://data.gov.rs/district/7",
            label: "Mačvanski okrug",
            identifier: 7,
            alternateName: "RS07",
          },
          {
            value: "https://data.gov.rs/district/8",
            label: "Kolubarski okrug",
            identifier: 8,
            alternateName: "RS08",
          },
          {
            value: "https://data.gov.rs/district/9",
            label: "Podunavski okrug",
            identifier: 9,
            alternateName: "RS09",
          },
          {
            value: "https://data.gov.rs/district/10",
            label: "Braničevski okrug",
            identifier: 10,
            alternateName: "RS10",
          },
          {
            value: "https://data.gov.rs/district/11",
            label: "Šumadijski okrug",
            identifier: 11,
            alternateName: "RS11",
          },
          {
            value: "https://data.gov.rs/district/12",
            label: "Rasiinski okrug",
            identifier: 12,
            alternateName: "RS12",
          },
          {
            value: "https://data.gov.rs/district/13",
            label: "Nišavski okrug",
            identifier: 13,
            alternateName: "RS13",
          },
          {
            value: "https://data.gov.rs/district/14",
            label: "Toplički okrug",
            identifier: 14,
            alternateName: "RS14",
          },
          {
            value: "https://data.gov.rs/district/15",
            label: "Pirotski okrug",
            identifier: 15,
            alternateName: "RS15",
          },
          {
            value: "https://data.gov.rs/district/16",
            label: "Jablanički okrug",
            identifier: 16,
            alternateName: "RS16",
          },
          {
            value: "https://data.gov.rs/district/17",
            label: "Pčinjski okrug",
            identifier: 17,
            alternateName: "RS17",
          },
          {
            value: "https://data.gov.rs/district/18",
            label: "Borski okrug",
            identifier: 18,
            alternateName: "RS18",
          },
          {
            value: "https://data.gov.rs/district/19",
            label: "Zaječarski okrug",
            identifier: 19,
            alternateName: "RS19",
          },
          {
            value: "https://data.gov.rs/district/20",
            label: "Zlatiborski okrug",
            identifier: 20,
            alternateName: "RS20",
          },
          {
            value: "https://data.gov.rs/district/21",
            label: "Moravički okrug",
            identifier: 21,
            alternateName: "RS21",
          },
          {
            value: "https://data.gov.rs/district/22",
            label: "Raški okrug",
            identifier: 22,
            alternateName: "RS22",
          },
          {
            value: "https://data.gov.rs/district/23",
            label: "Raski okrug",
            identifier: 23,
            alternateName: "RS23",
          },
          {
            value: "https://data.gov.rs/district/24",
            label: "Pećki okrug",
            identifier: 24,
            alternateName: "RS24",
          },
          {
            value: "https://data.gov.rs/district/25",
            label: "Prizrenski okrug",
            identifier: 25,
            alternateName: "RS25",
          },
          {
            value: "https://data.gov.rs/district/26",
            label: "Kosovski okrug",
            identifier: 26,
            alternateName: "RS26",
          },
          {
            value: "https://data.gov.rs/district/27",
            label: "Kosovskomitrovački okrug",
            identifier: 27,
            alternateName: "RS27",
          },
          {
            value: "https://data.gov.rs/district/28",
            label: "Kosovskopomoravski okrug",
            identifier: 28,
            alternateName: "RS28",
          },
          {
            value: "https://data.gov.rs/district/29",
            label: "Grad Beograd",
            identifier: 29,
            alternateName: "RSBG",
          },
        ],
        relatedLimitValues: [],
        related: [],
        hierarchy: null,
      },
      {
        __typename: "NominalDimension",
        cubeIri: "https://data.gov.rs/dataset/energy-consumption",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-consumption",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/consumption-category",
        }),
        label: "Kategorije potrošnje",
        scaleType: "Nominal" as ScaleType,
        isNumerical: false,
        isKeyDimension: true,
        values: [
          {
            value: "https://data.gov.rs/energy/category/domestic-low",
            label: "Domaćinstvo - Niska potrošnja",
            description: "Do 2.000 kWh/godišnje: Stan sa minimalnom potrošnjom",
          },
          {
            value: "https://data.gov.rs/energy/category/domestic-medium",
            label: "Domaćinstvo - Srednja potrošnja",
            description: "2.001-4.000 kWh/godišnje: Standardni stan",
          },
          {
            value: "https://data.gov.rs/energy/category/domestic-high",
            label: "Domaćinstvo - Visoka potrošnja",
            description: "4.001-6.000 kWh/godišnje: Veći stan ili kuća",
          },
          {
            value: "https://data.gov.rs/energy/category/domestic-very-high",
            label: "Domaćinstvo - Vrlo visoka potrošnja",
            description: "Preko 6.000 kWh/godišnje: Kuća sa grejanjem na struju",
          },
          {
            value: "https://data.gov.rs/energy/category/business-small",
            label: "Poslovni - Mali",
            description: "Do 15.000 kWh/godišnje: Malo preduzeće ili ordžanije",
          },
          {
            value: "https://data.gov.rs/energy/category/business-medium",
            label: "Poslovni - Srednji",
            description: "15.001-50.000 kWh/godišnje: Srednje preduzeće",
          },
          {
            value: "https://data.gov.rs/energy/category/business-large",
            label: "Poslovni - Veliki",
            description: "50.001-200.000 kWh/godišnje: Veliko preduzeće",
          },
          {
            value: "https://data.gov.rs/energy/category/industrial",
            label: "Industrijski",
            description: "Preko 200.000 kWh/godišnje: Industrijska potrošnja",
          },
          {
            value: "https://data.gov.rs/energy/category/agricultural",
            label: "Poljoprivredni",
            description: "Specijalizovana poljoprivredna potrošnja",
          },
          {
            value: "https://data.gov.rs/energy/category/public",
            label: "Javni sektor",
            description: "Škole, bolnice, opštinske zgrade",
          },
        ],
        relatedLimitValues: [],
        related: [],
        hierarchy: null,
      },
      {
        __typename: "NominalDimension",
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/tariff-type",
        }),
        label: "Tip tarife",
        scaleType: "Nominal" as ScaleType,
        isNumerical: false,
        isKeyDimension: true,
        values: [
          {
            value: "https://data.gov.rs/energy/tariff/standard",
            label: "Standardna tarifa",
          },
          {
            value: "https://data.gov.rs/energy/tariff/night",
            label: "Noćna tarifa (NT)",
          },
          {
            value: "https://data.gov.rs/energy/tariff/peak",
            label: "Viša tarifa (VT)",
          },
        ],
        relatedLimitValues: [],
        related: [],
        hierarchy: null,
      },
    ],
    measures: [
      {
        __typename: "NumericalMeasure",
        isCurrency: true,
        isDecimal: true,
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/total-cost",
        }),
        label: "Ukupna cena po kWh",
        description: "Ukupni troškovi struje po kilovat-satu. Uključuje sve varijabilne troškove",
        scaleType: "Ratio" as ScaleType,
        isNumerical: false,
        isKeyDimension: false,
        values: [
          { value: 8.5, label: "8.5" },
          { value: 15.2, label: "15.2" },
        ],
        relatedLimitValues: [],
        related: [],
        limits: [],
      },
      {
        __typename: "NumericalMeasure",
        isCurrency: true,
        isDecimal: true,
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/distribution-cost",
        }),
        label: "Cena distribucije",
        scaleType: "Ratio" as ScaleType,
        isNumerical: false,
        isKeyDimension: false,
        values: [
          { value: 3.2, label: "3.2" },
          { value: 6.8, label: "6.8" },
        ],
        relatedLimitValues: [],
        related: [],
        limits: [],
      },
      {
        __typename: "NumericalMeasure",
        isCurrency: true,
        isDecimal: true,
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/energy-cost",
        }),
        label: "Cena energije",
        scaleType: "Ratio" as ScaleType,
        isNumerical: false,
        isKeyDimension: false,
        values: [
          { value: 4.5, label: "4.5" },
          { value: 12.1, label: "12.1" },
        ],
        relatedLimitValues: [],
        related: [],
        limits: [],
      },
      {
        __typename: "NumericalMeasure",
        isCurrency: true,
        isDecimal: true,
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/fees",
        }),
        label: "Naknade i doprinosi",
        scaleType: "Ratio" as ScaleType,
        isNumerical: false,
        isKeyDimension: false,
        values: [
          { value: 0.8, label: "0.8" },
          { value: 3.5, label: "3.5" },
        ],
        relatedLimitValues: [],
        related: [],
        limits: [],
      },
      {
        __typename: "NumericalMeasure",
        isCurrency: true,
        isDecimal: true,
        cubeIri: "https://data.gov.rs/dataset/energy-tariffs",
        id: stringifyComponentId({
          unversionedCubeIri:
            "https://data.gov.rs/dataset/energy-tariffs",
          unversionedComponentIri:
            "https://data.gov.rs/dataset/dimension/renewable-fee",
        }),
        label: "Naknada za podsticaj proizvodnje iz OBIE",
        scaleType: "Ratio" as ScaleType,
        isNumerical: false,
        isKeyDimension: false,
        values: [
          { value: 0.45, label: "0.45" },
          { value: 1.2, label: "1.2" },
        ],
        relatedLimitValues: [],
        related: [],
        limits: [],
      },
    ],
  },
  geoAndNumerical: {
    dimensions: [
      {
        __typename: "GeoShapesDimension",
        cubeIri: "mapDataset",
        id: stringifyComponentId({
          unversionedCubeIri: "mapDataset",
          unversionedComponentIri: "newAreaLayerColorIri",
        }),
        label: "Geo shapes dimension",
        isNumerical: false,
        isKeyDimension: true,
        values: [
          {
            value: "orange",
            label: "orange",
            color: "rgb(255, 153, 0)",
          },
        ],
        relatedLimitValues: [],
      },
      {
        __typename: "GeoCoordinatesDimension",
        cubeIri: "mapDataset",
        id: stringifyComponentId({
          unversionedCubeIri: "mapDataset",
          unversionedComponentIri: "symbolLayerIri",
        }),
        label: "Geo coordinates dimension",
        isNumerical: false,
        isKeyDimension: true,
        values: [
          { value: "x", label: "y" },
          { value: "xPossible", label: "yPossible" },
        ],
        relatedLimitValues: [],
      },
    ],
    measures: [
      {
        __typename: "NumericalMeasure",
        cubeIri: "mapDataset",
        id: stringifyComponentId({
          unversionedCubeIri: "mapDataset",
          unversionedComponentIri: "measure",
        }),
        label: "Numerical dimension",
        isNumerical: true,
        isKeyDimension: false,
        values: [],
        relatedLimitValues: [],
        limits: [],
      },
    ],
  },
} satisfies Record<string, ReturnType<typeof getCachedComponents>>;
