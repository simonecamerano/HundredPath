import { reactive } from 'vue';

const state = reactive({
  isOpen: false,
  message: '',
  onConfirm: null,
  onCancel: null
});

export function useConfirm() {
  const confirm = (message) => {
    return new Promise((resolve) => {
      state.message = message;
      state.isOpen = true;
      state.onConfirm = () => {
        state.isOpen = false;
        resolve(true);
      };
      state.onCancel = () => {
        state.isOpen = false;
        resolve(false);
      };
    });
  };
  
  return {
    state,
    confirm
  };
}
