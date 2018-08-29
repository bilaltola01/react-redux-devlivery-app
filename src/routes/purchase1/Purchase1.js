import React from 'react'
import {connect} from 'react-redux'
import {getOccasions, nextFlowStep, setOccasion} from '../../reducers/purchase'
import {Col, Row, Select} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase1.css'
import {Card, SectionHeader} from '../../components'
import {ALPHABET} from '../../constants'
import messages from './messages'

class Purchase1 extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      occasionType: props.occasionType
    }
    this.selectSeasonal = this.selectSeasonal.bind(this);
  }
  selectSeasonal(occasionType){
    this.setState({occasionType});
    this.props.getOccasions({occasionType});
  }
  render() {
    const {occasions, occasion, setOccasion, intl, flowIndex, nextFlowStep, occasionTypes, getOccasions} = this.props
    
    return (
      <div className={s.content}>
        <SectionHeader
          className={s.header}
          header={intl.formatMessage(messages.header)}
          number={flowIndex + 1}
          prefixClassName={s.headerPrefix}
        >
          <Select
            className={s.occasionType}
            allowClear
            placeholder={intl.formatMessage(messages.filterByOccasionType)}
            value={this.state.occasionType}
            onChange={(occasionType) => this.selectSeasonal(occasionType)}
          >
            {occasionTypes.map(item =>
              <Select.Option key={item} value={item}>{item}</Select.Option>
            )}
          </Select>
        </SectionHeader>
        <Row className={s.items} gutter={20} type='flex' align='center'>
          {occasions.map((item, i) =>
            <Col key={item.id} className={s.itemWrapper}>
              <Card
                className={s.item}
                title={item.title}
                item={item}
                imagesProp={'image'}
                onClick={() => {
                  if(item.id == 11)
                    this.selectSeasonal('Seasonal');
                  else{
                    setOccasion(item)
                    nextFlowStep()
                  }
                }}
                active={occasion && occasion.id === item.id}
                keyValue={ALPHABET[i]}
              />
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

const mapState = state => ({
  occasionTypes: state.purchase.occasionTypes,
  occasionType: state.purchase.occasionType,
  occasions: state.purchase.occasions,
  occasion: state.purchase.occasion,
  loading: state.purchase.loading,
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {
  getOccasions,
  setOccasion,
  nextFlowStep,
}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase1))
