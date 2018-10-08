import React from 'react'
import Purchase12 from './Purchase12'
import {setCurrentRouteName} from '../../reducers/global'
import {updateOrderMeta} from '../../reducers/purchase';
function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))
  store.dispatch(updateOrderMeta())
  return {
    chunks: ['purchase'],
    title: 'Purchase',
    actions: null,
    component: <Purchase12 intl={intl}/>
  }
}

export default action
