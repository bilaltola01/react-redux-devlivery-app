import React from 'react'
import {connect} from 'react-redux'
import {ADD_CONTACT_MANUALLY, IMPORT_CONTACTS,nextFlowStep} from '../../reducers/purchase'
import {Button,Col, Row} from 'antd'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Purchase10.css'
import {Card, PurchaseActions, SectionHeader} from '../../components'
import AddContactManuallyIcon from '../../static/add_contacts_manually.svg'
import ImportContactsIcon from '../../static/import_contacts.svg'
import ImportContacts from './ImportContacts'
import AddContact from './AddContact'
import messages from './messages'
import Contacts from '../../routes/contacts_mulitple/Contacts';
import ContactGroups from '../../routes/contactGroups/ContactGroups';
import {getContactsByName} from '../../reducers/contacts'
import {getContactGroups} from '../../reducers/contactGroups'
import KeyHandler, {KEYPRESS} from 'react-key-handler'
import {message} from 'antd'
import {getContacts} from '../../reducers/contacts'

class Purchase10 extends React.Component {
  state = {
    addingContactMode: null,
    isFirstSubmit:false,
    disableButton:false
  }
  constructor(props){
    super(props);
    this.setDisableButton = this.setDisableButton.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.ref_addcontact = React.createRef();
    this.ref_contacts = React.createRef();
    this.ref_importcontact = React.createRef();
  }
  setAddingContactsMode = (addingContactMode) => {
    this.setState({addingContactMode})
  }
    
  setDisableButton(disableButton){
    this.setState({disableButton});
  }
  refreshPage(){
    this.setState({
      //addingContactMode: null,
      disableButton:false
    })
    this.props.getContactGroups();
    this.props.getContacts();
  }
  onSubmit(){
    const {addingContactMode} = this.state;
    
    if(addingContactMode === ADD_CONTACT_MANUALLY)
    {
      if(this.ref_addcontact)
      {
        this.setState({disableButton:true});
        if(!this.ref_addcontact.handleSubmit())
        {
          this.setState({disableButton:false});
        }
      }
      return;
    }
    if(addingContactMode === IMPORT_CONTACTS && this.ref_importcontact)
    {
      if(this.ref_importcontact.props.mappingColumns)
      {
        if(this.ref_importcontact)
        {
          this.setState({disableButton:true});
          if(!this.ref_importcontact.handleSubmit())
          {
            this.setState({disableButton:false});
          }
        }
      }
      else{
        message.error("Please upload contact file.");
      }
      return;
    }
    if(this.ref_contacts)
    {
      this.setState({disableButton:true});
      if(!this.ref_contacts.handleSubmit())
      {
        this.setState({disableButton:false});
      }
    }
  }
  
  render() {
    const {addingContactMode,disableButton} = this.state
    const {flowIndex, intl} = this.props
    return (
      <React.Fragment>
        {addingContactMode === ADD_CONTACT_MANUALLY ? (
          <AddContact intl={intl} onRef={ref => (this.ref_addcontact = ref)} />
        ) : addingContactMode === IMPORT_CONTACTS ? (
          <ImportContacts intl={intl} onRef={ref => (this.ref_importcontact = ref)} refreshPage={this.refreshPage}/>
        ) : (
          <React.Fragment>
            <div className={s.content}>
              <SectionHeader
                header={intl.formatMessage(messages.header)}
                number={flowIndex + 1}
                prefixClassName={s.headerPrefix}
              />
              <Row className={s.items} gutter={20} type='flex' align='center'>
                <Col className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={intl.formatMessage(messages.addContactManually)}
                    onClick={() => this.setAddingContactsMode(ADD_CONTACT_MANUALLY)}
                    active={addingContactMode === ADD_CONTACT_MANUALLY}
                    keyValue='a'
                    svg={AddContactManuallyIcon}
                  />
                </Col>
                <Col className={s.itemWrapper}>
                  <Card
                    className={s.item}
                    title={intl.formatMessage(messages.importContacts)}
                    onClick={() => this.setAddingContactsMode(IMPORT_CONTACTS)}
                    active={addingContactMode === IMPORT_CONTACTS}
                    keyValue='b'
                    svg={ImportContactsIcon}
                  />
                </Col>
              </Row>
              <Contacts {...this.props} onRef={ref => (this.ref_contacts = ref)} setDisableButton={this.setDisableButton}/>
            </div>
          </React.Fragment>
        )}
        <PurchaseActions>
          {
            <div>
              <KeyHandler
                keyEventName={KEYPRESS}
                keyCode={13}
                onKeyHandle={() => this.onSubmit()}
              />
              <Button
                type='primary'
                disabled={disableButton}
                onClick={() => this.onSubmit()}
              >
                {intl.formatMessage(messages.submit)}
              </Button>
            </div>
          }
        </PurchaseActions>
      </React.Fragment>
    )
  }
}

const mapState = state => ({
  flowIndex: state.purchase.flowIndex,
})

const mapDispatch = {getContactsByName,getContactGroups,nextFlowStep,getContacts}

export default connect(mapState, mapDispatch)(withStyles(s)(Purchase10))
