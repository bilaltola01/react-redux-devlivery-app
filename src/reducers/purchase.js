import createReducer, {RESET_STORE} from '../createReducer'
import {loginSuccess} from './login'
import {message} from 'antd'
import {
  DONATION_ROUTE,
  EDIT_BUNDLE_FLOW,
  ORDER_BUNDLE_FLOW,
  PURCHASE8_ROUTE,
  PURCHASE_FLOW,
  VOUCHER_ROUTE,
} from '../routes'
import {generateUrl} from '../router'
import qs from 'query-string'
import {getToken} from './user'
import {CARD_SIZES, DATE_FORMAT, DEFAULT_OCCASION_TYPE, DONATION_TYPE, VOUCHER_TYPE} from '../constants'
import has from 'lodash/has'
import {getFormErrors} from '../utils'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import uniq from 'lodash/uniq'

// ------------------------------------
// Constants
// ------------------------------------
export const HANDWRITTEN = 'handwritten'
export const PRINTED = 'printed'

export const ADD_CONTACT_MANUALLY = 'add-contacts-manually'
export const IMPORT_CONTACTS = 'import-contacts'

export const PAYPAL = 'PAYPAL'
export const CREDIT_CARD = 'CREDIT_CARD'
export const BITPAY = 'BITPAY'

export const SET_BUNDLE = 'Purchase.SET_BUNDLE'
export const SET_FLOW = 'Purchase.SET_FLOW'
export const SET_FLOW_INDEX = 'Purchase.SET_FLOW_INDEX'
export const SET_OCCASION = 'Purchase.SET_OCCASION'
export const SET_LETTERING_TECHNIQUE = 'Purchase.SET_LETTERING_TECHNIQUE'
export const SET_CARD_STYLE = 'Purchase.SET_CARD_STYLE'
export const SET_CARD_SIZE = 'Purchase.SET_CARD_SIZE'
export const SET_CARD = 'Purchase.SET_CARD'
export const SET_CARD_DETAILS = 'Purchase.SET_CARD_DETAILS'
export const SET_GIFT_TYPE = 'Purchase.SET_GIFT_TYPE'
export const CONTINUE_WITHOUT_GIFT = 'Purchase.CONTINUE_WITHOUT_GIFT'
export const SET_GIFT = 'Purchase.SET_GIFT'
export const SET_PAYMENT_METHOD = 'Purchase.SET_PAYMENT_METHOD'

export const GET_OCCASIONS_REQUEST = 'Purchase.GET_OCCASIONS_REQUEST'
export const GET_OCCASIONS_SUCCESS = 'Purchase.GET_OCCASIONS_SUCCESS'
export const GET_OCCASIONS_FAILURE = 'Purchase.GET_OCCASIONS_FAILURE'

export const GET_OCCASION_TYPES_REQUEST = 'Purchase.GET_OCCASION_TYPES_REQUEST'
export const GET_OCCASION_TYPES_SUCCESS = 'Purchase.GET_OCCASION_TYPES_SUCCESS'
export const GET_OCCASION_TYPES_FAILURE = 'Purchase.GET_OCCASION_TYPES_FAILURE'

export const GET_CARD_STYLES_REQUEST = 'Purchase.GET_CARD_STYLES_REQUEST'
export const GET_CARD_STYLES_SUCCESS = 'Purchase.GET_CARD_STYLES_SUCCESS'
export const GET_CARD_STYLES_FAILURE = 'Purchase.GET_CARD_STYLES_FAILURE'

export const GET_CARDS_REQUEST = 'Purchase.GET_CARDS_REQUEST'
export const GET_CARDS_SUCCESS = 'Purchase.GET_CARDS_SUCCESS'
export const GET_CARDS_FAILURE = 'Purchase.GET_CARDS_FAILURE'

export const GET_GIFTS_REQUEST = 'Purchase.GET_GIFTS_REQUEST'
export const GET_GIFTS_SUCCESS = 'Purchase.GET_GIFTS_SUCCESS'
export const GET_GIFTS_FAILURE = 'Purchase.GET_GIFTS_FAILURE'

export const REGISTER_REQUEST = 'Purchase.REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'Purchase.REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'Purchase.REGISTER_FAILURE'

export const ADD_BUNDLE_REQUEST = 'Purchase.ADD_BUNDLE_REQUEST'
export const ADD_BUNDLE_SUCCESS = 'Purchase.ADD_BUNDLE_SUCCESS'
export const ADD_BUNDLE_FAILURE = 'Purchase.ADD_BUNDLE_FAILURE'

export const MAKE_ORDER_REQUEST = 'Purchase.MAKE_ORDER_REQUEST'
export const MAKE_ORDER_SUCCESS = 'Purchase.MAKE_ORDER_SUCCESS'
export const MAKE_ORDER_FAILURE = 'Purchase.MAKE_ORDER_FAILURE'

export const MAKE_STRIPE_PAYMENT_REQUEST = 'Purchase.MAKE_STRIPE_PAYMENT_REQUEST'
export const MAKE_STRIPE_PAYMENT_SUCCESS = 'Purchase.MAKE_STRIPE_PAYMENT_SUCCESS'
export const MAKE_STRIPE_PAYMENT_FAILURE = 'Purchase.MAKE_STRIPE_PAYMENT_FAILURE'

