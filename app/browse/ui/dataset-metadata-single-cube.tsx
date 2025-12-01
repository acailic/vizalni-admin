import { DatasetMetadata } from "@/components/dataset-metadata";
import { useLocale } from "@/locales/use-locale";

type DataSource = {
  type: "sql" | "sparql";
  url: string;
};

// Use CommonJS require to avoid TS resolution issues with generated query hooks
const useDataCubeMetadataQuery: any = require("@/graphql/query-hooks").useDataCubeMetadataQuery;

export const DatasetMetadataSingleCube = ({
  dataSource,
  datasetIri,
}: {
  dataSource: DataSource;
  datasetIri: string;
}) => {
  const locale = useLocale();
  const [data] = useDataCubeMetadataQuery({
    variables: {
      cubeFilter: { iri: datasetIri },
      locale: locale,
      sourceType: dataSource.type,
      sourceUrl: dataSource.url,
    },
  });

  if (!data.data) {
    return null;
  }

  return (
    <DatasetMetadata
      cube={data.data.dataCubeMetadata}
      showTitle={false}
      dataSource={dataSource}
    />
  );
};
