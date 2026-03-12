Open Data API of the Statistical Office of Serbia (SORS) – Data Categories and
Usage

The Statistical Office of the Republic of Serbia provides an Open Data API with
a broad range of datasets. The API is organized into 24 categories covering 735
datasets of official statistics ￼. These categories span demographics, economy,
agriculture, labor, environment, and more. The data is free to use and updated
regularly, making it a rich resource for building visualizations and
applications. Below is a structured overview of key content areas (demographics,
economy, agriculture, labor, accidents, air quality) and how they can be
accessed for use in a JavaScript (JS) context.

Demographics (Population and Census Data)

Content: The API offers extensive demographic data under the Population category
and census datasets. This includes time-series indicators on population counts
and vital statistics. For example, the portal provides annual data on live
births (“Живорођени”) and deaths (“Умрли”) going back to 1961 ￼ ￼. These series
are available by year (and often by region or sex), along with derived measures
like birth rates and death rates ￼ ￼. Users can also find life expectancy data
and other population health indicators ￼.

Census Data: Detailed results from the national censuses are published as open
data. The 2011 Census provides datasets on population characteristics such as
ethnicity, education, economic activity, and migration at fine geographic
levels. For instance, there are tables for population by nationality and
municipality, and internal migration flows (with thousands of records each) ￼.
The 2022 Census data is being added as well – initial datasets (e.g. total
population and basic attributes by municipality) are available, with tens of
thousands of records in some tables ￼ ￼. These census datasets enable rich
visualizations (like choropleth maps of population distribution, or charts of
population by age group) using the granular statistics.

Notable Datasets: Some examples of demographics datasets include: Population
estimates by year and region, Births and deaths by sex and year, Average age of
population by sex ￼, Internal migration 2011–2021 (with ~196k records) ￼, and
Population by economic activity, age, sex, and municipality (from census), among
many others. These data can be used to create impactful visualizations such as
population pyramids, trend lines of birth/death rates, and maps of demographic
indicators.

Economy (National Accounts, Prices, Trade, Industry)

Content: The economic data in the open data API is comprehensive, covering
national accounts (GDP and related aggregates), price indices, external trade,
and sectoral statistics (industry, construction, etc.). In the National Accounts
category, users can retrieve Gross Domestic Product (GDP) figures. For example,
quarterly GDP by the production approach is available from 1995 up to the latest
quarter ￼. There are both non-seasonally adjusted and seasonally adjusted GDP
series (production and expenditure approaches) with data at quarterly frequency
through 2025 ￼. These can be visualized as time-series charts of GDP growth or
sector contributions.

Prices: The Prices category provides inflation and price index data. This
includes consumer price indices as well as producer price indices. For instance,
the API has retail price indices (base and chain indices) and modern CPI series.
As an example, consumer price indices from 2007 to 2025 are available, including
base indices (e.g. 2006=100) and monthly chain indices ￼. Producer price indices
(PPI) are detailed by product group and market (domestic, export, import) ￼ ￼.
These datasets enable visualization of inflation trends over time or comparison
of price changes across sectors.

Foreign Trade: Detailed trade statistics are accessible under the External Trade
category. The API provides data on exports and imports over time, both in
aggregate and broken down by commodity classification. For example, one dataset
gives total exports by month from 2004 to the present ￼. More granular tables
list exports by SITC sector, division, and group – e.g. exports by SITC sections
(Rev.4) with over 56,000 records, and by detailed commodity groups with ~874,000
records ￼ ￼. Similar datasets exist for imports. These large datasets can be
used to create interactive trade visualizations, such as trend charts of total
export/import values and tree maps or bar charts of top commodities.

Industry and Other Sectors: The open data catalog also covers industrial
production and other sectoral indicators. Under Industry, for instance, one can
find the Industrial Production Index (IPI) series. A chain index of industrial
production by activity is available for 2000–2024 ￼. There are separate indices
by purpose of use as well ￼. Energy and Construction categories similarly
contain data like energy balances, building activity, etc., while Structural
Business Statistics and Internal Trade give business sector metrics. These
datasets support visualizing economic structure and trends (e.g. industrial
output growth, energy production trends).