export const MAKE_PAYPAL_PAYMENT_REQUEST = 'Purchase.MAKE_PAYPAL_PAYMENT_REQUEST'
export const MAKE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.MAKE_PAYPAL_PAYMENT_SUCCESS'
export const MAKE_PAYPAL_PAYMENT_FAILURE = 'Purchase.MAKE_PAYPAL_PAYMENT_FAILURE'

export const EXECUTE_PAYPAL_PAYMENT_REQUEST = 'Purchase.EXECUTE_PAYPAL_PAYMENT_REQUEST'
export const EXECUTE_PAYPAL_PAYMENT_SUCCESS = 'Purchase.EXECUTE_PAYPAL_PAYMENT_SUCCESS'
export const EXECUTE_PAYPAL_PAYMENT_FAILURE = 'Purchase.EXECUTE_PAYPAL_PAYMENT_FAILURE'

export const CANCEL_PAYPAL_PAYMENT_REQUEST = 'Purchase.CANCEL_PAYPAL_PAYMENT_REQUEST'
export const CANCEL_PAYPAL_PAYMENT_SUCCESS = 'Purchase.CANCEL_PAYPAL_PAYMENT_SUCCESS'
export const CANCEL_PAYPAL_PAYMENT_FAILURE = 'Purchase.CANCEL_PAYPAL_PAYMENT_FAILURE'

export const MAKE_BITPAY_PAYMENT_REQUEST = 'Purchase.MAKE_BITPAY_PAYMENT_REQUEST'
export const MAKE_BITPAY_PAYMENT_SUCCESS = 'Purchase.MAKE_BITPAY_PAYMENT_SUCCESS'
export const MAKE_BITPAY_PAYMENT_FAILURE = 'Purchase.MAKE_BITPAY_PAYMENT_FAILURE'

export const GET_DONATION_ORGS_REQUEST = 'Purchase.GET_DONATION_ORGS_REQUEST'
export const GET_DONATION_ORGS_SUCCESS = 'Purchase.GET_DONATION_ORGS_SUCCESS'
export const GET_DONATION_ORGS_FAILURE = 'Purchase.GET_DONATION_ORGS_FAILURE'

export const SET_DONATION_ORG = 'Purchase.SET_DONATION_ORG'
export const SUBMIT_DONATION = 'Purchase.SUBMIT_DONATION'

export const CONFIRM_DONATION_REQUEST = 'Purchase.CONFIRM_DONATION_REQUEST'
export const CONFIRM_DONATION_SUCCESS = 'Purchase.CONFIRM_DONATION_SUCCESS'
export const CONFIRM_DONATION_FAILURE = 'Purchase.CONFIRM_DONATION_FAILURE'

export const GET_CARD_COLORS_REQUEST = 'Purchase.GET_CARD_COLORS_REQUEST'
export const GET_CARD_COLORS_SUCCESS = 'Purchase.GET_CARD_COLORS_SUCCESS'
export const GET_CARD_COLORS_FAILURE = 'Purchase.GET_CARD_COLORS_FAILURE'

export const ADD_CARD_BODY_REQUEST = 'Purchase.ADD_CARD_BODY_REQUEST'
export const ADD_CARD_BODY_SUCCESS = 'Purchase.ADD_CARD_BODY_SUCCESS'
export const ADD_CARD_BODY_FAILURE = 'Purchase.ADD_CARD_BODY_FAILURE'

export const SUBMIT_VOUCHER = 'Purchase.SUBMIT_VOUCHER'

export const CONFIRM_VOUCHER_REQUEST = 'Purchase.CONFIRM_VOUCHER_REQUEST'
export const CONFIRM_VOUCHER_SUCCESS = 'Purchase.CONFIRM_VOUCHER_SUCCESS'
export const CONFIRM_VOUCHER_FAILURE = 'Purchase.CONFIRM_VOUCHER_FAILURE'

export const GET_DELIVERY_LOCATIONS_REQUEST = 'Purchase.GET_DELIVERY_LOCATIONS_REQUEST'
export const GET_DELIVERY_LOCATIONS_SUCCESS = 'Purchase.GET_DELIVERY_LOCATIONS_SUCCESS'
export const GET_DELIVERY_LOCATIONS_FAILURE = 'Purchase.GET_DELIVERY_LOCATIONS_FAILURE'

export const SUBMIT_SHIPPING_REQUEST = 'Purchase.SUBMIT_SHIPPING_REQUEST'
export const SUBMIT_SHIPPING_SUCCESS = 'Purchase.SUBMIT_SHIPPING_SUCCESS'
export const SUBMIT_SHIPPING_FAILURE = 'Purchase.SUBMIT_SHIPPING_FAILURE'

export const GET_RECIPIENTS_REQUEST = 'Purchase.GET_RECIPIENTS_REQUEST'
export const GET_RECIPIENTS_SUCCESS = 'Purchase.GET_RECIPIENTS_SUCCESS'
export const GET_RECIPIENTS_FAILURE = 'Purchase.GET_RECIPIENTS_FAILURE'

