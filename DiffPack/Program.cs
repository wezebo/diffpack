using DiffPack;
using DiffPack.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect("localhost"));
builder.Services.AddSingleton(new PackageService());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/packages", async (HttpRequest request) =>
    {
        var multiplexer = app.Services.GetService<IConnectionMultiplexer>();
        var service = app.Services.GetService<PackageService>();
        var packageName = request.Query["packageName"].ToString();
        var version1 = request.Query["version1"].ToString();
        var version2 = request.Query["version2"].ToString();
        return await new PackagesController(multiplexer, service).Get(packageName, version1, version2);
    })
    .WithName("Packages")
    .WithOpenApi();

app.MapGet("/packages/json", async (HttpRequest request) =>
{
    var service = app.Services.GetService<PackageService>();
    var packageName = request.Query["packageName"].ToString();
    var version1 = request.Query["version1"].ToString();
    var version2 = request.Query["version2"].ToString();
    return await new PackagesController(null, service).GetAsJson(packageName, version1, version2);
});

app.Run();