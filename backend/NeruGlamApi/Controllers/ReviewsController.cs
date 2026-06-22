using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly MongoDbService _db;

    public ReviewsController(MongoDbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _db.Reviews
            .Find(_ => true)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(reviews);
    }

    [HttpGet("approved")]
    public async Task<IActionResult> GetApproved()
    {
        var reviews = await _db.Reviews
            .Find(r => r.Approved)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(reviews);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Review review)
    {
        review.Id = null;
        review.ReviewId = $"REV-{DateTime.UtcNow.Ticks}";
        review.Approved = false;
        await _db.Reviews.InsertOneAsync(review);
        return Ok(review);
    }

    [HttpPatch("{reviewId}/approve")]
    public async Task<IActionResult> Approve(string reviewId)
    {
        var update = Builders<Review>.Update.Set(r => r.Approved, true);
        var result = await _db.Reviews.UpdateOneAsync(r => r.ReviewId == reviewId, update);
        return result.ModifiedCount == 0 ? NotFound() : Ok(new { message = "Review approved." });
    }

    [HttpPatch("{reviewId}/feature")]
    public async Task<IActionResult> Feature(string reviewId, [FromBody] bool featured)
    {
        var update = Builders<Review>.Update.Set(r => r.Featured, featured);
        var result = await _db.Reviews.UpdateOneAsync(r => r.ReviewId == reviewId, update);
        return result.ModifiedCount == 0 ? NotFound() : Ok(new { message = "Review updated." });
    }

    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> Delete(string reviewId)
    {
        var result = await _db.Reviews.DeleteOneAsync(r => r.ReviewId == reviewId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Review deleted." });
    }
}
