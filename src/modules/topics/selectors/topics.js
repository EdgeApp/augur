import { createSelector } from 'reselect';
import store from 'src/store';
import { selectTopicsState } from 'src/select-state';
import { selectTopicLink } from '../../../modules/link/selectors/links';

export default function () {
  return {
    topics: selectTopics(store.getState()),
    selectTopic: (topic) => {
      selectTopicLink(topic, store.dispatch).onClick();
    }
  };
}

export const selectTopics = createSelector(
  selectTopicsState,
  topics => Object.keys(topics || {})
    .map(topic => ({ topic, popularity: topics[topic] }))
    .sort(popularityDifference)
);

const popularityDifference = (topic1, topic2) => topic2.popularity - topic1.popularity;
