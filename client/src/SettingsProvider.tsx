import React, { ReactNode, useContext, useEffect } from 'react'
import useLocalStorage from 'react-use/lib/useLocalStorage'
import useSearchParam from 'react-use/lib/useSearchParam'

import { SHOW_LATEST_RCS } from './utils'
import { updateURL } from './utils/update-url'

interface SETTINGS {
  [SHOW_LATEST_RCS]: boolean
}

type State = {
  settings: SETTINGS
  setSettings(settings: SETTINGS): void
}
const INITIAL_STATE: State = {
  settings: {
    [`${SHOW_LATEST_RCS}`]: false,
  },
  setSettings: () => {},
}

export const SettingsContext = React.createContext(INITIAL_STATE)

export const SettingsProvider = React.memo(function ({
  children,
}: {
  children: ReactNode
}) {
  const useYarnPluginParam = useSearchParam('yarnPlugin')
  const shouldPopulateYarnPluginParam = useYarnPluginParam === null
  const useYarnPlugin = !shouldPopulateYarnPluginParam
    ? !!Number(useYarnPluginParam)
    : false

  const [settings, setLocalStorageSettings] = useLocalStorage(
    'backstage:upgrade-helper:settings',
    INITIAL_STATE.settings
  )

  const setSettings = (settings: SETTINGS) => {
    const { ...localStorageSettings } = settings

    setLocalStorageSettings({
      ...localStorageSettings,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          ...settings!,
        },
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
})

export const useSettings = () => useContext(SettingsContext)
