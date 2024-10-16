import { css, cx } from '../../styled-system/css'
import { icon } from '../../styled-system/recipes'
import IconType from '../@types/Icon'
import Shortcut from '../@types/Shortcut'
import { indentActionCreator as indent } from '../actions/indent'
import attributeEquals from '../selectors/attributeEquals'
import prevSibling from '../selectors/prevSibling'
import rootedParentOf from '../selectors/rootedParentOf'
import simplifyPath from '../selectors/simplifyPath'
import head from '../util/head'
import isDocumentEditable from '../util/isDocumentEditable'
import moveCursorForward from './moveCursorForward'

// eslint-disable-next-line jsdoc/require-jsdoc, react-refresh/only-export-components
const Icon = ({ fill = 'black', size = 20, style, cssRaw }: IconType) => (
  <svg
    version='1.1'
    className={cx(icon(), css(cssRaw))}
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    fill={fill}
    style={style}
    viewBox='0 0 64 64'
    enableBackground='new 0 0 64 64'
  >
    <path d='m10 12h44c1.104 0 2-.896 2-2s-.896-2-2-2h-44c-1.104 0-2 .896-2 2s.896 2 2 2z' />
    <path d='m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z' />
    <path d='m54 19h-20c-1.104 0-2 .896-2 2s.896 2 2 2h20c1.104 0 2-.896 2-2s-.896-2-2-2z' />
    <path d='m54 30h-20c-1.104 0-2 .896-2 2s.896 2 2 2h20c1.104 0 2-.896 2-2s-.896-2-2-2z' />
    <path d='m54 41h-20c-1.104 0-2 .896-2 2s.896 2 2 2h20c1.104 0 2-.896 2-2s-.896-2-2-2z' />
    <path d='m10 34h11.172l-.005.005c-1.201 1.201-2.196 2.581-2.956 4.101-.494.988-.094 2.189.895 2.684.287.143.592.21.892.21.734 0 1.44-.404 1.791-1.105.567-1.135 1.31-2.164 2.206-3.062l3.419-3.419c.781-.781.781-2.047 0-2.828l-3.419-3.419c-.897-.898-1.64-1.928-2.206-3.061-.494-.987-1.692-1.391-2.684-.895-.987.494-1.389 1.695-.895 2.683.759 1.519 1.753 2.898 2.956 4.101l.006.005h-11.172c-1.104 0-2 .896-2 2s.896 2 2 2z' />
  </svg>
)

const indentShortcut: Shortcut = {
  id: 'indent',
  label: 'Indent',
  description: 'Indent the current thought one level deeper.',
  overlay: {
    keyboard: moveCursorForward.keyboard,
  },
  multicursor: {
    enabled: true,
    filter: 'prefer-ancestor',
    execMulticursor(cursors, dispatch, getState, e, { type }, execAll) {
      // Make sure we can execute for all cursors before proceeding.
      // This is shifted here to allow `e.preventDefault()` to work.
      const canExecute = cursors.every(cursor => {
        const path = simplifyPath(getState(), cursor)
        const parentId = head(rootedParentOf(getState(), path))
        const isTable = attributeEquals(getState(), parentId, '=view', 'Table')
        return isDocumentEditable() && (isTable || !!prevSibling(getState(), cursor))
      })

      if (!canExecute) return

      return execAll()
    },
  },
  gesture: 'rlr',
  svg: Icon,
  canExecute: getState => {
    const state = getState()
    return isDocumentEditable() && !!state.cursor
  },
  exec: dispatch => dispatch(indent()),
}

export default indentShortcut
