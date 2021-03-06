import React from 'react'
import { clear } from '../../reducers/contacts'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ContactUs.css'
import { Form, Row, Col, Input, Button, message } from 'antd'
import PlusIcon from '../../static/plus.svg'
import messages from './messages'
import { FloatingLabel } from '../../components';
import contactusImage from '../../static/POSE_7.png'
import formMessages from '../../formMessages'
import axios from 'axios';
import FormData from 'form-data'
import { showErrorMessage } from '../../utils'
import RemoveIcon from '../../static/remove.svg'

const { TextArea } = Input;
const allowFileType = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
];
class ContactUs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      attachments: [],
      email_err: null,
      errors:[]
    }
  }

  handleChangeInput = (name, e) => {
    this.setState({ [name]: e.target.value })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    var self = this;
    const {intl} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        self.setState({errors:[]});
        let formdata = new FormData();
        
        formdata.append('email',values.email);
        formdata.append('message',values.message);
        formdata.append('name',values.name);
        if(values.phone && values.phone !== undefined)
          formdata.append('phone',values.phone);
        if(values.subject && values.subject !== undefined)
          formdata.append('subject',values.subject);

        for(var i=0; i < this.state.attachments.length; i++)
        {
          let file = this.state.attachments[i];
          formdata.append('attachments[' + i + ']', file);
        }
        
        axios.post(window.App.apiUrl+`/enquiries`,formdata,{
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (response) {
          if(response.data && response.data.success)
          {
            message.success(intl.formatMessage(messages.sent_msg));
            self.setState({ attachments: [] });
            self.props.form.setFieldsValue({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: '',
            });
          }
        }).catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if(error.response && error.response.data && error.response.data.errors && error.response.data.errors.validation)
            {
              const validation = error.response.data.errors.validation;
              let errors = [];
              for(var key in validation){
                if(key.includes('attachments.'))
                {
                  const index = parseInt(key.replace('attachments.',''))
                  if(self.state.attachments[index])
                  {
                    errors.push(self.state.attachments[index].name);
                  }
                  else {
                    message.error(validation[key],3);
                  }
                }
                else message.error(validation[key],3);
              }
              self.setState({errors});
            }
            else showErrorMessage(error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            message.error('Something went wrong. Please try again.')
          } else {
            // Something happened in setting up the request that triggered an Error
            message.error('Something went wrong. Please try again.')
          }
        });
      }
    })
  }
  addAttachment = (e) => {
    const files = e.target.files
    
    if (files.length > 0 && this.state.attachments.length < 5) {
      this.setState({
        attachments: [...this.state.attachments, files[files.length - 1]]
      })
    }
  }
  removeFile = (index,filename) => {
    let attachments = this.state.attachments;
    attachments.splice(index,1);

    let errors = this.state.errors;
    if(errors.includes(filename))
    {
      var ix = errors.indexOf(filename);
      if (ix > -1) {
        errors.splice(ix, 1);
      }
    }
    this.setState({attachments,errors});
  }
  render() {
    const { intl } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className={s.wrapper}>
        <div className={s.container}>
          <section className={intl.locale === "de-DE" ? s.contentContainer_de : s.contentContainer}>
            <Row type='flex' >
              <Col sm={24} md={intl.locale === "de-DE" ? 8 : 8} className={s.titleContainer}>
                <div style={{ backgroundImage: `url(${contactusImage})` }} className={s.cardImage} />
              </Col>
              <Col sm={24} md={intl.locale === "de-DE" ? 16 : 16} className={s.titleContainer}>
                {/*<h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>*/}
                {
                  intl.locale === "de-DE" &&
                  <p className={s.subtitle}>
                    Kundenverblüffung leicht gemacht. Wir unterstützen Sie von A bis Z bei der Betreuung Ihrer Kunden und Partner: Wir bedrucken, verpacken, frankieren und versenden Karten zu unterschiedlichsten Ereignissen auf Bestellung. Auf Wunsch organisieren wir auch ein passendes Geschenk dazu – zum Beispiel einen Gutschein oder einen Wein. Besonders praktisch: Sobald Ihre Kontakte einmal erfasst sind, kümmern wir uns automatisch um Anlässe wie Geburtstage. Dabei informieren wir Sie jeweils über bevorstehende Ereignisse Ihrer Kontakte. Sie entscheiden dann, was in der jeweiligen Situation angebracht ist.<br /><br />Kurz: Zumi ist Ihr virtuelle Assistentin, die stets voraus denkt und Ihnen in allen Aspekten der Kundenpflege zur Seite steht.
                  </p>
                }
                {
                  intl.locale !== "de-DE" &&
                  <p className={s.subtitle}>
                    Thank you for your interest in "by Zumi".<br />
                    Use the form below to send your comment or questions.
                  </p>
                }
              </Col>
            </Row>
          </section>
          <Form onSubmit={this.handleSubmit} className={s.formContainer}>
            <h1 className={s.header}>{intl.formatMessage(messages.header)}</h1>
            <Row gutter={40} type='flex'>
              <Col md={12} className={s.contactInput}>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('name', {
                      initialValue: undefined,
                      rules: [
                        { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                      ],
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.nameInput)} />
                    )}
                  </Form.Item>
                </div>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      validateTrigger: 'onBlur',//'onBlur'
                      initialValue: undefined,
                      rules: [
                        { required: true, message: intl.formatMessage(formMessages.required), whitespace: true },
                        { type: 'email', message: intl.formatMessage(formMessages.emailInvalid) },
                      ],
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.emailInput)} />
                    )}
                  </Form.Item>
                </div>
              </Col>
              <Col md={12} className={s.contactInput}>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('phone', {
                      initialValue: undefined,
                    })(
                      <FloatingLabel type='phone' placeholder={intl.formatMessage(messages.phoneInput)} />
                    )}
                  </Form.Item>
                </div>
                <div className={s.formItem}>
                  <Form.Item>
                    {getFieldDecorator('subject', {
                      initialValue: undefined,
                    })(
                      <FloatingLabel placeholder={intl.formatMessage(messages.subjectInput)} />
                    )}
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row gutter={40} type='flex'>
              <Col md={24}>
                <span className={s.messageTitle}>{intl.formatMessage(messages.messageInput)}</span>
                <Form.Item>
                  {getFieldDecorator(`message`, {
                    initialValue: undefined,
                    rules: [
                      { required: true, min: 5, message: intl.formatMessage(formMessages.minLength, { length: 5 }) },
                    ],
                  })(
                    <TextArea
                      className={s.textArea}
                      autosize={{ minRows: 6, maxRows: 10 }}
                    />
                  )}
                </Form.Item>
                <label className={s.attachBtn}>
                  <Input type='file' onChange={this.addAttachment}/>
                  <PlusIcon />
                  {intl.formatMessage(messages.attachmentButton)}
                </label>
                <ul className={s.attachlist}>
                  {this.state.attachments &&
                    this.state.attachments.map((attach, index) => 
                      <li key={index}>
                        <div className={s.attachli}>
                          <RemoveIcon className={s.removeIcon} onClick={()=>this.removeFile(index,attach.name)}/>{attach && attach.name}
                        </div>
                        {
                          attach && attach.name && this.state.errors.includes(attach.name) &&
                          <div className={s.errormsg}>{intl.formatMessage(messages.msg_filetype)}</div>
                        }
                      </li>)
                    }
                </ul>
              </Col>
            </Row>
            <Row className={s.submitRow}>
              <Button className={s.submitBtn} htmlType='submit' type='primary'>
                {intl.formatMessage(messages.submit)}
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  // ...state.contacts,
})

const mapDispatch = {
  clear,
}

export default connect(mapState, mapDispatch)(Form.create()(withStyles(s)(ContactUs)))
