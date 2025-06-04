import React, { Fragment, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Input } from 'antd'
import { useSearchParam } from 'react-use'
import UpgradeButton from './UpgradeButton'
import { updateURL } from '../../utils/update-url'
import { deviceSizes } from '../../utils/device-sizes'
import { useSettings } from '../../SettingsProvider'
import { SHOW_LATEST_RCS } from '../../utils'

const Selectors = styled.div`
  display: flex;
  margin-top: 32px;
  flex-direction: column;
  gap: 16px;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

const VersionSelector = ({
  packageName,
  showDiff,
}: {
  packageName?: string
  showDiff: (args: { fromVersion: string; toVersion: string }) => void
}) => {
  const fromVersion = useSearchParam('from') || ''
  const toVersion = useSearchParam('to') || ''

  const [localFromVersion, setLocalFromVersion] = useState<string>(fromVersion)
  const [localToVersion, setLocalToVersion] = useState<string>(toVersion)

  const upgradeButtonEl = useRef<HTMLAnchorElement | HTMLButtonElement>(null)

  const onShowDiff = () => {
    updateURL({
      packageName,
      fromVersion: localFromVersion,
      toVersion: localToVersion,
    })
    showDiff({
      fromVersion: localFromVersion,
      toVersion: localToVersion,
    })
  }

  return (
    <Fragment>
      <Selectors>
        <Input
          value={localFromVersion}
          placeholder="What's your current version"
          onChange={(e) => {
            setLocalFromVersion(e.target.value)
          }}
        />
        <Input
          value={localToVersion}
          placeholder="To which version would you like to upgrade"
          onChange={(e) => {
            setLocalToVersion(e.target.value)
          }}
        />
      </Selectors>

      <UpgradeButton ref={upgradeButtonEl} onShowDiff={onShowDiff} />
    </Fragment>
  )
}

export default VersionSelector
