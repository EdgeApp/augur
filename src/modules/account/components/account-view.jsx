import React, { Component, PropTypes } from 'react';
import ComponentNav from 'modules/common/components/component-nav';

import { ACCOUNT_NAV_ITEMS } from 'modules/account/constants/account-nav-items';
import { ACCOUNT_DEPOSIT, ACCOUNT_CONVERT, ACCOUNT_TRANSFER, ACCOUNT_EXPORT } from 'modules/app/constants/views';

import AccountDetails from 'modules/account/components/account-details';
import AccountDeposit from 'modules/account/components/account-deposit';
import AccountConvert from 'modules/account/components/account-convert';
import AccountTransfer from 'modules/account/components/account-transfer';
import AccountExport from 'modules/account/components/account-export';

export default class AccountView extends Component {
  static propTypes = {
    loginAccount: PropTypes.object.isRequired,
    authLink: PropTypes.object.isRequired,
    updateAccountName: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: ACCOUNT_DEPOSIT
    };

    this.updateSelectedNav = this.updateSelectedNav.bind(this);
  }

  updateSelectedNav(selectedNav) {
    this.setState({ selectedNav });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const loginAccount = p.loginAccount;

    return (
      <section id="account_view">
        <article
          className="account-content"
        >
          <AccountDetails
            name={loginAccount.name}
            updateAccountName={p.updateAccountName}
            address={loginAccount.address}
            trimmedAddress={loginAccount.trimmedAddress}
            signOut={p.authLink}
            airbitzAccount={loginAccount.airbitzAccount}
            onAirbitzManageAccount={loginAccount.onAirbitzManageAccount}
          />
          <ComponentNav
            fullWidth
            navItems={ACCOUNT_NAV_ITEMS}
            selectedNav={s.selectedNav}
            updateSelectedNav={this.updateSelectedNav}
          />
          {s.selectedNav === ACCOUNT_DEPOSIT &&
            <AccountDeposit
              address={loginAccount.address}
            />
          }
          {s.selectedNav === ACCOUNT_CONVERT &&
            <AccountConvert
              ethTokens={loginAccount.ethTokens}
              eth={loginAccount.eth}
              convertToToken={p.convertToToken}
              convertToEther={p.convertToEther}
            />
          }
          {s.selectedNav === ACCOUNT_TRANSFER &&
            <AccountTransfer
              ethTokens={loginAccount.ethTokens}
              eth={loginAccount.eth}
              rep={loginAccount.rep}
              transferFunds={p.transferFunds}
            />
          }
          {s.selectedNav === ACCOUNT_EXPORT &&
            <AccountExport
              airbitzAccount={loginAccount.airbitzAccount}
              stringifiedKeystore={loginAccount.stringifiedKeystore}
              accountPrivateKey={loginAccount.accountPrivateKey}
              downloadLoginIDDataString={loginAccount.downloadLoginIDDataString}
              downloadLoginIDFileName={loginAccount.downloadLoginIDFileName}
              downloadAccountDataString={loginAccount.downloadAccountDataString}
              downloadAccountFileName={loginAccount.downloadAccountFileName}
            />
          }
        </article>
      </section>
    );
  }
}
