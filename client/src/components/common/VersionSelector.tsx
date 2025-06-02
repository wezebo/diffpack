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
  language?: string
  isPackageNameDefinedInURL: boolean
  showDiff: (args: { fromVersion: string; toVersion: string }) => void
  showReleaseCandidates?: boolean
  appPackage?: string
  appName?: string
}) => {
  const {
    settings: { [SHOW_LATEST_RCS]: showReleaseCandidates },
  } = useSettings()

  // const [allVersions, setAllVersions] = useState<ReleaseT[]>([])
  // const [fromVersionList, setFromVersionList] = useState<ReleaseT[]>([])
  // const [toVersionList, setToVersionList] = useState<ReleaseT[]>([])
  // const [hasVersionsFromURL, setHasVersionsFromURL] = useState<boolean>(false)
  //
  const fromVersion = useSearchParam('from') || ''
  const toVersion = useSearchParam('to') || ''

  const [localFromVersion, setLocalFromVersion] = useState<string>(fromVersion)
  const [localToVersion, setLocalToVersion] = useState<string>(toVersion)

  const upgradeButtonEl = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  // const { isDone, isLoading, releases, setSelectedVersions } = useReleases()
  // const releaseVersions = useMemo(
  //   () => releases?.map(({ version }) => version),
  //   [releases]
  // )

  // useEffect(() => {
  //   // const versionsInURL = getVersionsInURL()
  //
  //   const fetchVersions = async () => {
  //     // Check if the versions provided in the URL are valid
  //     const hasFromVersionInURL = doesVersionExist({
  //       version: fromVersion,
  //       allVersions: releaseVersions,
  //     })
  //
  //     const hasToVersionInURL = doesVersionExist({
  //       version: toVersion,
  //       allVersions: releaseVersions,
  //       minVersion: fromVersion,
  //     })
  //
  //     const latestVersion = releaseVersions[0]
  //     // If the version from URL is not valid then fallback to the latest
  //     const toVersionToBeSet = hasToVersionInURL ? toVersion : latestVersion
  //
  //     // Remove `rc` versions from the array of versions
  //     const sanitizedVersionsWithReleases = getReleasedVersionsWithCandidates({
  //       releasedVersions: releases,
  //       toVersion: toVersionToBeSet,
  //       latestVersion,
  //       showReleaseCandidates,
  //     })
  //
  //     const sanitizedVersions = sanitizedVersionsWithReleases.map(
  //       ({ version }) => version
  //     )
  //
  //     setAllVersions(sanitizedVersionsWithReleases)
  //
  //     const fromVersionToBeSet = hasFromVersionInURL
  //       ? fromVersion
  //       : // Get first major release before latest
  //         getFirstRelease(
  //           {
  //             releasedVersions: sanitizedVersions,
  //             versionToCompare: toVersionToBeSet,
  //           },
  //           'minor'
  //         ) ||
  //         getFirstRelease(
  //           {
  //             releasedVersions: sanitizedVersions,
  //             versionToCompare: toVersionToBeSet,
  //           },
  //           'patch'
  //         )
  //
  //     setFromVersionList(
  //       getReleasedVersions({
  //         releasedVersions: sanitizedVersionsWithReleases,
  //         maxVersion: toVersionToBeSet,
  //       })
  //     )
  //     setToVersionList(
  //       getReleasedVersions({
  //         releasedVersions: sanitizedVersionsWithReleases,
  //         minVersion: fromVersionToBeSet,
  //       })
  //     )
  //
  //     setLocalFromVersion(fromVersionToBeSet ?? '')
  //     setLocalToVersion(toVersionToBeSet)
  //
  //     const doesHaveVersionsInURL = hasFromVersionInURL && hasToVersionInURL
  //
  //     setHasVersionsFromURL(!!doesHaveVersionsInURL)
  //   }
  //
  //   if (isDone) {
  //     fetchVersions()
  //   }
  // }, [
  //   fromVersion,
  //   toVersion,
  //   isDone,
  //   releaseVersions,
  //   setLocalFromVersion,
  //   setLocalToVersion,
  //   showReleaseCandidates,
  // ])
  //
  // useEffect(() => {
  //   if (isLoading) {
  //     return
  //   }
  //
  //   setFromVersionList(
  //     getReleasedVersions({
  //       releasedVersions: allVersions,
  //       maxVersion: localToVersion,
  //     })
  //   )
  //   setToVersionList(
  //     getReleasedVersions({
  //       releasedVersions: allVersions,
  //       minVersion: localFromVersion,
  //     })
  //   )
  //
  //   if (hasVersionsFromURL) {
  //     upgradeButtonEl?.current?.click()
  //   }
  // }, [
  //   isLoading,
  //   allVersions,
  //   localFromVersion,
  //   localToVersion,
  //   hasVersionsFromURL,
  //   showReleaseCandidates,
  // ])

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
        {/*<FromVersionSelector*/}
        {/*  showSearch*/}
        {/*  data-testid={testIDs.fromVersionSelector}*/}
        {/*  title={`What's your current version?`}*/}
        {/*  loading={isLoading}*/}
        {/*  value={localFromVersion}*/}
        {/*  options={fromVersionList}*/}
        {/*  onChange={(chosenVersion) =>*/}
        {/*    stripAnchorInUrl() && setLocalFromVersion(chosenVersion)*/}
        {/*  }*/}
        {/*/>*/}

        {/*<ToVersionSelector*/}
        {/*  showSearch*/}
        {/*  data-testid={testIDs.toVersionSelector}*/}
        {/*  title="To which version would you like to upgrade?"*/}
        {/*  loading={isLoading}*/}
        {/*  value={localToVersion}*/}
        {/*  options={toVersionList}*/}
        {/*  popover={*/}
        {/*    localToVersion === '0.60.1' && (*/}
        {/*      <Popover*/}
        {/*        open={true}*/}
        {/*        placement="topLeft"*/}
        {/*        content="We recommend using the latest 0.60 patch release instead of 0.60.1."*/}
        {/*      />*/}
        {/*    )*/}
        {/*  }*/}
        {/*  onChange={(chosenVersion) =>*/}
        {/*    stripAnchorInUrl() && setLocalToVersion(chosenVersion)*/}
        {/*  }*/}
        {/*/>*/}
      </Selectors>

      <UpgradeButton ref={upgradeButtonEl} onShowDiff={onShowDiff} />
    </Fragment>
  )
}

export default VersionSelector