export const GET_TEMPLATE_REQUEST = 'Purchase.GET_TEMPLATE_REQUEST'
export const GET_TEMPLATE_SUCCESS = 'Purchase.GET_TEMPLATE_SUCCESS'
export const GET_TEMPLATE_FAILURE = 'Purchase.GET_TEMPLATE_FAILURE'

export const ADD_RECIPIENTS_REQUEST = 'Purchase.ADD_RECIPIENTS_REQUEST'
export const ADD_RECIPIENTS_SUCCESS = 'Purchase.ADD_RECIPIENTS_SUCCESS'
export const ADD_RECIPIENTS_FAILURE = 'Purchase.ADD_RECIPIENTS_FAILURE'

export const GET_ORDER_DETAILS_REQUEST = 'Purchase.GET_ORDER_DETAILS_REQUEST'
export const GET_ORDER_DETAILS_SUCCESS = 'Purchase.GET_ORDER_DETAILS_SUCCESS'
export const GET_ORDER_DETAILS_FAILURE = 'Purchase.GET_ORDER_DETAILS_FAILURE'

export const GET_BUNDLE_DETAILS_REQUEST = 'Purchase.GET_BUNDLE_DETAILS_REQUEST'
export const GET_BUNDLE_DETAILS_SUCCESS = 'Purchase.GET_BUNDLE_DETAILS_SUCCESS'
export const GET_BUNDLE_DETAILS_FAILURE = 'Purchase.GET_BUNDLE_DETAILS_FAILURE'

export const SET_FONT_FAMILIES = 'Purchase.SET_FONT_FAMILIES'

export const CLEAR = 'Purchase.CLEAR'

// ------------------------------------
// Actions
// ------------------------------------
export const setFlow = (flow, redirect = true) => (dispatch, getState, {history}) => {
  if (redirect && flow.key != ORDER_BUNDLE_FLOW.key) {
    dispatch(clear())
  }
  
  dispatch({type: SET_FLOW, flow})
  if (redirect) {
    // TODO decide if flow key should be in url to fix issue when user goes back to purchase flow
    // TODO or replace history after finishing flow to prevent this situation
    history.push(generateUrl(flow.routes[0]))
  }
}

export const setBundle = (bundle) => (dispatch, getState) => {
  dispatch({
    type: SET_BUNDLE,
    bundle,
    letteringTechnique: bundle.lettering,
    card: bundle.bundle_card.card,
    gift: bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift,
    giftType: bundle.bundle_gifts[0] && bundle.bundle_gifts[0].gift.type,
    cardSize: CARD_SIZES().find(item => item.key === bundle.bundle_card.card.size),
    cardStyle: bundle.bundle_card.card.style,
  })
  dispatch(setFlow(ORDER_BUNDLE_FLOW))
}

export const setFlowIndex = () => (dispatch, getState) => {
  const {currentRouteName} = getState().global
  const {flow} = getState().purchase
  const flowIndex = flow.routes.findIndex(item => item === currentRouteName)
  dispatch({type: SET_FLOW_INDEX, flowIndex})
}

// 'step' allows to skip number of steps
export const nextFlowStep = (step = 0) => (dispatch, getState, {history}) => {
  const {flow, flowIndex} = getState().purchase
  history.push(generateUrl(flow.routes[flowIndex + 1 + step]))
  // if step is last (except Thank You page/etc)
  if (flowIndex === flow.routes.length - 2) {
    dispatch(clear())
  }
}

export const setOccasion = (occasion) => ({type: SET_OCCASION, occasion})

export const getOccasions = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASIONS_REQUEST, params})
  const {occasionType} = getState().purchase
  return fetch(`/occasions?${qs.stringify({
    take: 100,
    ...occasionType ? {
      filter_key: 'type',
      filter_value: occasionType,
    } : {},
  })}`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_OCCASIONS_SUCCESS, occasions: res.data})
    },
    failure: () => {
      dispatch({type: GET_OCCASIONS_FAILURE})
    }
  })
}

export const getOccasionTypes = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_OCCASION_TYPES_REQUEST})
  return fetch(`/occasion-types`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_OCCASION_TYPES_SUCCESS, occasionTypes: res.data}),
    failure: () => {
      dispatch({type: GET_OCCASION_TYPES_FAILURE})
    }
  })
}

export const setLetteringTechnique = (letteringTechnique) => ({type: SET_LETTERING_TECHNIQUE, letteringTechnique})

export const getCardStyles = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARD_STYLES_REQUEST})
  return fetch(`/card-styles`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARD_STYLES_SUCCESS, cardStyles: res.data}),
    failure: () => dispatch({type: GET_CARD_STYLES_FAILURE})
  })
}

export const getMessageTemplate = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_TEMPLATE_REQUEST})
  return fetch(`/message-templates`, {
    method: 'GET',
    token,
    success: (templates) => dispatch({type: GET_TEMPLATE_SUCCESS, templates}),
    failure: () => dispatch({type: GET_TEMPLATE_FAILURE})
  })
}

