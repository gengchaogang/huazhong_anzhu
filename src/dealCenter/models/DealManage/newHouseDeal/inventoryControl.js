export default {
  namespace: 'inventoryControl',
  state: {
    inventoryControlModal:false,
  },
  reducers: {
    doCollapse(state) {
      return {...state,inventoryControlModal:!state.inventoryControlModal};
    },
    handleOk(state) {
      return {...state,inventoryControlModal:false};
    },
    handleCancel(state) {
      return {...state,inventoryControlModal:false};
    },
  },
}
