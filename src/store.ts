import { createStore, useStore as baseUseStore, Store } from "vuex";
import { PersonalState } from "@/ts/types/authentification";
import { InjectionKey } from "vue";
import register from "@/trainers/stores/register";
import facility from "@/general/stores/facility";
import { FacilityState } from "./ts/types/facility";

export interface State {
  register: PersonalState;
  facility: FacilityState;
}

export const key: InjectionKey<Store<State>> = Symbol();

export default createStore<State>({
  modules: {
    register,
    facility,
  },
});

export const useStore = (): Store<State> => baseUseStore(key);
