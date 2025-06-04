export function updateURL(
  {
    packageName,
    fromVersion,
    toVersion
  }: {
    packageName?: string
    fromVersion?: string
    toVersion?: string
  }
) {
  const url = new URL(window.location.href)

  if (fromVersion) {
    url.searchParams.set('from', fromVersion)
  }
  if (toVersion) {
    url.searchParams.set('to', toVersion)
  }
  if (packageName) {
    url.searchParams.set('package', packageName)
  }
  if (window.location.href !== url.toString()) {
    window.history.pushState('', '', url.toString())

    dispatchEvent(new PopStateEvent('popstate'))
  }
}
