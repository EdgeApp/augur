import React from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'

import FormStyles from 'modules/common/less/form'
import ConfirmStyles from 'modules/common/less/confirm-table'

const ReportingReportConfirm = p => (
  <article className={FormStyles.Form__fields}>
    <div className={ConfirmStyles.Confirm}>
      <h2 className={ConfirmStyles.Confirm__heading}>Confirm Report</h2>
      <div className={ConfirmStyles['Confirm__wrapper--wide']}>
        <div className={ConfirmStyles.Confirm__creation}>
          <ul className={ConfirmStyles['Confirm__list--left-align']}>
            <li>
              <span>Market</span>
              <span>{ p.isMarketValid ? 'Valid' : 'Invalid' }</span>
            </li>
            { p.isMarketValid &&
              <li>
                <span>Outcome</span>
                <span>{ p.selectedOutcome }</span>
              </li>
            }
            <li>
              <span>Stake</span>
              <span>{ p.stake instanceof BigNumber ? p.stake.toNumber() : p.stake } REP</span>
            </li>
            <li>
              <span>Gas</span>
              <span>-- ETH</span>
            </li>
          </ul>
        </div>
      </div>
      { p.isOpenReporting && p.designatedReportNoShowReputationBond && p.reporterGasCost &&
        <div className={ConfirmStyles.Confirm__note_text}>
        If your report is accepted as the winning outcome, you will receive at least {p.designatedReportNoShowReputationBond.formatted} REP and {p.reporterGasCost.formatted} ETH
        </div>
      }
    </div>
  </article>
)

ReportingReportConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  isMarketValid: PropTypes.bool,
  designatedReportNoShowReputationBond: PropTypes.string,
  reporterGasCost: PropTypes.string,
  isOpenReporting: PropTypes.bool.isRequired,
}

export default ReportingReportConfirm
