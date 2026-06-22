using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.DTOs;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _db;
    private readonly JwtService _jwt;
    private readonly IConfiguration _config;

    public AuthController(MongoDbService db, JwtService jwt, IConfiguration config)
    {
        _db = db;
        _jwt = jwt;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var exists = await _db.Customers
            .Find(c => c.Email == req.Email.ToLower())
            .AnyAsync();

        if (exists)
            return Conflict(new { message = "An account with this email already exists." });

        var customer = new Customer
        {
            Name = req.Name,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone,
            Address = req.Address,
            MemberSince = DateTime.UtcNow.ToString("MMMM yyyy"),
            Level = "Silver",
            Points = 0,
            PointsForNext = 500,
            NextLevel = "Gold",
        };

        await _db.Customers.InsertOneAsync(customer);

        var token = _jwt.GenerateToken(customer.Id!, customer.Email, customer.Name, "customer");
        return Ok(BuildAuthResponse(customer, token));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var customer = await _db.Customers
            .Find(c => c.Email == req.Email.ToLower())
            .FirstOrDefaultAsync();

        if (customer == null || !BCrypt.Net.BCrypt.Verify(req.Password, customer.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = _jwt.GenerateToken(customer.Id!, customer.Email, customer.Name, "customer");
        return Ok(BuildAuthResponse(customer, token));
    }

    [HttpPost("admin/login")]
    public IActionResult AdminLogin([FromBody] AdminLoginRequest req)
    {
        var adminUser = _config["AdminCredentials:Username"] ?? "admin";
        var adminPass = _config["AdminCredentials:Password"] ?? "Neru@Admin2026";

        if (req.Username != adminUser || req.Password != adminPass)
            return Unauthorized(new { message = "Invalid admin credentials." });

        var token = _jwt.GenerateToken("admin-id", "admin@nerubeauty.com", "Admin", "admin");
        return Ok(new { token, name = "Admin", role = "admin" });
    }

    private static AuthResponse BuildAuthResponse(Customer c, string token) => new(
        Token: token,
        Name: c.Name,
        Email: c.Email,
        Phone: c.Phone,
        Address: c.Address,
        MemberSince: c.MemberSince,
        Level: c.Level,
        Points: c.Points,
        PointsForNext: c.PointsForNext,
        NextLevel: c.NextLevel,
        Role: "customer"
    );
}
