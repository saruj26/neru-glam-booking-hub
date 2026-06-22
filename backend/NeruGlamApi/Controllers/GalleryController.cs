using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/gallery")]
public class GalleryController : ControllerBase
{
    private readonly MongoDbService _db;

    public GalleryController(MongoDbService db) => _db = db;

    /* ── Gallery Categories ─────────────────────────────── */

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var cats = await _db.GalleryCategories
            .Find(_ => true)
            .SortBy(c => c.Order)
            .ToListAsync();
        return Ok(cats);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] GalleryCategory cat)
    {
        cat.Id = null;
        cat.CategoryId = $"gc-{DateTime.UtcNow.Ticks}";
        await _db.GalleryCategories.InsertOneAsync(cat);
        return Ok(cat);
    }

    [HttpPut("categories/{categoryId}")]
    public async Task<IActionResult> UpdateCategory(string categoryId, [FromBody] GalleryCategory cat)
    {
        var result = await _db.GalleryCategories.ReplaceOneAsync(
            c => c.CategoryId == categoryId, cat);
        return result.ModifiedCount == 0 ? NotFound() : Ok(cat);
    }

    [HttpPut("categories/bulk")]
    public async Task<IActionResult> BulkUpdateCategories([FromBody] List<GalleryCategory> cats)
    {
        await _db.GalleryCategories.DeleteManyAsync(_ => true);
        if (cats.Count > 0)
            await _db.GalleryCategories.InsertManyAsync(cats);
        return Ok(new { message = "Gallery categories updated." });
    }

    /* ── Gallery Images ─────────────────────────────────── */

    [HttpGet("images")]
    public async Task<IActionResult> GetImages([FromQuery] bool? active, [FromQuery] bool? featured, [FromQuery] int? limit)
    {
        var filter = Builders<GalleryImage>.Filter.Empty;
        if (active.HasValue)
            filter &= Builders<GalleryImage>.Filter.Eq(i => i.Active, active.Value);
        if (featured.HasValue)
            filter &= Builders<GalleryImage>.Filter.Eq(i => i.Featured, featured.Value);

        var query = _db.GalleryImages.Find(filter).SortBy(i => i.Order);
        var results = limit.HasValue
            ? await query.Limit(limit.Value).ToListAsync()
            : await query.ToListAsync();

        return Ok(results);
    }

    [HttpPost("images")]
    public async Task<IActionResult> CreateImage([FromBody] GalleryImage img)
    {
        img.Id = null;
        img.ImageId = $"gi-{DateTime.UtcNow.Ticks}";
        await _db.GalleryImages.InsertOneAsync(img);
        return Ok(img);
    }

    [HttpPut("images/{imageId}")]
    public async Task<IActionResult> UpdateImage(string imageId, [FromBody] GalleryImage img)
    {
        var result = await _db.GalleryImages.ReplaceOneAsync(
            i => i.ImageId == imageId, img);
        return result.ModifiedCount == 0 ? NotFound() : Ok(img);
    }

    [HttpDelete("images/{imageId}")]
    public async Task<IActionResult> DeleteImage(string imageId)
    {
        var result = await _db.GalleryImages.DeleteOneAsync(i => i.ImageId == imageId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Image deleted." });
    }

    [HttpPut("images/bulk")]
    public async Task<IActionResult> BulkUpdateImages([FromBody] List<GalleryImage> images)
    {
        await _db.GalleryImages.DeleteManyAsync(_ => true);
        if (images.Count > 0)
            await _db.GalleryImages.InsertManyAsync(images);
        return Ok(new { message = "Gallery images updated." });
    }

    /* ── Before & After ─────────────────────────────────── */

    [HttpGet("before-after")]
    public async Task<IActionResult> GetBeforeAfter([FromQuery] bool? active)
    {
        var filter = active.HasValue
            ? Builders<BeforeAfterPair>.Filter.Eq(p => p.Active, active.Value)
            : Builders<BeforeAfterPair>.Filter.Empty;
        var pairs = await _db.BeforeAfterPairs.Find(filter).ToListAsync();
        return Ok(pairs);
    }

    [HttpPost("before-after")]
    public async Task<IActionResult> CreateBeforeAfter([FromBody] BeforeAfterPair pair)
    {
        pair.Id = null;
        pair.PairId = $"ba-{DateTime.UtcNow.Ticks}";
        await _db.BeforeAfterPairs.InsertOneAsync(pair);
        return Ok(pair);
    }

    [HttpPut("before-after/{pairId}")]
    public async Task<IActionResult> UpdateBeforeAfter(string pairId, [FromBody] BeforeAfterPair pair)
    {
        var result = await _db.BeforeAfterPairs.ReplaceOneAsync(
            p => p.PairId == pairId, pair);
        return result.ModifiedCount == 0 ? NotFound() : Ok(pair);
    }

    [HttpDelete("before-after/{pairId}")]
    public async Task<IActionResult> DeleteBeforeAfter(string pairId)
    {
        var result = await _db.BeforeAfterPairs.DeleteOneAsync(p => p.PairId == pairId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Pair deleted." });
    }

    [HttpPut("before-after/bulk")]
    public async Task<IActionResult> BulkUpdateBeforeAfter([FromBody] List<BeforeAfterPair> pairs)
    {
        await _db.BeforeAfterPairs.DeleteManyAsync(_ => true);
        if (pairs.Count > 0)
            await _db.BeforeAfterPairs.InsertManyAsync(pairs);
        return Ok(new { message = "Before/After pairs updated." });
    }
}
