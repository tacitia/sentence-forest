import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants/Enumerations';
import Cookies from 'js-cookie';

export const abstractActionTypes = {
  SET_ABSTRACTS: 'SET_ABSTRACTS',
  SET_ABSTRACT_GROUP: 'SET_ABSTRACT_GROUP',
  SET_ABSTRACT_ORDER: 'SET_ABSTRACT_ORDER',
};

export function setAbstracts(abstracts) {
  return {
    type: abstractActionTypes.SET_ABSTRACTS,
    payload: {
      abstracts
    }
  }
}

export function setAbstractGroup(group) {
  return {
    type: abstractActionTypes.SET_ABSTRACT_GROUP,
    payload: {
      group
    }
  }
}

export function setAbstractOrder(order) {
  return {
    type: abstractActionTypes.SET_ABSTRACT_ORDER,
    payload: {
      order
    }
  }
}