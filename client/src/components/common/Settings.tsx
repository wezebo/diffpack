import React, { useState } from 'react'
import { Popover, Button, Checkbox, CheckboxChangeEvent } from 'antd'
import { SHOW_LATEST_RCS } from '../../utils'
import styled from '@emotion/styled'
import { useSettings } from '../../SettingsProvider'

const SettingsButton = styled(Button)`
  color: initial;
`

const SettingsIcon = styled((props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props}>⚙️</span>
))`
  font-family: initial;
`


const Settings = ({
  handleSettingsChange,
}: {
  handleSettingsChange?: (checkboxValues: string[]) => void
  packageName?: string
  language?: string
  onChangePackageNameAndLanguage?: (params: {
    newPackageName?: string
    newLanguage: string
  }) => void
}) => {
  const { settings, setSettings } = useSettings()
  const [popoverVisibility, setVisibility] = useState<boolean>(false)

  const handleClickChange = (visibility: boolean) => {
    setVisibility(visibility)

  }

  const toggleShowLatestRCs = (e: CheckboxChangeEvent) =>
    setSettings({
      ...settings,
      [SHOW_LATEST_RCS]: e.target.checked,
    })


  return (
    <Popover
      placement="bottomRight"
      content={
        <>
          <div>
            <Checkbox
              checked={settings[SHOW_LATEST_RCS]}
              onChange={toggleShowLatestRCs}
            >
              {SHOW_LATEST_RCS}
            </Checkbox>
          </div>

        </>
      }
      trigger="click"
      open={popoverVisibility}
      onOpenChange={handleClickChange}
    >
      <SettingsButton icon={<SettingsIcon />} />
    </Popover>
  )
}

export default Settings
