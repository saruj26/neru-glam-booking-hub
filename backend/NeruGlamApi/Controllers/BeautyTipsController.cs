using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/beauty-tips")]
public class BeautyTipsController : ControllerBase
{
    private readonly MongoDbService _db;

    public BeautyTipsController(MongoDbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tips = await _db.BeautyTips
            .Find(_ => true)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
        return Ok(tips);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var tips = await _db.BeautyTips
            .Find(t => t.Active)
            .SortByDescending(t => t.CreatedAt)
            .ToListAsync();
        return Ok(tips);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int limit = 3)
    {
        var tips = await _db.BeautyTips
            .Find(t => t.Active && t.Featured)
            .SortByDescending(t => t.CreatedAt)
            .Limit(limit)
            .ToListAsync();
        return Ok(tips);
    }

    [HttpGet("{tipId}")]
    public async Task<IActionResult> GetById(string tipId)
    {
        var tip = await _db.BeautyTips
            .Find(t => t.TipId == tipId)
            .FirstOrDefaultAsync();
        return tip == null ? NotFound() : Ok(tip);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BeautyTip tip)
    {
        tip.Id = null;
        tip.TipId = $"tip-{DateTime.UtcNow.Ticks}";
        await _db.BeautyTips.InsertOneAsync(tip);
        return Ok(tip);
    }

    [HttpPut("{tipId}")]
    public async Task<IActionResult> Update(string tipId, [FromBody] BeautyTip tip)
    {
        var result = await _db.BeautyTips.ReplaceOneAsync(
            t => t.TipId == tipId, tip);
        return result.ModifiedCount == 0 ? NotFound() : Ok(tip);
    }

    [HttpDelete("{tipId}")]
    public async Task<IActionResult> Delete(string tipId)
    {
        var result = await _db.BeautyTips.DeleteOneAsync(t => t.TipId == tipId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Tip deleted." });
    }

    [HttpPut("bulk")]
    public async Task<IActionResult> BulkUpdate([FromBody] List<BeautyTip> tips)
    {
        await _db.BeautyTips.DeleteManyAsync(_ => true);
        if (tips.Count > 0)
            await _db.BeautyTips.InsertManyAsync(tips);
        return Ok(new { message = "Beauty tips updated." });
    }
}
