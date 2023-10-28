import _ from 'lodash'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Alert from '../@types/Alert'
import Shortcut from '../@types/Shortcut'
import State from '../@types/State'
import alertActionCreator from '../action-creators/alert'
import commandPalette from '../action-creators/commandPalette'
import { deleteResumableFile } from '../action-creators/importFiles'
import GestureDiagram from '../components/GestureDiagram'
import { AlertType, GESTURE_CANCEL_ALERT_TEXT } from '../constants'
import useSwipeToDismiss from '../hooks/useSwipeToDismiss'
import themeColors from '../selectors/themeColors'
import { gestureString, globalShortcuts } from '../shortcuts'
import syncStatusStore from '../stores/syncStatus'
import fastClick from '../util/fastClick'
import CommandPalette from './CommandPalette'

interface AlertProps {
  alert?: Alert | null
  onClose: () => void
}

/** Renders a GestureDiagram and its label as a hint during a MultiGesture. */
const ShortcutGestureHint = ({
  gestureInProgress,
  keyboardInProgress,
  onClick,
  onHover,
  selected,
  shortcut,
  style,
}: {
  gestureInProgress: string
  keyboardInProgress: string
  onClick: (e: React.MouseEvent, shortcut: Shortcut) => void
  onHover: (e: MouseEvent, shortcut: Shortcut) => void
  selected?: boolean
  shortcut: Shortcut
  style?: React.CSSProperties
}) => {
  const store = useStore()
  const ref = React.useRef<HTMLDivElement>(null)
  const colors = useSelector(themeColors)
  const highlightIndexStart = shortcut.label.toLowerCase().indexOf(keyboardInProgress.toLowerCase())
  const highlightIndexEnd = highlightIndexStart + keyboardInProgress.length
  const disabled = shortcut.canExecute && !shortcut.canExecute?.(store.getState)
  const showCommandPalette = useSelector((state: State) => state.showCommandPalette)

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ block: 'nearest' })
    }
  })

  useEffect(() => {
    /** Hover handler. */
    const onHoverShortcut = (e: MouseEvent) => onHover(e, shortcut)

    // mouseover and mouseenter cause the command under the cursor to get selected on render, so we use mousemove to ensure that it only gets selected on an actual hover
    ref.current?.addEventListener('mousemove', onHoverShortcut)

    return () => {
      ref.current?.removeEventListener('mousemove', onHoverShortcut)
    }
  }, [])

  return (
    <div
      ref={ref}
      onClick={e => {
        if (!disabled) {
          onClick(e, shortcut)
        }
      }}
      style={{
        cursor: !disabled ? 'pointer' : undefined,
        paddingBottom: 10,
        paddingLeft: selected ? 'calc(1em - 10px)' : '1em',
        position: 'relative',
        textAlign: 'left',
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: selected ? '#212121' : undefined,
          padding: selected ? 10 : undefined,
        }}
      >
        {gestureInProgress && (
          <GestureDiagram
            color={disabled ? colors.gray : undefined}
            highlight={!disabled ? gestureInProgress.length : undefined}
            path={gestureString(shortcut)}
            strokeWidth={4}
            style={{
              position: 'absolute',
              left: selected ? '-1.75em' : '-2.2em',
              top: selected ? '-0.2em' : '-0.75em',
            }}
            width={45}
            height={45}
          />
        )}
        <span
          style={{
            color: disabled ? colors.gray : gestureInProgress === shortcut.gesture ? colors.vividHighlight : colors.fg,
          }}
        >
          {shortcut.label.slice(0, highlightIndexStart)}
          <span style={{ color: !disabled ? colors.vividHighlight : undefined }}>
            {shortcut.label.slice(highlightIndexStart, highlightIndexEnd)}
          </span>
          {shortcut.label.slice(highlightIndexEnd)}
        </span>
        {selected && (
          <span
            style={{
              fontSize: '80%',
              ...(showCommandPalette
                ? {
                    marginLeft: 20,
                  }
                : {
                    display: 'block',
                  }),
            }}
          >
            {shortcut.description}
          </span>
        )}
      </div>
    </div>
  )
}