Notable Datasets: Key economy-related datasets include: Quarterly and annual GDP
(current and constant prices) ￼, Price indices (CPI and PPI) ￼, Monthly exports
and imports totals ￼, Exports by product category (SITC Rev.4) ￼, Industrial
production indices by sector ￼, and Business enterprise statistics (e.g. number
of enterprises, employment, turnover by sector). These provide a rich basis for
dashboards on economic performance – for example, an interactive chart of GDP
growth alongside inflation rates, or a visualization of export composition by
industry.

Agriculture

Content: The Agriculture, Forestry and Fishery category contains very detailed
data, notably from the 2012 Census of Agriculture. This data is extremely
granular – covering the number of agricultural holdings (farms) and the areas
under various crops, by different classifications. For example, one dataset
titled “Broj gazdinstava i površina pod različitim usevima prema tipu
proizvodnje” (Number of holdings and area under different crops by type of
production) contains over 2.27 million records ￼, reflecting the rich detail of
the census. This includes breakdowns by crop type, production type (e.g.
commercial vs subsistence), farm size, regions, etc. Other datasets detail areas
under specific crops (wheat, corn, potatoes, etc.) by farm size categories ￼ ￼,
number of livestock, agricultural machinery counts, and more, all for the
year 2012.

Usage: These agriculture datasets allow for in-depth analysis and visualization
of Serbia’s agricultural structure. For instance, one could map the distribution
of certain crop areas by municipality or create charts comparing farm size
distributions. The data includes entries like “Number of farms and area by size
for wheat” ￼ or “for sugar beet” ￼, etc., each with thousands of records.
Although most series are currently for the 2012 reference year (the last
agricultural census), they provide baseline insights. (Regular annual
agricultural production data may be available in other formats, but on the open
data portal the census data is a highlight.) When building a visualization
package, these datasets can power features like crop yield comparisons, regional
agricultural profiles, or time comparisons once a new census is added (e.g. a
future 2023/24 census).

Notable Datasets: Agricultural Census 2012 datasets, including: Crop areas by
farm type (millions of data points) ￼, Crop areas by farm size ￼ ￼, and similar
datasets for different categories of crops (cereals, vegetables, industrial
crops, etc.) ￼ ￼. Also, data on livestock numbers, orchard areas, forestry, and
fisheries (as applicable) are included. These can be used to create impactful
visuals such as regional distribution maps (for example, which regions have the
largest average farm size or the highest cultivation of a certain crop) or
interactive filtering tools for agricultural statistics.

Labor (Employment, Unemployment, Wages)

Content: The Labour Market category provides data from labor force surveys and
administrative sources, including employment/unemployment figures and wages.
Users can access employment and unemployment rates, labor force participation,
and related indicators by various breakdowns. For instance, the API offers
unemployment, employment, activity, and inactivity rates by region and by
quarter/year. One dataset covers activity, employment, inactivity, and
unemployment rates by region for 2014–2020 ￼. Another provides these rates by
quarter nationally from 2014 to 2020 ￼. There are also more detailed survey
indicators: e.g. unemployed persons by duration of job search, by region and
education level, etc., from the Labour Force Survey ￼. The data is typically
segmented by sex, age group, region, and time.

Wages: A significant portion of labor data is on earnings. The portal includes
series on average monthly wages (mean and median). For example, “Prosječne bruto
zarade – prosječne mesečne zarade, ukupno” (Average gross earnings – average
monthly earnings, total) is available from 1977 up to the latest month ￼. There
are also wage breakdowns: average wages by industry sector, by region of
residence, by public vs private sector, etc., some on a monthly basis and some
annual ￼ ￼. For instance, average gross wages by municipality (residence of
employees) have over 19,000 records for recent years ￼, and median wages are
available from 2018 onward ￼. These allow visualization of wage growth over
time, regional wage disparities, and sectoral comparisons.

