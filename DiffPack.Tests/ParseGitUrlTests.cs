using DiffPack.Services;
using System.Reflection;

public class ParseGitUrlTests
{
    private (string, string) InvokeParseGitUrl(string url)
    {
        var type = typeof(PackageService);
        var method = type.GetMethod("ParseGitUrl", 
            BindingFlags.NonPublic | BindingFlags.Static);
        
        return ((string, string))method.Invoke(null, [url]);
    }

    [Theory]
    [InlineData("git+https://github.com/owner/repo.git", "owner", "repo")]
    [InlineData("https://github.com/owner/repo.git", "owner", "repo")]
    [InlineData("http://github.com/owner/repo.git", "owner", "repo")]
    [InlineData("https://gitlab.com/owner/repo.git", "owner", "repo")]
    [InlineData("https://example.com/owner/repo-name.git", "owner", "repo-name")]
    public void ValidUrls_ReturnsCorrectOwnerRepo(string url, string expectedOwner, string expectedRepo)
    {
        var (owner, repo) = InvokeParseGitUrl(url);
        Assert.Equal(expectedOwner, owner);
        Assert.Equal(expectedRepo, repo);
    }

    [Theory]
    [InlineData("invalid_url")]
    [InlineData("https://github.com")]
    [InlineData("https://github.com/onlyowner")]
    public void InvalidUrls_ThrowsArgumentException(string url)
    {
        Assert.Throws<TargetInvocationException>(() => InvokeParseGitUrl(url));
    }
}
