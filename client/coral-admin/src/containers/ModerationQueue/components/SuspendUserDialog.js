import React, {PropTypes} from 'react';
import {Dialog} from 'coral-ui';
import {RadioGroup, Radio} from 'react-mdl';
import styles from './SuspendUserDialog.css';

import Button from 'coral-ui/components/Button';

import I18n from 'coral-framework/modules/i18n/i18n';
import {dateAdd} from 'coral-framework/utils';
import translations from '../../../translations';
const lang = new I18n(translations);

const initialState = {step: 0, duration: '3'};

function durationsToDate(hours) {

  // Add 1 minute more to help `timeago.js` to display the correct duration.
  return dateAdd(new Date(), 'minute', hours * 60 + 1);
}

class SuspendUserDialog extends React.Component {

  state = initialState;

  componentWillReceiveProps(next) {
    if (this.props.open && !next.open) {
      this.setState(initialState);
    }
  }

  handleDurationChange = (event) => {
    this.setState({duration: event.target.value});
  }

  handleMessageChange = (event) => {
    this.setState({message: event.target.value});
  }

  goToStep1 = () => {
    this.setState({
      step: 1,
      message: lang.t(
        'suspenduser.email_message_suspend',
        this.props.username,
        this.props.organizationName,
        lang.timeago(durationsToDate(this.state.duration)),
      ),
    });
  }

  handlePerform = () => {

    this.props.onPerform({
      id: this.props.userId,
      message: this.state.message,

      // Add 1 minute more to help `timeago.js` to display the correct duration.
      until: durationsToDate(this.state.duration),
    });
  };

  renderStep0() {
    const {onCancel, username} = this.props;
    const {duration} = this.state;
    return (
      <section>
        <h1 className={styles.header}>
          {lang.t('suspenduser.title_suspend')}
        </h1>
        <p className={styles.description}>
         {lang.t('suspenduser.description_suspend', username)}
        </p>
        <fieldset>
          <legend className={styles.legend}>{lang.t('suspenduser.select_duration')}</legend>
          <RadioGroup
            name='status filter'
            value={duration}
            childContainer='div'
            onChange={this.handleDurationChange}
            className={styles.radioGroup}
          >
            <Radio value='1'>{lang.t('suspenduser.one_hour')}</Radio>
            <Radio value='3'>{lang.t('suspenduser.hours', 3)}</Radio>
            <Radio value='24'>{lang.t('suspenduser.hours', 24)}</Radio>
            <Radio value='168'>{lang.t('suspenduser.days', 7)}</Radio>
          </RadioGroup>
        </fieldset>
        <div className={styles.buttons}>
          <Button cStyle="white" className={styles.cancel} onClick={onCancel} raised>
            {lang.t('suspenduser.cancel')}
          </Button>
          <Button cStyle="black" className={styles.perform} onClick={this.goToStep1} raised>
            {lang.t('suspenduser.suspend_user')}
          </Button>
        </div>
      </section>
    );
  }

  renderStep1() {
    const {onCancel, username} = this.props;
    const {message} = this.state;
    return (
      <section>
        <h1 className={styles.header}>
          {lang.t('suspenduser.title_notify')}
        </h1>
        <p className={styles.description}>
         {lang.t('suspenduser.description_notify', username)}
        </p>
        <fieldset>
          <legend className={styles.legend}>{lang.t('suspenduser.write_message')}</legend>
          <textarea
            rows={5}
            className={styles.messageInput}
            value={message}
            onChange={this.handleMessageChange} />
        </fieldset>
        <div className={styles.buttons}>
          <Button cStyle="white" className={styles.cancel} onClick={onCancel} raised>
            {lang.t('suspenduser.cancel')}
          </Button>
          <Button
            cStyle="black"
            className={styles.perform}
            onClick={this.handlePerform}
            disabled={this.state.message.length === 0}
            raised
          >
            {lang.t('suspenduser.send')}
          </Button>
        </div>
      </section>
    );
  }

  render() {
    const {open, onCancel} = this.props;
    const {step} = this.state;
    return (
      <Dialog
        className={styles.dialog}
        onCancel={onCancel}
        open={open}
      >
        <div className={styles.close}>
          <button aria-label="Close" onClick={onCancel} className={styles.closeButton}>×</button>
        </div>
        {step === 0 && this.renderStep0()}
        {step === 1 && this.renderStep1()}
      </Dialog>
    );
  }
}

SuspendUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onPerform: PropTypes.func.isRequired,
  username: PropTypes.string,
  userId: PropTypes.string,
  organizationName: PropTypes.string,
};

export default SuspendUserDialog;
