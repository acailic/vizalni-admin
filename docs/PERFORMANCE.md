# Identified Bottlenecks

#### Why we need to load all values upfront when initializing chart from cube?

It's needed in order to be able to correctly select initial filter value – so
e.g. it's Zurich that's selected, instead of Aargau.

**Context**  
During performance improvements work, an idea emerged to not load dimension
values when initializing chart from cube. As we need to fetch them to correctly
initialize filters, a trial was done to only fetch one value; but then the
results were not right, as without sorting, the order was messed up.

# Optimization Ideas

- [ ] Separate SPARQL editor url and observations fetching
  - Currently we double-fetch the data when downloading CSV or XLSX in
    `ChartFootnotes` component (hook to get url + directly inside
    `DataDownloadMenu` component)

# Implemented Optimizations

_To be documented as optimizations are implemented._

# Performance Metrics

_To be documented with relevant metrics and benchmarks._