Notable Datasets: Key labor datasets include: Labor force participation and
unemployment rates (annual and quarterly) ￼ ￼, Number of unemployed by duration
and region ￼, Average monthly gross wages (total and by sector) ￼, Median wage
￼, Employment by industry share (e.g. manufacturing employment share) ￼, and
more. These can be used to create interactive dashboards – for example, a line
chart of unemployment rate trends, or a heatmap of average wages across regions.
The data’s granularity (some quarterly, some monthly) is suitable for
time-series visualization in a JS library.

Accidents (Traffic Accidents Data)

Content: The open data API also contains statistics on traffic accidents, which
is listed under the Transport and Telecommunications category. Specifically,
there are datasets for road traffic accidents with casualties. For example, one
dataset “Саобраћајне незгоде са настрадалим лицима” (Traffic accidents with
casualties) covers the years 2006–2011 ￼. A related dataset “Настрадала лица у
саобраћајним незгодама” (Persons injured or killed in traffic accidents) covers
the same period ￼. Each of these contains 54 records, which likely correspond to
annual figures (perhaps broken down by some category such as region or
severity). The data includes the number of accidents and the number of
casualties (injuries/fatalities).

Usage: Although the time coverage (2006–2011) is limited in these datasets, they
provide valuable historical insight into road safety. A visualization package
could use this data to show trends in accident counts or casualty numbers over
that period – for instance, a line chart comparing the number of accidents per
year to the number of persons injured/killed per year. If combined with external
or newer data (if available elsewhere), one could extend the trend. Nonetheless,
these open datasets can serve as examples or benchmarks for road safety
statistics.

Notable Datasets: Traffic accidents with casualties (2006–2011) ￼ and Casualties
in traffic accidents (2006–2011) ￼. Both come from the Ministry of Interior or
the Statistical Office data collaboration. They can be visualized to highlight
the changes in accident numbers and their consequences over the observed years.
For a modern package, this data might be used in conjunction with maps (if data
is regional) or as part of a storytelling graphic about road safety
improvements.

Air Quality and Environmental Data

Content: Under the Environment (Животна средина) category, the API provides
various environmental statistics, including data relevant to air quality. One
notable dataset is emissions of air pollutants. The dataset “Емисије загађујућих
материја” (Emissions of polluting substances) covers the period 2008–2023 with
7,616 records ￼. This dataset, provided by the national Environmental Protection
Agency, likely contains annual emission totals of key pollutants (such as
PM${2.5}$, PM${10}$, SO$_2$, NO$_x$, etc.), possibly broken down by sector or
region. It is kept up-to-date (last updated September 2025) ￼, making it very
useful for tracking environmental performance.

In addition to emissions, the environment category includes other data like
water usage and waste. For example, industrial water use by source is available
(one dataset has 17,280 records for 2007–2024) ￼, and there are data on waste
management, protected areas, etc., as part of environmental statistics. The
portal also aligns with Sustainable Development Goals (SDG) indicators – for
instance, an SDG indicator dataset provides annual average PM2.5 and PM10
concentrations in cities ￼, which is directly related to air quality.

Usage: These datasets enable impactful visualizations about the environment. One
could plot the trend of total pollutant emissions over time or create a
sector-wise emission chart (e.g. how much each sector contributes to CO$_2$
emissions). If data is by region, maps of air pollutant emissions or air quality
index could be made. The air quality (pollution) data in particular can be
visualized to raise public awareness – e.g. showing improvement or deterioration
of air pollution levels over years. For a semantic and engaging presentation,
one might integrate this data with health or population data (to show exposure)
in a dashboard.