export const getRecipients = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_RECIPIENTS_REQUEST})
  return fetch(`/view-contacts`, {
    method: 'GET',
    token,
    success: (recipients) => dispatch({type: GET_RECIPIENTS_SUCCESS, recipients}),
    failure: () => dispatch({type: GET_RECIPIENTS_FAILURE})
  })
}

export const addRecipientsOrder = (orderId) => (dispatch, getState, {fetch}) => {
  dispatch({type: ADD_RECIPIENTS_REQUEST})
  const {token} = dispatch(getToken())
  const {newContact} = getState().contacts
  if (!newContact) {
    return
  }
  return fetch(`/order-recipients`, {
    method: 'POST',
    contentType: 'multipart/form-data',
    token,
    body: {
      order_id: orderId,
      contact_id: newContact.id,
    },
    success: () => dispatch({type: ADD_RECIPIENTS_SUCCESS}),
    failure: () => dispatch({type: ADD_RECIPIENTS_FAILURE})
  })
}

export const setCardStyle = (cardStyle) => ({type: SET_CARD_STYLE, cardStyle})

export const getCards = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARDS_REQUEST, params})
  const {occasion, cardStyle, cardColor} = getState().purchase
  return fetch(`/cards?${qs.stringify({
    take: 100,
    filters: JSON.stringify({
      ...occasion ? {
        occasion_id: occasion.id,
      } : {},
      ...cardColor ? {
        color: cardColor,
      } : {},
      ...cardStyle ? {
        style: cardStyle,
      } : {},
    })
  })}`, {
    method: 'GET',
    success: (res) => dispatch({type: GET_CARDS_SUCCESS, cards: res.data}),
    failure: () => dispatch({type: GET_CARDS_FAILURE})
  })
}

export const setCardSize = (cardSize) => ({type: SET_CARD_SIZE, cardSize})

export const submitCardDetails = (cardDetails) => (dispatch, getState) => {
  dispatch(nextFlowStep())
  dispatch({type: SET_CARD_DETAILS, cardDetails})
}

export const setGiftType = (giftType) => ({type: SET_GIFT_TYPE, giftType})

export const setCard = (card) => ({type: SET_CARD, card})

export const setGift = (gift) => ({type: SET_GIFT, gift})

export const getGifts = (params = {}) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_GIFTS_REQUEST, params})
  const {giftType} = getState().purchase
  return fetch(`/gifts?${qs.stringify({
    take: 100,
    ...giftType ? {
      filter_key: 'type',
      filter_value: giftType,
    } : {},
  })}`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_GIFTS_SUCCESS, gifts: res.data})
    },
    failure: () => {
      dispatch({type: GET_GIFTS_FAILURE})
    }
  })
}

export const submitShipping = (values) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: SUBMIT_SHIPPING_REQUEST, values})
  const {orderId, deliveryLocation, deliveryTime} = getState().purchase
  return fetch(`/set-wheretosend`, {
    method: 'POST',
    body: {
      order_id: orderId,
      deliverable: deliveryLocation,
      schedule_date: deliveryTime,
    },
    token,
    success: (res) => {
      dispatch({type: SUBMIT_SHIPPING_SUCCESS})
      dispatch(nextFlowStep())
    },
    failure: (err) => {
      if(err.errors && err.errors[0])
        message.error(err.errors[0]);
      dispatch({type: SUBMIT_SHIPPING_FAILURE})
    },
  })
}

export const setPaymentMethod = (paymentMethod) => ({type: SET_PAYMENT_METHOD, paymentMethod})

export const register = (values, form) => (dispatch, getState, {fetch}) => {
  dispatch({type: REGISTER_REQUEST})
  return fetch(`/signup`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: values,
    success: (res) => {
      dispatch({type: REGISTER_SUCCESS})
      dispatch(loginSuccess(res.data))
      dispatch(nextFlowStep())
    },
    failure: (res) => {
      const {formErrors} = getFormErrors({...res, values})
      if (formErrors)
        form.setFields(formErrors)
      else
      // TODO
        message.error('Something went wrong. Please try again.')
      dispatch({type: REGISTER_FAILURE})
    },
  })
}

export const continueWithoutGift = () => async (dispatch, getState) => {
  const {loggedIn} = getState().user
  const {flow} = getState().purchase
  dispatch(setGiftType(null))
  if (loggedIn && flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch(addBundle())
  }
  dispatch(nextFlowStep(1))
}

export const submitGift = () => async (dispatch, getState) => {
  const {flow} = getState().purchase
  if (flow.key !== EDIT_BUNDLE_FLOW.key) {
    await dispatch(addBundle())
  }
  dispatch(nextFlowStep())
}

