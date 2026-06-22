using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/offers")]
public class OffersController : ControllerBase
{
    private readonly MongoDbService _db;

    public OffersController(MongoDbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var offers = await _db.Offers.Find(_ => true).ToListAsync();
        return Ok(offers);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var offers = await _db.Offers
            .Find(o => o.Active && o.StartDate.CompareTo(today) <= 0 && o.EndDate.CompareTo(today) >= 0)
            .ToListAsync();
        return Ok(offers);
    }

    [HttpGet("category/{category}")]
    public async Task<IActionResult> GetForCategory(string category)
    {
        var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
        var offers = await _db.Offers
            .Find(o => o.Active &&
                       o.StartDate.CompareTo(today) <= 0 &&
                       o.EndDate.CompareTo(today) >= 0 &&
                       (o.ApplicableServices.Contains("all") || o.ApplicableServices.Contains(category)))
            .ToListAsync();
        return Ok(offers);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Offer offer)
    {
        offer.Id = null;
        offer.OfferId = $"OFF-{DateTime.UtcNow.Ticks}";
        await _db.Offers.InsertOneAsync(offer);
        return Ok(offer);
    }

    [HttpPut("{offerId}")]
    public async Task<IActionResult> Update(string offerId, [FromBody] Offer offer)
    {
        var result = await _db.Offers.ReplaceOneAsync(
            o => o.OfferId == offerId, offer);
        return result.ModifiedCount == 0 ? NotFound() : Ok(offer);
    }

    [HttpDelete("{offerId}")]
    public async Task<IActionResult> Delete(string offerId)
    {
        var result = await _db.Offers.DeleteOneAsync(o => o.OfferId == offerId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Offer deleted." });
    }

    [HttpPut("bulk")]
    public async Task<IActionResult> BulkUpdate([FromBody] List<Offer> offers)
    {
        await _db.Offers.DeleteManyAsync(_ => true);
        if (offers.Count > 0)
            await _db.Offers.InsertManyAsync(offers);
        return Ok(new { message = "Offers updated." });
    }
}
