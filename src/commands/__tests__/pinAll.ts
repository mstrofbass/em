import { importTextActionCreator as importText } from '../../actions/importText'
import { HOME_TOKEN } from '../../constants'
import exportContext from '../../selectors/exportContext'
import createTestStore from '../../test-helpers/createTestStore'
import { setCursorFirstMatchActionCreator as setCursor } from '../../test-helpers/setCursorFirstMatch'
import executeCommand from '../../util/executeCommand'
import pinAllShortcut from '../pinAll'

it('toggle on when there is no =children attribute', async () => {
  const store = await createTestStore()

  // import thoughts
  store.dispatch([
    importText({
      text: `
        - a
          - b
            - c
            - d
          - e
            - f
            - g
    `,
    }),
    setCursor(['a', 'b']),
  ])

  executeCommand(pinAllShortcut, { store })

  const exported = exportContext(store.getState(), [HOME_TOKEN], 'text/plain')
  expect(exported).toEqual(`- __ROOT__
  - a
    - =children
      - =pin
        - true
    - b
      - c
      - d
    - e
      - f
      - g`)
})

it('toggle on when =children/=pin is false', async () => {
  const store = await createTestStore()

  // import thoughts
  store.dispatch([
    importText({
      text: `
        - a
          - =children
            - =pin
              - false
          - b
            - c
            - d
          - e
            - f
            - g
    `,
    }),
    setCursor(['a', 'b']),
  ])

  executeCommand(pinAllShortcut, { store })

  const exported = exportContext(store.getState(), [HOME_TOKEN], 'text/plain')
  expect(exported).toEqual(`- __ROOT__
  - a
    - =children
      - =pin
        - true
    - b
      - c
      - d
    - e
      - f
      - g`)
})

it('remove =children when toggling off from =pin/true', async () => {
  const store = await createTestStore()

  // import thoughts
  store.dispatch([
    importText({
      text: `
        - a
          - =children
            - =pin
              - true
          - b
            - c
            - d
          - e
            - f
            - g
    `,
    }),
    setCursor(['a', 'b']),
  ])

  executeCommand(pinAllShortcut, { store })

  const exported = exportContext(store.getState(), [HOME_TOKEN], 'text/plain')
  expect(exported).toEqual(`- __ROOT__
  - a
    - b
      - c
      - d
    - e
      - f
      - g`)
})

it('remove =children when toggling off from =pin', async () => {
  const store = await createTestStore()

  // import thoughts
  store.dispatch([
    importText({
      text: `
        - a
          - =children
            - =pin
          - b
            - c
            - d
          - e
            - f
            - g
    `,
    }),
    setCursor(['a', 'b']),
  ])

  executeCommand(pinAllShortcut, { store })

  const exported = exportContext(store.getState(), [HOME_TOKEN], 'text/plain')
  expect(exported).toEqual(`- __ROOT__
  - a
    - b
      - c
      - d
    - e
      - f
      - g`)
})

it('remove =pin/false from all subthoughts when toggling on', async () => {
  const store = await createTestStore()

  store.dispatch([
    importText({
      text: `
        - a
          - b
            - =pin
              - false
            - c
            - d
          - e
            - =pin
              - false
            - f
            - g
          - h
            - i
            - j
    `,
    }),
    setCursor(['a', 'b']),
  ])

  executeCommand(pinAllShortcut, { store })

  const exported = exportContext(store.getState(), [HOME_TOKEN], 'text/plain')
  expect(exported).toEqual(`- __ROOT__
  - a
    - =children
      - =pin
        - true
    - b
      - c
      - d
    - e
      - f
      - g
    - h
      - i
      - j`)
})
