using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly MongoDbService _db;

    public PaymentController(MongoDbService db) => _db = db;

    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var cfg = await _db.PaymentConfigs
            .Find(p => p.ConfigKey == "main")
            .FirstOrDefaultAsync();

        if (cfg == null)
        {
            cfg = new PaymentConfig();
            await _db.PaymentConfigs.InsertOneAsync(cfg);
        }

        return Ok(cfg);
    }

    [HttpPut("config")]
    public async Task<IActionResult> UpdateConfig([FromBody] PaymentConfig config)
    {
        config.ConfigKey = "main";
        config.UpdatedAt = DateTime.UtcNow;

        var result = await _db.PaymentConfigs.ReplaceOneAsync(
            p => p.ConfigKey == "main",
            config,
            new ReplaceOptions { IsUpsert = true });

        return Ok(config);
    }
}