export const addBundle = (values = {}, goToNext = true) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {letteringTechnique, card, gift, flow, cardDetails} = getState().purchase
  dispatch({type: ADD_BUNDLE_REQUEST})
  return fetch(`/create-bundle`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      lettering: letteringTechnique,
      card_id: card && card.id,
      ...gift ? {
        gift_id: gift.id,
      } : {},
      // TODO check if we need to send card body here
      body: cardDetails && cardDetails.body,
      // TODO backend can't get undefined value for title
      ...pickBy(values, identity)
    },
    token,
    success: (res) => {
      dispatch({type: ADD_BUNDLE_SUCCESS, bundle: res.data})
      if (flow.key === EDIT_BUNDLE_FLOW.key) {
        if (goToNext) {
          dispatch(nextFlowStep())
        }
        message.success('Bundle created.')
      }
    },
    failure: () => {
      dispatch({type: ADD_BUNDLE_FAILURE})
    },
  })
}

export const makeOrder = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {bundleId, orderId} = getState().purchase
  if (orderId) {
    dispatch(getBundleDetails(bundleId))
    dispatch(getOrderDetails(orderId))
    dispatch(getDeliveryLocations(orderId))
  } else {
    if(bundleId === null)
    {
      message.error('Bundle is incorrect.');
      return;
    }
    dispatch({type: MAKE_ORDER_REQUEST})
      return fetch(`/make-order-from-bundle`, {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        body: {
          bundle_id: parseInt(bundleId),
        },
        token,
        success: (res) => {
          const order = res.data
          dispatch({type: MAKE_ORDER_SUCCESS, order})
          dispatch(addCardBody(order.id))
          dispatch(getDeliveryLocations(order.id))
          dispatch(addRecipientsOrder(order.id))
        },
        failure: () => {
          dispatch({type: MAKE_ORDER_FAILURE})
        },
      })
  }
}

export const addCardBody = (orderId) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {cardDetails} = getState().purchase
  dispatch({type: ADD_CARD_BODY_REQUEST})
  return fetch(`/order/add-htmls`, {
    method: 'POST',
    body: {
      order_id: orderId,
      html1: cardDetails.body,
    },
    token,
    success: () => dispatch({type: ADD_CARD_BODY_SUCCESS}),
    failure: () => dispatch({type: ADD_CARD_BODY_FAILURE}),
  })
}

