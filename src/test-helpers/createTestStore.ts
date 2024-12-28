import { clearActionCreator as clear } from '../actions/clear'
import store from '../stores/app'
import dispatch from '../test-helpers/dispatch'

// import updateUrlHistoryMiddleware from '../redux-middleware/updateUrlHistory'
// import storageCacheStoreEnhancer from '../redux-enhancers/storageCache'

/**
 * Returns new store for test.
 */
export default async function createTestStore() {
  await dispatch(clear())

  store.dispatch([
    // skip tutorial
    { type: 'tutorial', value: false },

    // close welcome modal
    { type: 'closeModal' },
  ])

  return store
}
