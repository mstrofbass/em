import React from 'react'
import { connect } from 'react-redux'
import * as classNames from 'classnames'
import globals from '../globals.js'
import { store } from '../store.js'
import { clientId, isMac, isMobile } from '../browser.js'
import * as AsyncFocus from '../async-focus.js'

// components
import ContentEditable from 'react-contenteditable'
import { Bullet } from './Bullet.js'
import { Child } from './Child.js'
import { Children } from './Children.js'
import { Code } from './Code.js'
import { ContextBreadcrumbs } from './ContextBreadcrumbs.js'
import { Editable } from './Editable.js'
import { GestureDiagram } from './GestureDiagram.js'
import { Helper } from './Helper.js'
import { HelperEditIdentum } from './HelperEditIdentum.js'
import { HomeLink } from './HomeLink.js'
import { ThoughtAnnotation } from './ThoughtAnnotation.js'

// constants
import {
  MAX_DISTANCE_FROM_CURSOR,
  RENDER_DELAY,
  ROOT_TOKEN,
} from '../constants.js'

// util
import {
  addContext,
  ancestors,
  animateWelcome,
  canShowHelper,
  chain,
  compareByRank,
  componentToItem,
  conjunction,
  contextChainToItemsRanked,
  cursorBack,
  cursorForward,
  decodeItemsUrl,
  deleteItem,
  disableTutorial,
  editableNode,
  encodeItems,
  encodeItemsUrl,
  equalArrays,
  equalItemRanked,
  equalItemsRanked,
  exists,
  exit,
  expandItems,
  flatMap,
  flatten,
  getContexts,
  getContextsSortedAndRanked,
  getChildrenWithRank,
  getDescendants,
  getNextRank,
  getRankAfter,
  getRankBefore,
  helperCleanup,
  importText,
  intersections,
  isBefore,
  isContextViewActive,
  isElementHiddenByAutoFocus,
  isRoot,
  lastItemsFromContextChain,
  log,
  makeCompareByProp,
  moveItem,
  newItem,
  nextEditable,
  notFalse,
  notNull,
  parse,
  perma,
  prevEditable,
  prevSibling,
  rankItemsFirstMatch,
  rankItemsSequential,
  removeContext,
  restoreCursorBeforeSearch,
  restoreSelection,
  rootedIntersections,
  selectNextEditable,
  selectPrevEditable,
  sigKey,
  signifier,
  sigRank,
  spellNumber,
  splice,
  splitChain,
  strip,
  stripPunctuation,
  subsetItems,
  sumChildrenLength,
  sync,
  syncOne,
  syncRemote,
  syncRemoteData,
  timestamp,
  translateContentIntoView,
  unrank,
  unroot,
  updateUrlHistory
} from '../util.js'

const asyncFocus = AsyncFocus()