export const makeStripePayment = (card) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {orderId} = getState().purchase
  if (!orderId) {
    return
  }
  dispatch({type: MAKE_STRIPE_PAYMENT_REQUEST})
  const {
    number,
    expiry_month,
    expiry_year,
    cvc,
  } = card
  const {stripeApiKey} = getState().global
  return fetch('https://api.stripe.com/v1/tokens', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {
      Authorization: `Bearer ${stripeApiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      'card[number]': number,
      'card[exp_month]': expiry_month,
      'card[exp_year]': expiry_year,
      'card[cvc]': cvc,
    },
    token,
    success: (stripeToken) => {
      return fetch(`/payments/stripe/charge/${orderId}`, {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        body: {
          stripeToken: stripeToken.id,
        },
        token,
        success: () => {
          dispatch(nextFlowStep())
          dispatch({type: MAKE_STRIPE_PAYMENT_SUCCESS})
        },
        failure: () => {
          dispatch({type: MAKE_STRIPE_PAYMENT_FAILURE})
        },
      })
    },
    failure: (error) => {
      dispatch({ type: MAKE_STRIPE_PAYMENT_FAILURE })
      if (error && error.error && error.error.message) {
        message.error(error.error.message)
      }
    }
  })
}

const TRANSACTION_ID_KEY = 'transaction_id'
const ORDER_ID_KEY = 'order_id'

export const makePaypalPayment = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {orderId} = getState().purchase
  if (!orderId) {
    return
  }

  dispatch({type: MAKE_PAYPAL_PAYMENT_REQUEST})
  return fetch(`/payments/paypal/charge/${orderId}`, {
    method: 'POST',
    token,
    success: (res) => {
      const {approval_url, transaction_id} = res.data
      localStorage.setItem(ORDER_ID_KEY, orderId)
      localStorage.setItem(TRANSACTION_ID_KEY, transaction_id)
      window.location = approval_url
      dispatch({type: MAKE_PAYPAL_PAYMENT_SUCCESS})
    },
    failure: (error) => {
      dispatch({type: MAKE_PAYPAL_PAYMENT_FAILURE})
      if (error && error.error && error.error.message) {
        message.error(error.error.message)
      }
    },
  })
}

const returnToPaymentMethod = (keepOrder) => (dispatch, getState, {history}) => {
  const orderId = localStorage.getItem(ORDER_ID_KEY)
  dispatch({ type: MAKE_ORDER_SUCCESS, order: { id: orderId } })
  if (!keepOrder) {
    localStorage.removeItem(ORDER_ID_KEY)
  }
  localStorage.removeItem(TRANSACTION_ID_KEY)
  // let user choose another payment method or try again
  history.push('/purchase/payment-method')
}

export const executePaypalPayment = ({paymentId, paypalToken, payerId}) => (dispatch, getState, {fetch, history}) => {
  const {token} = dispatch(getToken())
  const transactionId = localStorage.getItem(TRANSACTION_ID_KEY)
  if (!transactionId) {
    return
  }
  dispatch({type: EXECUTE_PAYPAL_PAYMENT_REQUEST})
  return fetch('/payments/paypal/execute', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      transaction_id: transactionId,
      token: paymentId,
      paymentId,
      payerId,
    },
    token,
    success: (res) => {
      localStorage.removeItem(TRANSACTION_ID_KEY)
      localStorage.removeItem(ORDER_ID_KEY)
      history.push('/purchase/completed')
      dispatch({type: EXECUTE_PAYPAL_PAYMENT_SUCCESS})
    },
    failure: () => {
      // payment failed, let user choose another one
      dispatch(returnToPaymentMethod())
      // TODO add error message to be shown
      dispatch({type: EXECUTE_PAYPAL_PAYMENT_FAILURE})
    },
  })
}

export const cancelPaypalPayment = () => (dispatch, getState, {fetch, history}) => {
  const {token} = dispatch(getToken())
  const transactionId = localStorage.getItem(TRANSACTION_ID_KEY)
  if (!transactionId) {
    return
  }
  dispatch({type: CANCEL_PAYPAL_PAYMENT_REQUEST})
  return fetch('/payments/paypal/cancel', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      transaction_id: transactionId,
    },
    token,
    success: (res) => {
      dispatch(returnToPaymentMethod(true))
      dispatch({type: CANCEL_PAYPAL_PAYMENT_SUCCESS})
    },
    failure: () => {
      dispatch(returnToPaymentMethod(true))
      dispatch({type: CANCEL_PAYPAL_PAYMENT_FAILURE})
    },
  })
}

export const makeBitpayPayment = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  const {orderId} = getState().purchase
  if (!orderId) {
    return
  }
  dispatch({type: MAKE_BITPAY_PAYMENT_REQUEST})
  return fetch(`/payments/bitpay/charge/${orderId}`, {
    method: 'POST',
    token,
    success: (res) => {
      // redirect to bitpay payment page
      window.location = res.data.approval_url
      dispatch({type: MAKE_BITPAY_PAYMENT_SUCCESS})
    },
    failure: () => {
      dispatch({type: MAKE_BITPAY_PAYMENT_FAILURE})
    },
  })
}

export const getDonationOrgs = () => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_DONATION_ORGS_REQUEST})
  return fetch(`/donation`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_DONATION_ORGS_SUCCESS, donationOrgs: res.data}),
    failure: () => dispatch({type: GET_DONATION_ORGS_FAILURE})
  })
}

export const setDonationOrg = (donationOrg) => ({type: SET_DONATION_ORG, donationOrg})

export const submitGiftType = () => (dispatch, getState) => {
  const {flow, giftType} = getState().purchase
  // TODO try to find a better way to replace steps in the flow
  if (giftType === DONATION_TYPE) {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === PURCHASE8_ROUTE || item === VOUCHER_ROUTE)
          return DONATION_ROUTE
        return item
      })
    }, false))
  } else if (giftType === VOUCHER_TYPE) {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === PURCHASE8_ROUTE || item === DONATION_ROUTE)
          return VOUCHER_ROUTE
        return item
      })
    }, false))
  } else {
    dispatch(setFlow({
      ...flow,
      routes: flow.routes.map(item => {
        if (item === DONATION_ROUTE || item === VOUCHER_ROUTE)
          return PURCHASE8_ROUTE
        return item
      })
    }, false))
  }
  dispatch(nextFlowStep())
}

export const submitVoucher = (voucher) => async (dispatch, getState) => {
  await dispatch({type: SUBMIT_VOUCHER, voucher})
  const {flow} = getState().purchase
  if (flow.key === EDIT_BUNDLE_FLOW.key) {
    dispatch(nextFlowStep())
  } else {
    dispatch(confirmVoucher())
  }
}

export const confirmVoucher = (bundleValues) => async (dispatch, getState, {fetch}) => {
  await dispatch(addBundle(bundleValues, false))
  const {token} = dispatch(getToken())
  const {bundleId, voucher: {html, ...values}} = getState().purchase
  if(bundleId === null)
  {
    message.error('Bundle is incorrect.');
    return;
  }
  dispatch({type: CONFIRM_VOUCHER_REQUEST})
  return fetch(`/vouchers`, {
    method: 'POST',
    body: {
      bundle_id: parseInt(bundleId),
      ...values,
      html,
    },
    token,
    success: () => {
      dispatch({type: CONFIRM_VOUCHER_SUCCESS})
      dispatch(nextFlowStep())
    },
    failure: () => {
      dispatch({type: CONFIRM_VOUCHER_FAILURE})
    },
  })
}

export const submitDonation = (donation) => async (dispatch, getState) => {
  await dispatch({type: SUBMIT_DONATION, donation})
  const {flow} = getState().purchase
  if (flow.key === EDIT_BUNDLE_FLOW.key) {
    dispatch(nextFlowStep())
  } else {
    dispatch(confirmDonation())
  }
}

export const confirmDonation = (bundleValues) => async (dispatch, getState, {fetch}) => {
  await dispatch(addBundle(bundleValues, false))
  const {token} = dispatch(getToken())
  const {donationOrg, bundleId, donationAmount, hideAmount} = getState().purchase
  if(bundleId === null)
  {
    message.error('Bundle is incorrect.');
    return;
  }
  dispatch({type: CONFIRM_DONATION_REQUEST})
  return fetch(`/donations`, {
    method: 'POST',
    body: {
      bundle_id: parseInt(bundleId),
      organization_id: donationOrg.id,
      amount: donationAmount,
      hide_amount: hideAmount,
    },
    token,
    success: () => {
      dispatch({type: CONFIRM_DONATION_SUCCESS})
      dispatch(nextFlowStep())
    },
    failure: () => {
      dispatch({type: CONFIRM_DONATION_FAILURE})
    },
  })
}

export const getCardColors = () => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_CARD_COLORS_REQUEST})
  return fetch(`/card-colors?${qs.stringify({
    take: 100,
    order_by: 'title',
  })}`, {
    method: 'GET',
    success: (res) => {
      dispatch({type: GET_CARD_COLORS_SUCCESS, cardColors: res.data})
    },
    failure: () => {
      dispatch({type: GET_CARD_COLORS_FAILURE})
    }
  })
}

export const getDeliveryLocations = (orderId) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  dispatch({type: GET_DELIVERY_LOCATIONS_REQUEST})
  return fetch(`/order/${orderId}/get-deliverable-locations`, {
    method: 'GET',
    token,
    success: (res) => {
      dispatch({type: GET_DELIVERY_LOCATIONS_SUCCESS, deliveryLocations: res.data})
    },
    failure: () => {
      dispatch({type: GET_DELIVERY_LOCATIONS_FAILURE})
    }
  })
}

export const getOrderDetails = (orderId) => (dispatch, getState, {fetch}) => {
  const {token} = dispatch(getToken())
  if (!orderId) {
    return
  }
  dispatch({type: GET_ORDER_DETAILS_REQUEST})
  return fetch(`/order-confirmation?${qs.stringify({
    order_id: orderId,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_ORDER_DETAILS_SUCCESS, order: res.data}),
    failure: () => dispatch({type: GET_ORDER_DETAILS_FAILURE}),
  })
}

