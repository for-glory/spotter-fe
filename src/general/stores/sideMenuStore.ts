import { CreateManagerInput } from "@/generated/graphql";
import { defineStore } from "pinia";
import { ref } from "vue";
interface SideMenuOption {
  showImg: boolean;
  title: string;
  isEdit: boolean;
  managerData?: CreateManagerInput | null;
}
export const useSideMenu = defineStore('sideMenu', () => {
  const options = ref<SideMenuOption>({
    showImg: true,
    title: "Invite Team Member",
    isEdit: false,
  });
  const values = ref();

  const setOption = (data: SideMenuOption) => {
    options.value = data;
  }

  const setToDefault = () => {
    options.value = {
      showImg: true,
      title: "Invite Team Member",
      isEdit: false,
      managerData: null
    }
  }
  return {
    options,
    values,
    setOption,
    setToDefault
  }
});