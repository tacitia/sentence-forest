import fetch from 'isomorphic-fetch';

import { API_URL } from '../constants/Enumerations';
import Cookies from 'js-cookie';

export const metaActionTypes = {
  SET_STUDY_ID: 'SET_STUDY_ID',
  SET_USER_ID: 'SET_USER_ID'
};

export function setStudyId(studyId) {
  return {
    type: metaActionTypes.SET_STUDY_ID,
    payload: {
      studyId
    }
  };
}

export function setUserId(userId) {
  return {
    type: metaActionTypes.SET_USER_ID,
    payload: {
      userId
    }
  };
}

export function fetchCSRFToken(state) {
  return dispatch => {
    return fetch(`http://${API_URL}/action/`, {   
      "X-CSRF-Token":"Fetch"   
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('CSRF Token fetched.')
    });
  }
}

export function postAction(target, value, description) {
  return (dispatch, getState) => {
    return fetch(`http://${API_URL}/action/`, {
        method: 'post',
        body: JSON.stringify({
          studyId: getState().metaReducer.studyId,
          userId: getState().metaReducer.userId,
          target,
          value,
          description
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log('action posted');
        console.log(json);
      });   
  }
}

export function postResponse(taskId, value) {
  return (dispatch, getState) => {
    return fetch(`http://${API_URL}/response/`, {
        method: 'post',
        body: JSON.stringify({
          studyId: getState().metaReducer.studyId,
          userId: getState().metaReducer.userId,
          taskId,
          value,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken')
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log('response posted');
      });   
  }
}