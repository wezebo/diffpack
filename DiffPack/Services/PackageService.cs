using System.IO.Compression;
using System.Reflection;
using System.Text.Json;
using DiffPack.Models;
using DiffPlex.Renderer;
using MoreLinq.Extensions;

namespace DiffPack.Services
{
    public class PackageService
    {
        public async Task<PackageFileDiff[]> Get(string packageName, string version1, string version2)
        {
            var version1Content = await GetTarball(packageName, version1);
            var version2Content = await GetTarball(packageName, version2);
            return version1Content.FullJoin(version2Content,
                    tuple => tuple.Item1, tuple => new PackageFile {FileName = tuple.Item1, Version1 = tuple.Item2},
                    tuple => new PackageFile {FileName = tuple.Item1, Version2 = tuple.Item2},
                    (a, b) => new PackageFile {FileName = a.Item1, Version1 = a.Item2, Version2 = b.Item2}).Select(f =>
                    new PackageFileDiff()
                        {Diff = UnidiffRenderer.GenerateUnidiff(f.Version1, f.Version2), FileName = f.FileName})
                .ToArray();
        }

        private async Task<IEnumerable<(string, string)>> GetTarball(string packageName, string version)
        {
            var url = $"https://registry.npmjs.org/{packageName}";
            var http = new HttpClient();
            var metadata = await http.GetStringAsync(url);
            var json = JsonDocument.Parse(metadata);
            var latest = json.RootElement
                .GetProperty("dist-tags")
                .GetProperty("latest")
                .GetString();
            var gitUrl = json.RootElement
                .GetProperty("versions")
                .GetProperty(version == "latest" ? latest : version)
                .GetProperty("repository")
                .GetProperty("url")
                .GetString();

            var (owner, name) = ParseGitUrl(gitUrl);
            http.DefaultRequestHeaders.UserAgent.ParseAdd("DiffPack");
            var zipUrl =
                $"https://api.github.com/repos/{owner}/{name}/zipball/v{(version == "latest" ? latest : version)}";

            Directory.CreateDirectory(Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "tmp"));
            var zipBytes = await http.GetByteArrayAsync(zipUrl);
            var zipPath = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "tmp",
                $"{packageName}-{version}.zip");
            await File.WriteAllBytesAsync(zipPath, zipBytes);

            string extractDir = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "packages",
                packageName, version);
            Directory.CreateDirectory(extractDir);
            ZipFile.ExtractToDirectory(zipPath, extractDir, true);
            var files = Directory.EnumerateFiles(extractDir, "*", SearchOption.AllDirectories);
            return files.Select(f =>
            {
                var text = File.ReadAllText(f);
                return (Path.GetFileName(f), text);
            }).ToArray();
        }

        private static (string owner, string repo) ParseGitUrl(string url)
        {
            if (url.StartsWith("git+", StringComparison.OrdinalIgnoreCase))
                url = url.Substring(4);

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
                throw new ArgumentException("Invalid URL format");

            var segments = uri.AbsolutePath.Trim('/').Split('/');

            if (segments.Length < 2)
                throw new ArgumentException("URL does not contain enough path segments");

            var owner = segments[0];
            var repo = segments[1];

            if (repo.EndsWith(".git", StringComparison.OrdinalIgnoreCase))
                repo = repo.Substring(0, repo.Length - 4);

            return (owner, repo);
        }

        public async Task<string> GetAsJson(string packageName, string version1, string version2)
        {
            var url = $"https://registry.npmjs.org/{packageName}";
            var http = new HttpClient();
            var metadata = await http.GetStringAsync(url);
            var json = JsonDocument.Parse(metadata);
            var latest = json.RootElement
                .GetProperty("dist-tags")
                .GetProperty("latest")
                .GetString();
            var gitUrl = json.RootElement
                .GetProperty("versions")
                .GetProperty(version1 == "latest" ? latest : version1)
                .GetProperty("repository")
                .GetProperty("url")
                .GetString();

            var (owner, name) = ParseGitUrl(gitUrl);
            http.DefaultRequestHeaders.UserAgent.ParseAdd("DiffPack");
            //http.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github.v3.diff");
            var res= await http.GetAsync(
                $"https://api.github.com/repos/{owner}/{name}/compare/v{(version1 == "latest" ? latest : version1)}...v{(version2 == "latest" ? latest : version2)}");
            if (res.IsSuccessStatusCode)
                return await res.Content.ReadAsStringAsync();
            else
                return null;
        }
    }
}