/**
 * Created by InspireUI on 06/03/2017.
 *
 * @format
 */

import * as MagentoWorker from '../services/MagentoWorker'

const types = {
  PAYMENT_FETCH_SUCCESS: "PAYMENT_FETCH_SUCCESS",
  PAYMENT_FETCHING: "PAYMENT_FETCHING",
  PAYMENT_FETCH_FAILURE: "PAYMENT_FETCH_FAILURE",
};

export const actions = {
  fetchPayments: async (dispatch, address, shipping_carrier_code, shipping_method_code, quote_id, token) => {
    dispatch({ type: types.PAYMENT_FETCHING });
    MagentoWorker.getPayments(address, shipping_carrier_code, shipping_method_code, quote_id, token)
      .then((items) => {
        dispatch({
          type: types.PAYMENT_FETCH_SUCCESS,
          payload: items,
          finish: true,
        });
      })
      .catch((err) => {
        dispatch({ type: types.PAYMENT_FETCH_FAILURE, err });
      })
  },
};

const initialState = {
  list: [],
  isFetching: false,
};

export const reducer = (state = initialState, action) => {
  const { extra, type, payload, finish } = action;

  switch (type) {
    case types.PAYMENT_FETCH_SUCCESS:
      return {
        ...state,
        list: payload.filter((payment) => payment.enabled === true),
        isFetching: false,
        type
      };

    case types.PAYMENT_FETCH_FAILURE:
      return {
        ...state,
        finish: true,
        isFetching: false,
        type,
        message: action.err
      };

    case types.PAYMENT_FETCHING:
      return {
        ...state,
        isFetching: true,
        type,
        message: ""
      };

    default:
      return state;
  }
};
