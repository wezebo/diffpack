import React, { useState } from 'react'
import { Typography } from 'antd'
import styled from '@emotion/styled'
import Diff from './Diff'
import type { File } from 'gitdiff-parser'
import type { ChangeEventArgs, ViewType } from 'react-diff-view'

export const testIDs = {
  diffSection: 'diffSection',
}

const Title = styled(Typography.Title)`
  margin-top: 0.5em;
`

interface DiffSectionProps {
  packageName: string
  diff: any
  getDiffKey: (file: File) => string
  title?: string
  completedDiffs: string[]
  isDoneSection: boolean
  fromVersion: string
  toVersion: string
  handleCompleteDiff: (diffKey: string) => void
  selectedChanges: string[]
  onToggleChangeSelection: (args: ChangeEventArgs) => void
  diffViewStyle: ViewType
  appName: string
  appPackage: string
  doneTitleRef?: React.RefObject<HTMLHeadingElement>
}

const DiffSection = ({
  packageName,
  diff,
  getDiffKey,
  title,
  completedDiffs,
  isDoneSection,
  fromVersion,
  toVersion,
  handleCompleteDiff,
  selectedChanges,
  onToggleChangeSelection,
  diffViewStyle,
  appName,
  appPackage,
  doneTitleRef,
}: DiffSectionProps) => {
  const [areAllCollapsed, setAllCollapsed] = useState<boolean | undefined>(
    undefined
  )

  return (
    <div data-testid={testIDs.diffSection}>
      {title && completedDiffs.length > 0 && (
        <Title ref={doneTitleRef} level={2}>
          {title}
        </Title>
      )}

      {diff.map((diffFile: File, index: number) => {
        const diffKey = getDiffKey(diffFile)
        const isDiffCompleted = completedDiffs.includes(diffKey)

        // If it's the "done" section, it shouldn't show if it's not completed
        if (isDoneSection !== isDiffCompleted) {
          return null
        }

        return (
          <Diff
            key={diffKey + index}
            {...diffFile}
            packageName={packageName}
            // otakustay/react-diff-view#49
            // @ts-ignore-next-line
            type={diffFile.type === 'new' ? 'add' : diffFile.type}
            diffKey={diffKey}
            diffViewStyle={diffViewStyle}
            fromVersion={fromVersion}
            toVersion={toVersion}
            isDiffCompleted={completedDiffs.includes(diffKey)}
            onCompleteDiff={handleCompleteDiff}
            selectedChanges={selectedChanges}
            onToggleChangeSelection={onToggleChangeSelection}
            areAllCollapsed={areAllCollapsed}
            setAllCollapsed={setAllCollapsed}
            appName={appName}
            appPackage={appPackage}
          />
        )
      })}
    </div>
  )
}

export default DiffSection
