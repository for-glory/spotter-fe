const activityReducer = (trainer: any) => {
  const filteredSearch = trainer?.activities.map((item: any) => {
    // "id" | "name" | "media" | "address" | "score"
    if (item.__typename === "Workout") {
      return {
        __typename: item.__typename,
        id: item?.id,
        name: item?.title,
        media: [{ pathUrl: item?.pathUrl }],
        type: item?.type?.name,
      };
    }
    if (item.__typename === "Facility") {
      return {
        __typename: item.__typename,
        id: item?.id,
        name: item?.name,
        media: item?.media,
        address: item?.address,
      };
    }
    if (item.__typename === "FacilityItem") {
      return {
        __typename: item.__typename,
        id: item?.id,
        name: item?.title,
        media: item?.facility?.media,
        address: item?.facility?.address,
        facility_id: item?.facility?.id,
        item_type: item?.item_type,
      };
    }
    if (item.__typename === "User") {
      return {
        __typename: item.__typename,
        id: item?.id,
        name: `${item?.first_name} ${item?.last_name}`,
        media: [{ pathUrl: item?.pathUrl }],
        address: item?.facilities[0]?.address,
      };
    }
  });
  return filteredSearch;
};

export default {
  activityReducer,
};
