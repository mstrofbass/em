import path from 'path'
import configureSnapshots from '../configureSnapshots'
import helpers from '../helpers'

const testFileName = path.basename(__filename).replace('.ts', '')
expect.extend({
  toMatchImageSnapshot: configureSnapshots({ fileName: testFileName }),
})

vi.setConfig({ testTimeout: 60000, hookTimeout: 20000 })

const { openModal, screenshot } = helpers()

// TODO: Why does styled-system not load from dev server?
it.skip('modal', async () => {
  await openModal('customizeToolbar')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-customizeToolbar' })

  await openModal('devices')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-devices' })

  await openModal('export')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-export' })

  await openModal('help')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-help' })

  await openModal('settings')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-settings' })

  await openModal('welcome')
  expect(await screenshot()).toMatchImageSnapshot({ customSnapshotIdentifier: 'modal-welcome' })
})
