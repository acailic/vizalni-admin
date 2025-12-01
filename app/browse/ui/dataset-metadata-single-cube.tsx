import { DatasetMetadata } from "@/components/dataset-metadata";
import * as QueryHooks from "@/graphql/query-hooks";
import { useLocale } from "@/locales/use-locale";

// Temporary type definition to work around import issue
type DataSource = {
  type: "sql" | "sparql";
  url: string;
};

export const DatasetMetadataSingleCube = ({
  dataSource,
  datasetIri,
}: {
  dataSource: DataSource;
  datasetIri: string;
}) => {
  const locale = useLocale();
  const [data] = QueryHooks.useDataCubeMetadataQuery({
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
