
export const useGetPackageNameFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const packageNameFromURL = urlParams.get('package')
  const packageNames =[] as string[]

  if (!packageNameFromURL || !packageNames.includes(packageNameFromURL)) {
    return {
      packageName: '',
      isPackageNameDefinedInURL: false,
    }
  }

  return {
    packageName: packageNameFromURL,
    isPackageNameDefinedInURL: true,
  }
}
