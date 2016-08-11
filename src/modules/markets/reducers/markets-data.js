import { UPDATE_MARKETS_DATA, CLEAR_MARKETS_DATA } from '../../markets/actions/update-markets-data';

import { CATEGORICAL } from '../../markets/constants/market-types';
import { CATEGORICAL_OUTCOMES_SEPARATOR } from '../../markets/constants/market-outcomes';

export default function (marketsData = {}, action) {
	switch (action.type) {
	case UPDATE_MARKETS_DATA:
		return {
			...marketsData,
			...processMarketsData(action.marketsData, marketsData)
		};
	case CLEAR_MARKETS_DATA:
		return {};
	default:
		return marketsData;
	}
}

function processMarketsData(newMarketsData, existingMarketsData) {

	// it's important to loop through the original marketIDs so that unloaded markets can still be marked as isLoadedMarketInfo and avoid infinite recursion later on
	return Object.keys(newMarketsData).reduce((p, marketID) => {
		const marketData = {
			...existingMarketsData[marketID],
			...newMarketsData[marketID]
		};

		// clean description
		if (marketData.type === CATEGORICAL) {
			marketData.description = marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR).slice(0, -1).join();
		}

		// delete outcomes
		// delete marketData.outcomes;

		// parse out event, currently we only support single event markets, no combinatorial
		parseEvent(marketData);

		// mark whether details have been loaded
		marketData.isLoadedMarketInfo = !!marketData.type;

		// save market (without outcomes)
		p[marketID] = marketData;

		return p;
	}, {});

	function parseEvent(marketData) {
		if (!marketData.events || marketData.events.length !== 1) {
			delete marketData.events;
			return;
		}

		const event = marketData.events[0];
		marketData.eventID = event.id;
		marketData.minValue = event.minValue;
		marketData.maxValue = event.maxValue;
		marketData.numOutcomes = event.numOutcomes;
		marketData.reportedOutcome = event.outcome;
		delete marketData.events;
	}
}