Notable Datasets: Emissions of pollutants 2008–2023 ￼ (from the Environmental
Protection Agency), Annual mean particulate matter (PM2.5/PM10) levels in cities
(SDG 11.6.2 indicator), Industrial water usage by source ￼, Waste generated and
treated, and other environmental indicators. These open data allow developers to
create visual tools like pollution trend graphs, comparisons of environmental
indicators across municipalities, and correlation visuals (e.g. overlaying
pollution data with population density maps for insight).

Accessing the Data – API Format and Integration in JS

The SORS open data portal supports programmatic access via a RESTful API. Data
can be retrieved in JSON or CSV format, which is convenient for use in
JavaScript applications. Each dataset has a unique endpoint URL. For example,
the traffic accidents dataset mentioned above can be accessed as JSON at:

https://opendata.stat.gov.rs/data/WcfJsonRestService.Service1.svc/dataset/1521IND01/1/json

and similarly as CSV by replacing the format at the end ￼ ￼. In these URLs,
1521IND01 is an identifier for the dataset, and the number (e.g. /1/ or
sometimes /3/) may represent a subresource or language code (the API uses a WCF
service, and in some cases different numbers appear for different datasets). The
API endpoints are part of an OData service (.../odata/), meaning standard OData
query parameters might be supported as well (e.g. for filtering or selecting
specific fields), although the simplest usage is to retrieve the full dataset in
the desired format.

Integration: In a JS context, you can fetch the data using standard HTTP
requests (e.g. using fetch() in modern JS or libraries like Axios). Since the
API returns JSON, it can be directly parsed into objects for use in charts. For
instance, to use a dataset, you would perform a GET request to its JSON URL and
then iterate over the returned array of records to feed into visualization
libraries (D3.js, Chart.js, etc.). The portal’s JSON follows a structure of
records with clearly named fields (often in Serbian; a codebook is usually
provided via the Šifarnik category for understanding codes). Alternatively, one
can download the CSV and use it in a data processing library or convert it to
JSON.

Efficiency and Translation: The data is in Serbian (with metadata usually in
Serbian language). However, many datasets use numeric codes or recognizable
abbreviations (e.g. codes for regions, or international classifications like
SITC, NACE, etc.). For building a visualization package, it may be useful to
translate or alias certain field names for end-users. The code lists (Šифарник)
category provides reference tables (e.g. list of municipalities, industry codes,
etc.) ￼ ￼ which can help translate codes into meaningful labels. When using the
API, one can query these reference datasets as well (for example, retrieving the
list of municipalities ￼ to map region codes to names).

Example: If building an npm library for visualizing this data, you might include
functions like getDataset(datasetId) to fetch a dataset by its ID, and
internally that function would hit the JSON URL. You could also incorporate
preset mappings (for common indicators like population, GDP, etc.) to make it
easier for users to select and visualize data without needing to know the
technical dataset IDs.

Conclusion

The Open Data API of Serbia’s Statistical Office is a rich source of
information, spanning from demographics and economic indicators to agriculture,
labor, accidents, and environmental data. Its structured categories and
machine-readable formats ￼ ￼ make it well-suited for developers building data
visualization tools. By leveraging this API in a JavaScript environment, one can
create impactful, interactive visualizations – for example, animated demographic
pyramids, dynamic economic dashboards, maps of agricultural or environmental
statistics – thereby making the data more accessible and meaningful to the
public. The combination of comprehensive data coverage and an accessible API
means that a visualization library can tap into up-to-date official statistics
and present them in compelling ways, ensuring that the insights are both
informative and engaging for users.

Sources: The information above is based on the SORS Open Data portal and
documentation, including the portal’s dataset listings ￼ ￼ and examples of
dataset entries (e.g. traffic accidents ￼, economic indicators ￼ ￼, agricultural
census data ￼, labor statistics ￼, and pollutant emissions ￼), as well as
integration details from the portal and Serbia’s open data catalog ￼ ￼. All
datasets are open for reuse with attribution to the Statistical Office of Serbia
￼ ￼, enabling their free incorporation into applications and analyses.
