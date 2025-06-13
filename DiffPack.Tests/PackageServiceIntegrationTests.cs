using DiffPack.Services;

namespace DiffPack.Tests
{
    public class PackageServiceIntegrationTests
    {
        [Fact]
        public async Task Get_ForKnownPackage_ReturnsFileDiffs()
        {
            var service = new PackageService();
            var result = await service.Get("vue", "3.5.15", "3.5.16");
            Assert.NotEmpty(result);
            Assert.All(result, r => Assert.NotNull(r.Diff));
        }

        [Fact]
        public async Task GetAsJson_ForKnownPackage_ReturnsNonEmptyDiff()
        {
            var service = new PackageService();
            var diffJson = await service.GetAsJson("vue", "3.5.12", "3.5.16");
            Assert.NotNull(diffJson);
            Assert.NotEmpty(diffJson);
        }
    }
}