// renders superscript if there are other contexts
// optionally pass items (used by ContextBreadcrumbs) or itemsRanked (used by Child)
export const Superscript = connect(({ contextViews, cursorBeforeEdit, cursor, showHelper, helperData }, props) => {

  // track the transcendental identifier if editing
  const editing = equalArrays(unrank(cursorBeforeEdit || []), unrank(props.itemsRanked || [])) && exists(sigKey(cursor || []))

  const itemsRanked = props.showContexts && props.itemsRanked
    ? rootedIntersections(props.itemsRanked)
    : props.itemsRanked

  const items = props.items || unrank(itemsRanked)

  const itemsLive = editing
    ? (props.showContexts ? intersections(unrank(cursor || [])) : unrank(cursor || []))
    : items

  const itemsRankedLive = editing
    ? (props.showContexts ? intersections(cursor || []) : cursor || [])
    : itemsRanked

  return {
    contextViews,
    items,
    itemsRankedLive,
    itemsRanked,
    // itemRaw is the signifier that is removed when showContexts is true
    itemRaw: props.showContexts ? signifier(props.itemsRanked) : signifier(itemsRankedLive),
    empty: itemsLive.length > 0 ? signifier(itemsLive).length === 0 : true, // ensure re-render when item becomes empty
    numContexts: exists(signifier(itemsLive)) && getContexts(signifier(itemsLive)).length,
    showHelper,
    helperData
  }
})(({ contextViews, contextChain=[], items, itemsRanked, itemsRankedLive, itemRaw, empty, numContexts, showHelper, helperData, showSingle, showContexts, superscript=true, dispatch }) => {

  showContexts = showContexts || isContextViewActive(unrank(itemsRanked), { state: store.getState() })

  const itemsLive = unrank(itemsRankedLive)

  const numDescendantCharacters = getDescendants(showContexts ? itemsRankedLive.concat(itemRaw) : itemsRankedLive )
    .reduce((charCount, child) => charCount + child.length, 0)

  const DepthBar = () => <span>

    {numDescendantCharacters >= 16 ? <Helper id='depthBar' title="The length of this bar indicates the number of items in this context." style={{ top: 30, marginLeft: -16 }} arrow='arrow arrow-up arrow-upleft' opaque>
      <p>This helps you quickly recognize contexts with greater depth as you navigate.</p>
    </Helper> : null}

    {(showContexts ? intersections(itemsLive) : itemsLive) && numDescendantCharacters ? <span className={classNames({
      'depth-bar': true,
      'has-other-contexts': itemsLive.length > 1 && (getContexts(signifier(showContexts ? intersections(itemsLive) : itemsLive)).length > 1)
    })} style={{ width: Math.log(numDescendantCharacters) + 2 }} /> : null}
  </span>

  return <span className='superscript-container'>{!empty && superscript && numContexts > (showSingle ? 0 : 1)
    ? <span className='num-contexts'> {/* Make the container position:relative so that the helper is positioned correctly */}
      {numContexts ? <sup>{numContexts}</sup> : null}

      {showHelper === 'superscript' && equalItemsRanked(itemsRanked, helperData.itemsRanked) ? <Helper id='superscript' title="Superscripts indicate how many contexts an item appears in" style={{ top: 30, left: -19 }} arrow='arrow arrow-up arrow-upleft' opaque center>
        <p>In this case, {helperData && helperData.value}<sup>{helperData && helperData.num}</sup> indicates that "{helperData && helperData.value}" appears in {spellNumber(helperData && helperData.num)} different contexts.</p>
        <p><i>Tap the superscript to view all of {helperData && helperData.value}'s contexts.</i></p>
      </Helper> : null}

      {/* render the depth-bar inside the superscript so that it gets re-rendered with it */}
      <DepthBar/>

    </span>

    : <DepthBar/>}

  {// editIdentum fires from existingItemChanged which does not have access to itemsRanked
  // that is why this helper uses different logic for telling if it is on the correct item
  showHelper === 'editIdentum' &&
    signifier(itemsLive) === helperData.newValue &&
    sigRank(itemsRanked) === helperData.rank ? <HelperEditIdentum itemsLive={itemsLive} showContexts={showContexts} />

    : showHelper === 'newItem' && equalItemsRanked(itemsRanked, helperData.itemsRanked) ? <Helper id='newItem' title="You've added an item!" arrow='arrow arrow-up arrow-upleft' style={{ marginTop: 36, marginLeft: -140 }}>
        <p><i>Hit Enter to add an item below.</i></p>
        {isMobile ? null : <p><i>Hit Shift + Enter to add an item above.</i></p>}
      </Helper>

    : showHelper === 'newChild' && equalItemsRanked(itemsRanked, helperData.itemsRanked) && signifier(itemsLive) !== '' ? <Helper id='newChild' title="Any item can become a context" arrow='arrow arrow-up arrow-upleft' style={{ marginTop: 36, marginLeft: -51 }}>
        <p>Contexts are items that contain other items.</p>
        {isMobile ? null : <p><i>Hit Command + Enter to turn this item into a context.</i></p>}
      </Helper>

    : showHelper === 'newChildSuccess' && equalItemsRanked(itemsRanked, helperData.itemsRanked) ? <Helper id='newChildSuccess' title="You've created a context!" arrow='arrow arrow-up arrow-upleft' style={{ marginTop: 36, marginLeft: -140 }}>
        <p>In <HomeLink inline />, items can exist in multiple contexts. </p>
        <p>For example, let's say you are reading a book about nutrition and taking copious notes as it sparks ideas related to changes you want to make to your diet, the science behind exercise, etc. In em, your notes will seamlessly appear in the context of that particular book and also in the context of "My Diet", "Exercise Science", etc. Other notes you had previously made in "My Diet" will appear side-by-side with your new notes.</p>
        <p>Instead of using files and folders, use contexts to freely associate and categorize your thoughts.</p>
      </Helper>

    : null}
  </span>
})

