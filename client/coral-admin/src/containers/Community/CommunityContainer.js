import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import {modUserFlaggedQuery} from 'coral-admin/src/graphql/queries';
import {banUser, setUserStatus, rejectUsername} from 'coral-admin/src/graphql/mutations';

import {
  fetchAccounts,
  updateSorting,
  newPage,
  showBanUserDialog,
  hideBanUserDialog,
  showSuspendUserDialog,
  hideSuspendUserDialog
} from '../../actions/community';

import CommunityMenu from './components/CommunityMenu';
import BanUserDialog from './components/BanUserDialog';
import SuspendUserDialog from './components/SuspendUserDialog';

import People from './People';
import FlaggedAccounts from './FlaggedAccounts';

class CommunityContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      timer: null
    };

    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onHeaderClickHandler = this.onHeaderClickHandler.bind(this);
    this.onNewPageHandler = this.onNewPageHandler.bind(this);
  }

  componentWillMount() {
    this.props.fetchAccounts({});
  }

  onKeyDownHandler(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.search();
    }
  }

  onSearchChange(e) {
    const value = e.target.value;
    this.setState((prevState) => {
      prevState.searchValue = value;
      clearTimeout(prevState.timer);
      const fetchAccounts = this.props.fetchAccounts;
      prevState.timer = setTimeout(() => {
        fetchAccounts({value});
      }, 350);
      return prevState;
    });
  }

  search(query = {}) {
    const {community} = this.props;

    this.props.fetchAccounts({
      value: this.state.searchValue,
      field: community.fieldPeople,
      asc: community.ascPeople,
      ...query
    });

  }

  onHeaderClickHandler(sort) {
    this.props.dispatch(updateSorting(sort));
    this.search();
  }

  onNewPageHandler(page) {
    this.props.dispatch(newPage(page));
    this.search({page});
  }

  getTabContent(searchValue, props) {
    const {community, data} = props;
    const activeTab = props.route.path === ':id' ? 'flagged' : props.route.path;

    if (activeTab === 'people') {
      return (
        <People
          isFetching={community.isFetchingPeople}
          commenters={community.accounts}
          searchValue={searchValue}
          onSearchChange={this.onSearchChange}
          error={community.errorPeople}
          totalPages={community.totalPagesPeople}
          page={community.pagePeople}
          onKeyDown={this.onKeyDownHandler}
          onHeaderClickHandler={this.onHeaderClickHandler}
          onNewPageHandler={this.onNewPageHandler}
        />
      );
    }

    return (
      <div>
        <FlaggedAccounts
          commenters={data.users}
          isFetching={data.loading}
          error={data.error}
          showBanUserDialog={props.showBanUserDialog}
          approveUser={props.approveUser}
          rejectUsername={props.rejectUsername}
          showSuspendUserDialog={props.showSuspendUserDialog}
        />
        <BanUserDialog
          open={community.banDialog}
          user={community.user}
          handleClose={props.hideBanUserDialog}
          handleBanUser={props.banUser}
        />
        <SuspendUserDialog
          open={community.suspendDialog}
          handleClose={props.hideSuspendUserDialog}
          user={community.user}
          rejectUsername={props.rejectUsername}
        />
      </div>
    );
  }

  render() {
    const {searchValue} = this.state;

    const tab = this.getTabContent(searchValue, this.props);

    return (
      <div>
        <CommunityMenu />
        <div>
          { tab }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  community: state.community.toJS()
});

const mapDispatchToProps = (dispatch) => ({
  fetchAccounts: (query) => dispatch(fetchAccounts(query)),
  showBanUserDialog: (user) => dispatch(showBanUserDialog(user)),
  hideBanUserDialog: () => dispatch(hideBanUserDialog(false)),
  showSuspendUserDialog: (user) => dispatch(showSuspendUserDialog(user)),
  hideSuspendUserDialog: () => dispatch(hideSuspendUserDialog())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  modUserFlaggedQuery,
  banUser,
  setUserStatus,
  rejectUsername
)(CommunityContainer);