export const getBundleDetails = (bundleId) => (dispatch, getState, {fetch}) => {
  dispatch({type: GET_BUNDLE_DETAILS_REQUEST})
  const {token} = dispatch(getToken())
  return fetch(`/bundles?${qs.stringify({
    filter_key: 'id',
    filter_value: bundleId,
  })}`, {
    method: 'GET',
    token,
    success: (res) => dispatch({type: GET_BUNDLE_DETAILS_SUCCESS, bundle: res.data[0]}),
    failure: () => dispatch({type: GET_BUNDLE_DETAILS_FAILURE}),
  })
}

export const setFontFamilies = (fontFamily) => ({type: SET_FONT_FAMILIES, fontFamily})

export const clear = () => ({type: CLEAR})

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  loading: {
    occasions: false,
    donationOrgs: false,
    cards: false,
    payment: false,
    recipients: false
  },
  occasions: [],
  occasion: null,
  letteringTechnique: null,
  cardStyle: null,
  cardSize: null,
  cardDetails: null,
  giftType: undefined,
  card: null,
  gift: null,
  gifts: [],
  paymentMethod: null,
  cardStyles: [],
  cards: [],
  flow: PURCHASE_FLOW,
  flowIndex: null,
  occasionTypes: [],
  occasionType: DEFAULT_OCCASION_TYPE,
  bundleId: null,
  bundle: null,
  orderId: null,
  order: null,
  donationOrgs: [],
  donationOrg: null,
  donationAmount: undefined,
  hideAmount: false,
  cardColors: [],
  cardColor: undefined,
  deliveryLocations: [],
  deliveryLocation: undefined,
  deliveryTime: undefined,
  voucher: null,
  recipients: [],
  templates: null,
  orderDetails: null,
  fontFamilies: [],
}

