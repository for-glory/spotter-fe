import { DocumentNode } from "graphql/language";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, watch } from "vue";
import { MapMarkerItem } from "@/ts/types/map";

export const useMapPage = <QueryType, EntityType>(
  document: DocumentNode,
  locationsCallback: (entity: EntityType) => MapMarkerItem,
  getDataFromResult: (
    apiResponse: ReturnType<typeof useQuery<QueryType>>["result"]
  ) => EntityType[],
  params?: Record<string, unknown>
) => {
  const pagesParams = {
    first: 100,
    page: 0,
  };

  const markerItems = ref<MapMarkerItem[]>([]);
  const {
    result,
    loading,
    error,
    refetch: refetchItems,
  } = useQuery<QueryType>(document, {
    ...pagesParams,
    ...params,
  });
  const formattedResult = computed(() => {
    return getDataFromResult(result) || [];
  });

  const getLocations = () =>
    formattedResult.value?.map((entity) => locationsCallback(entity)) || [];

  const refetch = (params?: Record<string, unknown>) => {
    refetchItems({
      ...pagesParams,
      ...params,
    });
  };

  watch(
    () => result.value,
    () => {
      markerItems.value = getLocations();
    }
  );

  return { result, loading, error, formattedResult, markerItems, refetch };
};