/** Render an extended gesture hint with embedded GestureDiagrams. Handled here to avoid creating a HOC or cause AppComponent to re-render too frequently. This could be separated into a HOC or hook if needed. */
const ExtendedGestureHint: FC = () => {
  const store = useStore()
  const alert = useSelector((state: State) => state.alert)
  const showCommandPalette = useSelector((state: State) => state.showCommandPalette)
  const fontSize = useSelector((state: State) => state.fontSize)
  const [keyboardInProgress, setKeyboardInProgress] = useState('')
  const show = alert?.value || showCommandPalette

  // when the extended gesture hint is activated, the alert value is co-opted to store the gesture that is in progress
  const gestureInProgress = alert?.value === '*' ? '' : alert?.value || ''

  // get the shortcuts that can be executed from the current gesture in progress
  const possibleShortcutsSorted = useMemo(() => {
    if (!show) return []

    const possibleShortcuts = globalShortcuts.filter(
      shortcut =>
        !shortcut.hideFromCommandPalette &&
        !shortcut.hideFromInstructions &&
        (showCommandPalette
          ? // keyboard
            shortcut.label.toLowerCase().includes(keyboardInProgress.toLowerCase())
          : // gesture
            shortcut.gesture && gestureString(shortcut).startsWith(gestureInProgress)),
    )

    // sorted shortcuts
    const sorted = _.sortBy(possibleShortcuts, shortcut =>
      [
        // canExecute
        !shortcut.canExecute || shortcut.canExecute?.(store.getState) ? 0 : 1,
        // gesture length
        gestureInProgress ? shortcut.gesture?.length : '',
        // label that starts with keyboardInProgress
        shortcut.label.toLowerCase().startsWith(keyboardInProgress.toLowerCase()) ? 0 : 1,
        // label
        shortcut.label,
      ].join('\x00'),
    )
    return sorted
  }, [gestureInProgress, keyboardInProgress, showCommandPalette])

  const [selectedShortcut, setSelectedShortcut] = useState<Shortcut>(possibleShortcutsSorted[0])

  /** Handler for command palette selection. */
  const onExecute = useCallback(
    (e: React.MouseEvent<Element, MouseEvent> | KeyboardEvent, shortcut: Shortcut) => {
      setTimeout(() => {
        if (!shortcut.canExecute || shortcut.canExecute?.(store.getState)) {
          e.stopPropagation()
          e.preventDefault()
          store.dispatch(commandPalette())
          shortcut.exec(store.dispatch, store.getState, e, { type: 'commandPalette' })
        }
      })
    },
    [possibleShortcutsSorted],
  )

  // Select the first shortcut when the input changes.
  // For some reason onInput retains an old reference to possibleShortcutsSorted .
  useEffect(() => {
    setSelectedShortcut(possibleShortcutsSorted[0])
  }, [keyboardInProgress])

  return (
    <div
      style={{
        ...(show ? { paddingLeft: '4em', paddingRight: '4em' } : null),
        marginBottom: fontSize,
        textAlign: 'left',
      }}
    >
      {showCommandPalette || (alert?.value && possibleShortcutsSorted.length > 0) ? (
        <div>
          <h2
            style={{
              marginTop: 0,
              marginBottom: '1em',
              marginLeft: -fontSize * 1.8,
              paddingLeft: 5,
              borderBottom: 'solid 1px gray',
            }}
          >
            {showCommandPalette ? (
              <CommandPalette
                onExecute={e => onExecute(e, selectedShortcut)}
                onInput={setKeyboardInProgress}
                onSelectDown={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedShortcut(selectedShortcut => {
                    const i = possibleShortcutsSorted.indexOf(selectedShortcut)
                    return possibleShortcutsSorted[i === possibleShortcutsSorted.length - 1 ? 0 : i + 1]
                  })
                }}
                onSelectUp={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSelectedShortcut(selectedShortcut => {
                    const i = possibleShortcutsSorted.indexOf(selectedShortcut)
                    return possibleShortcutsSorted[i === 0 ? possibleShortcutsSorted.length - 1 : i - 1]
                  })
                }}
              />
            ) : (
              'Gestures'
            )}
          </h2>

          <div
            style={{
              marginLeft: showCommandPalette ? '-2.4em' : '-1.2em',
              ...(showCommandPalette ? { maxHeight: 'calc(100vh - 8em)', overflow: 'auto' } : null),
            }}
          >
            {possibleShortcutsSorted.map(shortcut => (
              <ShortcutGestureHint
                keyboardInProgress={keyboardInProgress}
                gestureInProgress={gestureInProgress}
                key={shortcut.id}
                onClick={onExecute}
                onHover={(e, shortcut) => setSelectedShortcut(shortcut)}
                selected={showCommandPalette ? shortcut === selectedShortcut : gestureInProgress === shortcut.gesture}
                shortcut={shortcut}
              />
            ))}
            {possibleShortcutsSorted.length === 0 && <span style={{ marginLeft: '1em' }}>No matching commands</span>}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>{GESTURE_CANCEL_ALERT_TEXT}</div>
      )}
    </div>
  )
}

