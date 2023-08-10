import { RoleEnum } from "@/generated/graphql";
import useRoles from "./useRole";

export default function useFacilityId() {
  const { role: myRole } = useRoles();
  if (
    myRole !== RoleEnum.Manager &&
    myRole !== RoleEnum.FacilityOwner &&
    myRole !== RoleEnum.OrganizationOwner
  )
    return {};
  const { facilities, owned_facilities } = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  const facility =
    myRole === RoleEnum.Manager ? facilities[0] : owned_facilities[0];

  const {id: currentFacilityId} = JSON.parse(
    localStorage.getItem("currentFacility") || "{}"
  );

  return {
    id: facility?.id,
    facility: facility,
    currentFacilityId
  };
}
