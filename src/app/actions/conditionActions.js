export const conditionActionTypes = {
  SET_ABSTRACT_GROUP: 'SET_ABSTRACT_GROUP',
  SET_ABSTRACT_ORDER: 'SET_ABSTRACT_ORDER',
};

export function setAbstractGroup(group) {
  return {
    type: conditionActionTypes.SET_ABSTRACT_GROUP,
    payload: {
      group
    }
  }
}

export function setAbstractOrder(order) {
  return {
    type: conditionActionTypes.SET_ABSTRACT_ORDER,
    payload: {
      order
    }
  }
}