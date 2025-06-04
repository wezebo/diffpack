import React, { ComponentProps, useState } from 'react'
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react'
import { Card, ConfigProvider, Input, theme } from 'antd'
import VersionSelector from '../common/VersionSelector'
import DiffViewer, { DiffViewerProps } from '../common/DiffViewer'
import { deviceSizes } from '../../utils/device-sizes'
import { lightTheme, type Theme } from '../../theme'
import { SettingsProvider } from '../../SettingsProvider'

const homepage = '/'

const Page = styled.div<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
`

const Container2 = styled.div`
  padding: 0 16px;
`
const Container = styled(Card)<{ theme?: Theme }>`
  background-color: ${({ theme }) => theme.background};
  width: 90%;
  border-radius: 3px;
  border-color: ${({ theme }) => theme.border};
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

const TitleHeader = styled.h1`
  margin: 0 0 0 15px;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const Home = () => {
  const [packageName, setPackageName] = useState('')
  const [fromVersion, setFromVersion] = useState('')
  const [toVersion, setToVersion] = useState('')
  const [shouldShowDiff, setShouldShowDiff] = useState(false)

  const handleShowDiff = ({
    fromVersion,
    toVersion,
  }: {
    fromVersion: string
    toVersion: string
  }) => {
    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShouldShowDiff(true)
  }

  return (
    <SettingsProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <ThemeProvider theme={lightTheme}>
          <Page>
            <Container>
              <HeaderContainer>
                <TitleContainer>
                  <a href={homepage}>
                    <TitleHeader>Choose your package</TitleHeader>
                  </a>
                </TitleContainer>
                <Container2>
                  <Input
                    value={packageName}
                    onChange={(e) => {
                      setPackageName(e.target.value)
                    }}
                  />
                </Container2>
              </HeaderContainer>

              <VersionSelector
                key={packageName}
                showDiff={handleShowDiff}
                packageName={packageName}
              />
            </Container>
            <BackstageDiffViewer
              //@ts-expect-error - the component prop type is messed up
              shouldShowDiff={shouldShowDiff}
              fromVersion={fromVersion}
              toVersion={toVersion}
              packageName={packageName}
            />
          </Page>
        </ThemeProvider>
      </ConfigProvider>
    </SettingsProvider>
  )
}

function BackstageDiffViewer(props: ComponentProps<typeof DiffViewer>) {
  const { fromVersion, toVersion } = props as unknown as DiffViewerProps

  if (fromVersion && fromVersion === toVersion) {
    return (
      <div style={{ textAlign: 'center', width: '90%' }}>
        <p>
          The selected versions share the same dependencies. This usually
          happens when a patch for one of the dependencies is released.
        </p>
        <p>Please refer to the to see what has changed.</p>
      </div>
    )
  }
  return <DiffViewer {...props} />
}

export default Home
