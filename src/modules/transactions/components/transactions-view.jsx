import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';
import Paginator from 'modules/common/components/paginator';
import Spinner from 'modules/common/components/spinner';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';

import getValue from 'utils/get-value';
import debounce from 'utils/debounce';

export default class TransactionsView extends Component {
  static propTypes = {
    transactions: PropTypes.array.isRequired,
    transactionsLoading: PropTypes.bool.isRequired,
    loadMoreTransactions: PropTypes.func.isRequired,
    loadAllTransactions: PropTypes.func.isRequired,
    triggerTransactionsExport: PropTypes.func.isRequired,
    hasAllTransactionsLoaded: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    branch: PropTypes.object,
    loginAccount: PropTypes.object,
    currentBlockNumber: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: null,
      boundedLength: null,
      pageChanged: false,
      hasAttachedScrollListener: false,
    };

    // this.updatePagination = this.updatePagination.bind(this);
    // this.paginateTransactions = this.paginateTransactions.bind(this);
    this.handleScroll = debounce(this.handleScroll.bind(this), 100);
    this.setSegment = this.setSegment.bind(this);
  }

  componentDidMount() {
    this.manageScrollEventListener(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    // These are to prevent the CSSTransitionGroup from transitioning transactions on pagination
    if (this.state.lowerBound !== nextState.lowerBound) this.setState({ pageChanged: true }); // Inferred page change
    if (this.state.pageChanged !== nextState.pageChanged) this.setState({ pageChanged: false });

    if (!nextState.hasAttachedScrollListener && nextProps.isMobile) this.setState({ hasAttachedScrollListener: true });
    if (nextState.hasAttachedScrollListener && !nextProps.isMobile) this.setState({ hasAttachedScrollListener: false });
  }

  componentDidUpdate(prevProps, prevState) {
    this.manageScrollEventListener(this.props, this.state);
  }

  componentWillUnmount() {
    if (this.state.hasAttachedScrollListener) window.removeEventListener('scroll', this.handleScroll);
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, upperBound, boundedLength });
  }

  handleScroll() {
    const D = document;
    const documentHeight = Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    ); // Cross Browser Compatibility
    const currentScrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;

    if (documentHeight - currentScrollPosition < 200 && !this.props.transactionsLoading) {
      this.props.loadMoreTransactions();
    }
  }

  manageScrollEventListener(p, s) {
    if (p.isMobile && !s.hasAttachedScrollListener) {
      window.addEventListener('scroll', this.handleScroll);
      this.setState({ hasAttachedScrollListener: true });
    } else if (!p.isMobile && s.hasAttachedScrollListener) {
      window.removeEventListener('scroll', this.handleScroll);
      this.setState({ hasAttachedScrollListener: false });
    }
  }

  // updatePagination(p, s, pageChanged = false) {
  //   const itemsPerPage = s.transactionsPerPage - 1; // Convert to zero index
  //   const lowerIndex = (s.currentPage - 1) * s.transactionsPerPage;
  //   const upperIndex = (p.transactions.length - 1) > lowerIndex + itemsPerPage ?
  //     lowerIndex + itemsPerPage :
  //     p.transactions.length - 1;
  //
  //   this.setState({
  //     lowerIndex,
  //     upperIndex,
  //     pagination: {
  //       numUnpaginated: p.transactions.length,
  //       startItemNum: lowerIndex + 1,
  //       endItemNum: upperIndex + 1,
  //       previousPageLink: s.currentPage > 1 ?
  //       {
  //         onClick: () => {
  //           if (s.currentPage > 1) this.setState({ currentPage: s.currentPage - 1 });
  //         }
  //       } :
  //       null,
  //       nextPageLink: s.currentPage < Math.ceil(p.transactions.length / s.transactionsPerPage) ?
  //       {
  //         onClick: () => {
  //           if (upperIndex < p.transactions.length - 1) this.setState({ currentPage: s.currentPage + 1 });
  //         }
  //       } :
  //       null
  //     }
  //   }, () => {
  //     this.paginateTransactions(this.props, this.state, pageChanged);
  //   });
  // }

  // paginateTransactions(p, s, pageChanged) {
  //   // Filter Based on Pagination
  //   const paginatedTransactions = p.transactions.slice(s.lowerIndex, s.upperIndex + 1);
  //
  //   if (paginatedTransactions !== s.paginatedTransactions) {
  //     this.setState({
  //       paginatedTransactions,
  //       pageChanged
  //     });
  //   }
  // }

  render() {
    const p = this.props;
    const s = this.state;

    const hasRep = !!getValue(p, 'loginAccount.rep.value');
    const hasBranch = !!getValue(p, 'branch.id');
    const transactionsLength = p.transactions.length;

    return (
      <section id="transactions_view">
        <Helmet>
          <title>Transactions</title>
        </Helmet>

        {hasRep && hasBranch &&
          <Branch {...p.branch} />
        }

        <div className="view-header">
          <div className="view-header-group">
            <h2>Transactions</h2>
          </div>
          <div className="view-header-group">
            <TransactionsLoadingActions
              loadMoreTransactions={p.loadMoreTransactions}
              loadAllTransactions={p.loadAllTransactions}
              transactionsLoading={p.transactionsLoading}
              hasAllTransactionsLoaded={p.hasAllTransactionsLoaded}
              triggerTransactionsExport={p.triggerTransactionsExport}
              registerBlockNumber={p.loginAccount.registerBlockNumber}
              allowExport
            />
          </div>
        </div>

        <Transactions
          transactions={p.transactions}
          currentBlockNumber={p.currentBlockNumber}
          lowerBound={s.lowerBound}
          boundedLength={s.boundedLength}
          pageChanged={s.pageChanged}
        />

        {!!transactionsLength && !p.isMobile &&
          <Paginator
            itemsLength={p.transactions.length}
            itemsPerPage={20}
            location={p.location}
            history={p.history}
            setSegment={this.setSegment}
          />
        }

        {p.isMobile &&
          <div className="transactions-loading-status">
            {p.isMobile && p.transactionsLoading &&
              <div className="transactions-loading-spinner" >
                <Spinner />
              </div>
            }
            {!p.transactionsLoading && p.hasAllTransactionsLoaded &&
              <span
                className="transactions-all-loaded-message"
              >
                All Transactions Loaded
              </span>
            }
          </div>
        }
      </section>
    );
  }
}
