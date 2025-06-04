import { useEffect, useState } from 'react'
import { parseDiff } from 'react-diff-view'
import type { File } from 'gitdiff-parser'
import { getDiffURL } from '../utils'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

interface UseFetchDiffProps {
  shouldShowDiff: boolean
  packageName: string
  language: string
  fromVersion: string
  toVersion: string
}

export interface FileDiff {
  sha: string
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  blob_url: string
  raw_url: string
  contents_url: string
  patch: string
}

export const useFetchDiff = ({
  shouldShowDiff,
  packageName,
  language,
  fromVersion,
  toVersion,
}: UseFetchDiffProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDone, setIsDone] = useState<boolean>(false)
  const [diff, setDiff] = useState<File[] | Error>([])

  useEffect(() => {
    const fetchDiff = async () => {
      try {
        setIsLoading(true)
        setIsDone(false)
        const [response] = await Promise.all([
          fetch(
            getDiffURL({
              packageName,
              language,
              fromVersion,
              toVersion,
            })
          ),
          delay(300),
        ])

        const res = (await response.json()) as {
          files: FileDiff[]
        }

        let diff = ''
        for (const file of res.files) {
          if (file.patch) {
            diff += `diff --git a/${file.filename} b/${file.filename}\n`
            switch (file.status) {
              case 'added':
                diff += `new file mode 100644\n`
                diff += `--- /dev/null\n`
                diff += `+++ b/${file.filename}\n`
                break
              case 'removed':
                diff += `deleted file mode 100644\n`
                diff += `--- a/${file.filename}\n`
                diff += `+++ /dev/null\n`
                break
              default:
                diff += `index ${file.sha}..${file.sha} 100644\n`
                diff += `--- a/${file.filename}\n`
                diff += `+++ b/${file.filename}\n`
                break
            }
            diff += file.patch
            diff += '\n'
          }
        }

        setDiff(applyBackstageDiff(response, parseDiff(diff)))

      } catch (e) {
        console.log(e)
        setDiff(new Error('Failed to fetch diff. Please try again later.'))
      }
      setIsLoading(false)
      setIsDone(true)
    }

    if (shouldShowDiff) {
      debounce(fetchDiff, 500)()
    }
  }, [shouldShowDiff, packageName, language, fromVersion, toVersion])

  return {
    isLoading,
    isDone,
    diff,
  }
}

function applyBackstageDiff(response: Response, parsedDiff: File[]) {
  if (response.status === 404) {
    return new Error('Diff not found. Please reach out to the maintainers.')
  }

  return parsedDiff
}
