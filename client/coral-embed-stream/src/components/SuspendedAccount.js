import React, {Component, PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);
import styles from './SuspendAccount.css';
import {Button} from 'coral-ui';
import validate from 'coral-framework/helpers/validate';
import RestrictedMessageBox from 'coral-framework/components/RestrictedMessageBox';

class SuspendedAccount extends Component {

  static propTypes = {
    canEditName: PropTypes.bool,
    editName: PropTypes.func.isRequired
  }

  state = {
    username: '',
    alert: ''
  }

  onSubmitClick = (e) => {
    const {editName} = this.props;
    const {username} = this.state;
    e.preventDefault();
    if (validate.username(username)) {
      editName(username)
        .then(() => location.reload())
        .catch((error) => {
          this.setState({alert: lang.t(`error.${error.translation_key}`)});
        });
    } else {
      this.setState({alert: lang.t('editName.error')});
    }

  }

  render () {
    const {canEditName} = this.props;
    const {username, alert} = this.state;

    return <RestrictedMessageBox>
      <span>{
          canEditName ?
          lang.t('editName.msg')
          : lang.t('bannedAccountMsg')
        }</span>
      {
        canEditName ?
        <div>
          <div className={styles.alert}>
            {alert}
          </div>
          <label
            htmlFor='username'
            className="screen-reader-text"
            aria-hidden={true}>
            {lang.t('editName.label')}
          </label>
          <input
            type='text'
            className={styles.editNameInput}
            value={username}
            placeholder={lang.t('editName.label')}
            id='username'
            onChange={(e) => this.setState({username: e.target.value})}
            rows={3}/><br/>
          <Button
            onClick={this.onSubmitClick}>
            {
              lang.t('editName.button')
            }
          </Button>
        </div> : null
      }
    </RestrictedMessageBox>;
  }
}

export default SuspendedAccount;
