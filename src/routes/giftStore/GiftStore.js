import React from 'react'
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './GiftStore.css'
import messages from './messages'
import debounce from 'lodash/debounce'
import {DEFAULT_DEBOUNCE_TIME, GIFT_TYPES} from '../../constants'
import {clearFilters, getGifts, clear} from '../../reducers/gifts'
import {Button, Col, Input, Pagination, Row} from 'antd'
import {Card, PaginationItem} from '../../components'
import cn from 'classnames'

class GiftStore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: undefined,
    }

    this.getGifts = debounce(this.props.getGifts, DEFAULT_DEBOUNCE_TIME)
  }

  componentWillUnmount() {
    this.props.clear()
  }

  changeSearch = (e) => {
    const search = e.target.value
    this.setState({search})
    this.getGifts({search})
  }

  render() {
    const {search} = this.state
    const {gifts, giftsCount, getGifts, intl, page, pageSize, loading, clearFilters, giftType} = this.props
    return (
      <div className={s.container}>
        <div className={s.filters}>
          <h3 className={s.filterHeader}>{intl.formatMessage(messages.collections)}</h3>
          <ul className={s.filterItems}>
            {GIFT_TYPES(intl).map((item) =>
              <li key={item.key}>
                <a
                  onClick={() => getGifts({giftType: item.key})}
                  className={cn(item.key === giftType && s.selected)}
                >
                  {item.title}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className={s.content}>
          <div className={s.actions}>
            <Input.Search
              placeholder={intl.formatMessage(messages.search)}
              value={search}
              onChange={this.changeSearch}
            />
            <Button
              className={s.clearFilters}
              type='primary'
              ghost
              onClick={clearFilters}
            >
              {intl.formatMessage(messages.clearFilters)}
            </Button>
          </div>
          {!!gifts.length ? (
            <Row gutter={20} type='flex'>
              {gifts.map((item) =>
                <Col key={item.id} xs={24} sm={12} md={8} lg={6} className={s.itemWrapper}>
                  <Card
                    image={item.image[0] && item.image[0].url}
                    title={
                      <React.Fragment>
                        {item.title}
                        <br/>
                        <span className={s.price}>
                          {item.price}
                          <span className={s.currency}>{item.currency}</span>
                        </span>
                      </React.Fragment>
                    }
                    bordered={false}
                    description={item.description}
                  />
                </Col>
              )}
            </Row>
          ) : !loading.gifts ? (
            <div className={s.noData}>{intl.formatMessage(messages.noData)}</div>
          ) : null}
          {!!gifts.length && (
            <div className={s.footer}>
              <Pagination
                hideOnSinglePage
                current={page}
                total={giftsCount}
                pageSize={pageSize}
                onChange={(current) => getGifts({pagination: {current}})}
                itemRender={(current, type, el) => <PaginationItem type={type} el={el}/>}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  ...state.gifts,
})

const mapDispatch = {
  getGifts,
  clearFilters,
  clear,
}

export default connect(mapState, mapDispatch)(withStyles(s)(GiftStore))
