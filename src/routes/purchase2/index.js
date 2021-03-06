import React from 'react'
import Purchase2 from './Purchase2'
import {setCurrentRouteName} from '../../reducers/global'
import messages from './messages'

function action({store, route, intl}) {
  store.dispatch(setCurrentRouteName(route.name))

  return {
    chunks: ['purchase'],
    title: intl.formatMessage(messages.title),
    actions: null,
    component: <Purchase2 intl={intl}/>
  }
}

export default action
