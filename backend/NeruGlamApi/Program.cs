using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NeruGlamApi.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ──────────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddSingleton<MongoDbService>();
builder.Services.AddSingleton<JwtService>();

// ── CORS (allow React frontend on port 8080 and 5173) ────────────────────
builder.Services.AddCors(opts =>
{
    opts.AddPolicy("NeruFrontend", policy =>
        policy
            .WithOrigins("http://localhost:8080", "http://localhost:5173", "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// ── JWT Authentication ───────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── App Pipeline ─────────────────────────────────────────────────────────
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("NeruFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// health check
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "NeruGlam API" }));

// ── Seed the database on startup ──────────────────────────────────────────
// MongoDB creates NeruGlamDB automatically on the first write.
// The seeder inserts default data only when each collection is empty,
// so re-running the app never duplicates existing records.
Console.WriteLine("[NeruGlam] Connecting to MongoDB Atlas → NeruGlamDB...");
var dbService = app.Services.GetRequiredService<MongoDbService>();
await DatabaseSeeder.SeedAsync(dbService);

app.Run();
