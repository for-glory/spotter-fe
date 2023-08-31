import { Middleware } from "@/ts/types/router";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";
import {
  RoleEnum,
} from "@/generated/graphql";

const { role } = useRoles();

const gymOwnerRole: Middleware = async ({ next, router }) => {
  if (role === RoleEnum.Manager) {
    router.push({ name: EntitiesEnum.DashboardOverview });
  }

  return next();
};

export default gymOwnerRole;