export default createReducer(initialState, {
  [SET_BUNDLE]: (state, {bundle, letteringTechnique, card, gift, giftType, cardSize, cardStyle}) => {
    return {
    // bundleId should be saved in cookies - bundle obj is too big
    bundle,
    bundleId: bundle.id,
    letteringTechnique,
    card,
    gift,
    giftType,
    cardSize,
    cardStyle,
    cardDetails: {body:bundle.body},
    /*
    order: {
      items:{
        card:bundle.bundle_card,
        gifts:bundle.bundle_gifts
      }
    }
    */
  }},
  [SET_FLOW]: (state, {flow}) => ({
    flow,
  }),
  [SET_FLOW_INDEX]: (state, {flowIndex}) => ({
    flowIndex,
  }),
  [SET_OCCASION]: (state, {occasion}) => ({
    occasion,
  }),
  [GET_OCCASIONS_REQUEST]: (state, {params}) => ({
    occasionType: has(params, 'occasionType') ? params.occasionType : state.occasionType,
    loading: {
      ...state.loading,
      occasions: true,
    }
  }),
  [GET_OCCASIONS_SUCCESS]: (state, {occasions}) => ({
    occasions,
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASIONS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      occasions: false,
    }
  }),
  [GET_OCCASION_TYPES_SUCCESS]: (state, {occasionTypes}) => ({
    occasionTypes,
  }),
  [SET_LETTERING_TECHNIQUE]: (state, {letteringTechnique}) => ({
    letteringTechnique,
  }),
  [GET_CARD_STYLES_SUCCESS]: (state, {cardStyles}) => ({
    cardStyles,
  }),
  [SET_CARD_STYLE]: (state, {cardStyle}) => ({
    cardStyle,
  }),
  [GET_CARDS_REQUEST]: (state, {params}) => ({
    cardColor: has(params, 'cardColor') ? params.cardColor : state.cardColor,
    loading: {
      ...state.loading,
      cards: true,
    }
  }),
  [GET_CARDS_SUCCESS]: (state, {cards}) => ({
    cards,
    // if current list doesn't have selected item - deselect it
    ...(!state.card || !cards.find(item => item.id === state.card.id) ? {
      card: null
    } : {}),
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [GET_CARDS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      cards: false,
    }
  }),
  [SET_CARD_SIZE]: (state, {cardSize}) => ({
    cardSize,
  }),
  [SET_CARD]: (state, {card}) => ({
    card,
  }),
  [SET_CARD_DETAILS]: (state, {cardDetails}) => ({
    cardDetails,
  }),
  [SET_GIFT_TYPE]: (state, {giftType}) => ({
    giftType,
    ...giftType === null ? {
      gift: null
    } : {}
  }),
  [CONTINUE_WITHOUT_GIFT]: (state, action) => ({
    giftType: null,
  }),
  [SET_GIFT]: (state, {gift}) => ({
    gift,
  }),
  [GET_GIFTS_REQUEST]: (state, {params}) => ({
    giftType: has(params, 'giftType') ? params.giftType : state.giftType,
  }),
  [GET_GIFTS_SUCCESS]: (state, {gifts}) => ({
    gifts,
    // if current list doesn't have selected item - deselect it
    ...(!state.gift || !gifts.find(item => item.id === state.gift.id) ? {
      gift: null
    } : {}),
  }),
  [SET_PAYMENT_METHOD]: (state, {paymentMethod}) => ({
    paymentMethod,
  }),
  [ADD_BUNDLE_SUCCESS]: (state, {bundle}) => ({
    bundleId: bundle.id,
    bundle,
  }),
  [MAKE_ORDER_SUCCESS]: (state, {order}) => ({
    // orderId should be saved in cookies - order obj is too big
    orderId: order.id,
    order,
  }),
  [SET_DONATION_ORG]: (state, {donationOrg}) => ({
    donationOrg,
  }),
  [GET_DONATION_ORGS_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      donationOrgs: true,
    }
  }),
  [GET_DONATION_ORGS_SUCCESS]: (state, {donationOrgs}) => ({
    donationOrgs,
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [GET_DONATION_ORGS_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      donationOrgs: false,
    }
  }),
  [SUBMIT_DONATION]: (state, {donation}) => ({
    donationAmount: +donation.donationAmount,
    hideAmount: donation.hideAmount,
  }),
  [MAKE_STRIPE_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_STRIPE_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_STRIPE_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_PAYPAL_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_BITPAY_PAYMENT_REQUEST]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: true,
    }
  }),
  [MAKE_BITPAY_PAYMENT_FAILURE]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [MAKE_BITPAY_PAYMENT_SUCCESS]: (state, action) => ({
    loading: {
      ...state.loading,
      payment: false,
    }
  }),
  [GET_CARD_COLORS_SUCCESS]: (state, {cardColors}) => ({
    cardColors,
  }),
  [GET_DELIVERY_LOCATIONS_SUCCESS]: (state, {deliveryLocations}) => ({
    deliveryLocations,
  }),
  [SUBMIT_SHIPPING_REQUEST]: (state, {values}) => ({
    deliveryLocation: values.deliverable,
    deliveryTime: values.schedule_date ? values.schedule_date.format(DATE_FORMAT) : undefined,
  }),
  [SUBMIT_VOUCHER]: (state, {voucher}) => ({
    voucher,
  }),
  [GET_RECIPIENTS_REQUEST]: (state) => ({
    loading: {
      ...state.loading,
      recipients: true,
    }
  }),
  [GET_RECIPIENTS_SUCCESS]: (state, res) => ({
    loading: {
      ...state.loading,
      recipients: false,
    },
    recipients: res.recipients,
  }),
  [GET_RECIPIENTS_FAILURE]: (state) => ({
    loading: {
      ...state.loading,
      recipients: false,
    },
  }),
  [GET_TEMPLATE_SUCCESS]: (state, {templates}) => ({
    templates,
  }),
  [GET_ORDER_DETAILS_SUCCESS]: (state, {order}) => ({
    order,
  }),
  [GET_BUNDLE_DETAILS_SUCCESS]: (state, {bundle}) => ({
    bundle,
  }),
  [SET_FONT_FAMILIES]: (state, {fontFamily}) => ({
    fontFamilies: uniq([...state.fontFamilies, fontFamily]),
  }),
  [CLEAR]: (state, action) => RESET_STORE,
})
