import {
  BACKEND_URL,
} from './constants'

export const getDiffURL = ({
                             packageName,
                             fromVersion,
                             toVersion
                           }: {
  packageName: string
  language: string
  fromVersion: string
  toVersion: string
}) => {
  return `${BACKEND_URL}/packages/json?packageName=${packageName}&version1=${fromVersion}&version2=${toVersion}`
}


interface GetBinaryFileURLProps {
  packageName: string
  language?: string
  version: string
  path: string
}

// eslint-disable-next-line no-empty-pattern
export const getBinaryFileURL = ({}: GetBinaryFileURLProps) => {

  return ``
}

export const removeAppPathPrefix = (path: string, appName = '') =>
  path.replace(new RegExp(`${appName}/`), '')

/**
 * Replaces DEFAULT_APP_PACKAGE and DEFAULT_APP_NAME in str with custom
 * values if provided.
 * str could be a path, or content from a text file.
 */
export const replaceAppDetails = (
  str: string,
  appName?: string,
  appPackage?: string
) => {
  const DEFAULT_APP_PACKAGE = '???'
  const appNameOrFallback = appName ||''
  const appPackageOrFallback =
    appPackage || `com.${appNameOrFallback.toLowerCase()}`

  return str
    .replaceAll(DEFAULT_APP_PACKAGE, appPackageOrFallback)
    .replaceAll(
      DEFAULT_APP_PACKAGE.replaceAll('.', '/'),
      appPackageOrFallback.replaceAll('.', '/')
    )
}

export const getVersionsContentInDiff = ({
                                           fromVersion,
                                           toVersion
                                         }: {
  fromVersion: string
  toVersion: string
}) => {
  return []
}

export const getChangelogURL = ({
                                  version,
                                  packageName
                                }: {
  version: string
  packageName: string
}) => {
  return ''
}

// If the browser is headless (running puppeteer) then it doesn't have any duration
export const getTransitionDuration = (duration: number) =>
  navigator.webdriver ? 0 : duration

// settings constants
export const SHOW_LATEST_RCS = 'Show latest release candidates'

/**
 * Returns the file paths to display for each side of the diff. Takes into account
 * custom app name and package, and truncates the leading app name to provide
 * paths relative to the project directory.
 */
export const getFilePathsToShow = ({
                                     oldPath,
                                     newPath,
                                   }: {
  oldPath: string
  newPath: string
}) => {
  const oldPathSanitized = replaceAppDetails(oldPath, '', '')
  const newPathSanitized = replaceAppDetails(newPath, '', '')

  return {
    oldPath: removeAppPathPrefix(oldPathSanitized, ''),
    newPath: removeAppPathPrefix(newPathSanitized, '')
  }
}
