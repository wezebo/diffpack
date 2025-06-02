using System.IO.Compression;
using System.Reflection;
using System.Text.Json;
using DiffPack.Models;
using DiffPack.Services;
using DiffPlex.Renderer;
using MoreLinq;
using StackExchange.Redis;

namespace DiffPack
{
    public class PackagesController
    {
        private readonly PackageService _packageService;
        private readonly IConnectionMultiplexer _connectionMultiplexer;

        public PackagesController(IConnectionMultiplexer connectionMultiplexer, PackageService packageService)
        {
            _packageService = packageService;
            _connectionMultiplexer = connectionMultiplexer;
        }

        public async Task<PackageFileDiff[]> Get(string packageName, string version1, string version2)
        {
            var redis = _connectionMultiplexer.GetDatabase();
            if (redis.KeyExists($"{packageName}-{version1}-{version2}"))
                return JsonSerializer.Deserialize<PackageFileDiff[]>(
                    redis.StringGet($"{packageName}-{version1}-{version2}")!)!;
            var result = await _packageService.Get(packageName, version1, version2);
            redis.StringSet($"{packageName}-{version1}-{version2}", JsonSerializer.Serialize(result));
            return result;
        }


        public async Task<string> GetAsJson(string packageName, string version1, string version2)
        {
            return await _packageService.GetAsJson(packageName, version1, version2);
        }
    }
}