/** An alert component that fades in and out. */
const AlertWithTransition: FC = ({ children }) => {
  const [isDismissed, setDismiss] = useState(false)
  const dispatch = useDispatch()
  const alert = useSelector((state: State) => state.alert)
  const showCommandPalette = useSelector((state: State) => state.showCommandPalette)

  /** Dismiss the alert on close. */
  const onClose = () => {
    setDismiss(true)
    dispatch(alertActionCreator(null))
  }

  // if dismissed, set timeout to 0 to remove alert component immediately. Otherwise it will block toolbar interactions until the timeout completes.
  return (
    <TransitionGroup childFactory={child => (!isDismissed ? child : React.cloneElement(child, { timeout: 0 }))}>
      {alert || showCommandPalette ? (
        <CSSTransition key={0} timeout={800} classNames='fade' onEntering={() => setDismiss(false)}>
          {/* Specify a key to force the component to re-render and thus recalculate useSwipeToDismissProps when the alert changes. Otherwise the alert gets stuck off screen in the dismiss state. */}
          <AlertComponent alert={alert} onClose={onClose} key={alert?.value}>
            {alert?.alertType === AlertType.GestureHintExtended || showCommandPalette ? (
              <ExtendedGestureHint />
            ) : (
              children
            )}
          </AlertComponent>
        </CSSTransition>
      ) : null}
    </TransitionGroup>
  )
}

/** The alert component itself. Separate so that a key property can be used to force a reset of useSwipeToDismissProps. */
const AlertComponent: FC<AlertProps> = ({ alert, onClose, children }) => {
  const dispatch = useDispatch()
  const colors = useSelector(themeColors)
  const fontSize = useSelector((state: State) => state.fontSize)
  const showCommandPalette = useSelector((state: State) => state.showCommandPalette)
  const useSwipeToDismissProps = useSwipeToDismiss({
    ...(alert?.isInline ? { dx: '-50%' } : null),
    // dismiss after animation is complete to avoid touch events going to the Toolbar
    onDismissEnd: () => {
      dispatch(alertActionCreator(null))
    },
  })

  if (!alert && !showCommandPalette) return null

  return (
    <div
      className='alert z-index-alert'
      {...(alert && alert.alertType !== AlertType.GestureHintExtended ? useSwipeToDismissProps : null)}
      // merge style with useSwipeToDismissProps.style (transform, transition, and touchAction for sticking to user's touch)
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        // scale with font size to stay vertically centered over toolbar
        padding: `${fontSize / 2 + 2}px 0 1em`,
        color: colors.gray50,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
        /* if inline, leave room on the left side so the user can click undo/redo */
        ...(alert?.isInline ? { left: '50%', width: 'auto' } : null),
        ...(!children ? { textAlign: 'center' } : null),
        ...(alert && alert.alertType !== AlertType.GestureHintExtended ? useSwipeToDismissProps.style : null),
      }}
    >
      <div
        className='alert-text'
        style={{ padding: '0.25em 0.5em', backgroundColor: colors.bgOverlay80 }}
        dangerouslySetInnerHTML={!children ? { __html: alert?.value || '' } : undefined}
      >
        {children}
      </div>
      {alert?.importFileId && (
        <a
          onClick={() => {
            deleteResumableFile(alert.importFileId!)
            syncStatusStore.update({ importProgress: 1 })
            onClose()
          }}
        >
          cancel
        </a>
      )}
      {alert?.showCloseLink ? (
        <a className='upper-right status-close-x text-small no-swipe-to-dismiss' {...fastClick(onClose)}>
          ✕
        </a>
      ) : null}
    </div>
  )
}

export default AlertWithTransition
