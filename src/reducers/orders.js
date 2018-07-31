import createReducer, {RESET_STORE} from '../createReducer'
import qs from 'query-string'
import {getToken} from './user'
import {DEFAULT_PAGE_SIZE} from '../constants'
import moment from 'moment'
import has from 'lodash/has'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_ORDERS_REQUEST = 'Orders.GET_ORDERS_REQUEST'
export const GET_ORDERS_SUCCESS = 'Orders.GET_ORDERS_SUCCESS'
export const GET_ORDERS_FAILURE = 'Orders.GET_ORDERS_FAILURE'

export const GET_EVENTS_REQUEST = 'Orders.GET_EVENTS_REQUEST'
export const GET_EVENTS_SUCCESS = 'Orders.GET_EVENTS_SUCCESS'
export const GET_EVENTS_FAILURE = 'Orders.GET_EVENTS_FAILURE'

export const OPEN_CALENDAR_EVENTS_MODAL = 'Orders.OPEN_CALENDAR_EVENTS_MODAL'
export const CLOSE_CALENDAR_EVENTS_MODAL = 'Orders.CLOSE_CALENDAR_EVENTS_MODAL'

export const OPEN_ORDER_DETAILS_MODAL = 'Orders.OPEN_ORDER_DETAILS_MODAL'
export const CLOSE_ORDER_DETAILS_MODAL = 'Orders.CLOSE_ORDER_DETAILS_MODAL'

export const GET_ORDER_DETAILS_REQUEST = 'Orders.GET_ORDER_DETAILS_REQUEST'
export const GET_ORDER_DETAILS_SUCCESS = 'Orders.GET_ORDER_DETAILS_SUCCESS'
export const GET_ORDER_DETAILS_FAILURE = 'Orders.GET_ORDER_DETAILS_FAILURE'

export const CLEAR = 'Orders.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const getOrders = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_ORDERS_REQUEST, params})
  const {token} = dispatch(getToken())
  const {search, ordering, page, pageSize} = getState().orders
  return fetch(`/orders-history?${qs.stringify({
    search,
    ordering,
    page,
    per_page: pageSize,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_ORDERS_SUCCESS, res}),
    failure: () => dispatch({type: GET_ORDERS_FAILURE}),
  })
}

export const getEvents = (date) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_EVENTS_REQUEST, date: date.format()})
  const {token} = dispatch(getToken())
  return fetch(`/contact-reminders?${qs.stringify({
    month: date.format('MM'),
    year: date.format('YYYY'),
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_EVENTS_SUCCESS, events: res.data}),
    failure: () => dispatch({type: GET_EVENTS_FAILURE}),
  })
}

export const openCalendarEventsModal = (selectedDate) => ({type: OPEN_CALENDAR_EVENTS_MODAL, selectedDate})

export const closeCalendarEventsModal = () => ({type: CLOSE_CALENDAR_EVENTS_MODAL})

export const openOrderDetailsModal = (order) => (dispatch, getState) => {
  dispatch({type: OPEN_ORDER_DETAILS_MODAL})
  dispatch(getOrderDetails(order))
}

export const closeOrderDetailsModal = () => ({type: CLOSE_ORDER_DETAILS_MODAL})

export const getOrderDetails = (order) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_ORDER_DETAILS_REQUEST})
  return fetch(`/order-confirmation?${qs.stringify({
    order_id: order.id,
  })}`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_ORDER_DETAILS_SUCCESS, orderDetails: res.data})
    },
    failure: () => {
      dispatch({type: GET_ORDER_DETAILS_FAILURE})
    },
  })
}

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: {
    orders: false,
    events: false,
    orderDetails: false,
  },
  orders: [],
  ordersCount: 0,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: undefined,
  events: [],
  date: moment().format(),
  calendarEventsModalOpened: false,
  selectedDate: null,
  orderDetailsModalOpened: false,
  orderDetails: null,
}

export default createReducer(initialState, {
  [GET_ORDERS_REQUEST]: (state, {params}) => ({
    search: has(params, 'search') ? params.search : state.search,
    page: params.pagination ? params.pagination.current : 1,
    pageSize: params.pagination ? params.pagination.pageSize : DEFAULT_PAGE_SIZE,
    loading: {
      ...state.loading,
      orders: true,
    },
  }),
  [GET_ORDERS_SUCCESS]: (state, {res: {data, meta: {total}}}) => ({
    orders: data,
    ordersCount: total,
    loading: {
      ...state.loading,
      orders: false,
    },
  }),
  [GET_ORDERS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      orders: false,
    },
  }),
  [GET_EVENTS_REQUEST]: (state, {date}) => ({
    date,
    loading: {
      ...state.loading,
      events: true,
    },
  }),
  [GET_EVENTS_SUCCESS]: (state, {events}) => ({
    events,
    loading: {
      ...state.loading,
      events: false,
    },
  }),
  [GET_EVENTS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      events: false,
    },
  }),
  [OPEN_CALENDAR_EVENTS_MODAL]: (state, {selectedDate}) => ({
    calendarEventsModalOpened: true,
    selectedDate,
  }),
  [CLOSE_CALENDAR_EVENTS_MODAL]: (state, action) => ({
    calendarEventsModalOpened: false,
    selectedDate: null,
  }),
  [OPEN_ORDER_DETAILS_MODAL]: (state, action) => ({
    orderDetailsModalOpened: true,
  }),
  [CLOSE_ORDER_DETAILS_MODAL]: (state, action) => ({
    orderDetailsModalOpened: false,
    orderDetails: null,
  }),
  [GET_ORDER_DETAILS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      orderDetails: true,
    },
  }),
  [GET_ORDER_DETAILS_SUCCESS]: (state, {orderDetails}) => ({
    orderDetails,
    loading: {
      ...state.loading,
      orderDetails: false,
    },
  }),
  [GET_ORDER_DETAILS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      orderDetails: false,
    },
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
