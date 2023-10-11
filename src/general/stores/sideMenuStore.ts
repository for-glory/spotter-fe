import { defineStore } from "pinia";
import { ref } from "vue";
interface SideMenuOption {
  showImg: boolean;
  title: string;
}
export const useSideMenu = defineStore('sideMenu', () => {
  const options = ref<SideMenuOption>({
    showImg: true,
    title: "Invite Team Member"
  });
  const values = ref();

  const setOption = (data: SideMenuOption) => {
    options.value = data;
  }

  const setToDefault = () => {
    options.value = {
      showImg: true,
      title: "Invite Team Member"
    }
  }
  return {
    options,
    values,
    setOption,
    setToDefault
  }
});