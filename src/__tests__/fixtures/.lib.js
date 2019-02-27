import crossSpawnMock from 'cross-spawn'

const crossEnv = require('../../')

export const assignEnv = (...args) => {
  const origin = process.env.CROSS_ENV_TEST_CONFIG_FILE
    ? {
        FROM_CROSS_ENV_JS: 'true',
      }
    : {}

  return Object.assign(origin, ...args)
}

export function testEnvSetting(expect, expected, ...envSettings) {
  if (expected.APPDATA === 2) {
    // kill the APPDATA to test both is undefined
    const {env} = process
    delete env.APPDATA
    delete expected.APPDATA
  } else if (!process.env.APPDATA && expected.APPDATA === '0') {
    // set APPDATA and test it
    process.env.APPDATA = '0'
  }
  const ret = crossEnv([...envSettings, 'echo', 'hello world'])
  const env = {}
  if (process.env.APPDATA) {
    env.APPDATA = process.env.APPDATA
  }
  Object.assign(env, expected)
  expect(ret).toBe(crossSpawnMock.__mock.spawned)
  expect(crossSpawnMock.spawn).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.spawn).toHaveBeenCalledWith('echo', ['hello world'], {
    stdio: 'inherit',
    shell: undefined,
    env: assignEnv(process.env, env),
  })

  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledTimes(1)
  expect(crossSpawnMock.__mock.spawned.on).toHaveBeenCalledWith(
    'exit',
    expect.any(Function),
  )
}
