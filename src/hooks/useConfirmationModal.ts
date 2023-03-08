import { ref } from "vue";

export const useConfirmationModal = () => {
  const showConfirmationModal = ref(false);

  const hideModal = () => {
    showConfirmationModal.value = false;
  };

  const showModal = () => {
    showConfirmationModal.value = true;
  };

  return {
    showConfirmationModal,
    hideModal,
    showModal,
  };
};
