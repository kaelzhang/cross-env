import {join} from 'path'
import crossSpawnMock from 'cross-spawn'

import {testEnvSetting} from './fixtures/.lib'

process.chdir(join(__dirname, 'fixtures'))
process.env.CROSS_ENV_TEST_CONFIG_FILE = 1

beforeEach(() => {
  crossSpawnMock.__mock.reset()
})

// @ostai/cross-env
it(`should contains environment variables from .cross-env.js`, () => {
  testEnvSetting(
    expect,
    {
      FOO_ENV: 'production',
      FROM_CROSS_ENV_JS: 'true',
    },
    'FOO_ENV=production',
  )
})
