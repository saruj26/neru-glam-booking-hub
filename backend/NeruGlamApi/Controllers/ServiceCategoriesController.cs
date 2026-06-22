using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/service-categories")]
public class ServiceCategoriesController : ControllerBase
{
    private readonly MongoDbService _db;

    public ServiceCategoriesController(MongoDbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cats = await _db.ServiceCategories
            .Find(_ => true)
            .SortBy(c => c.Order)
            .ToListAsync();
        return Ok(cats);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var cats = await _db.ServiceCategories
            .Find(c => c.Active)
            .SortBy(c => c.Order)
            .ToListAsync();
        return Ok(cats);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ServiceCategory cat)
    {
        cat.Id = null;
        cat.CategoryId = $"cat-{DateTime.UtcNow.Ticks}";
        await _db.ServiceCategories.InsertOneAsync(cat);
        return Ok(cat);
    }

    [HttpPut("{categoryId}")]
    public async Task<IActionResult> Update(string categoryId, [FromBody] ServiceCategory cat)
    {
        var result = await _db.ServiceCategories.ReplaceOneAsync(
            c => c.CategoryId == categoryId, cat);
        return result.ModifiedCount == 0 ? NotFound() : Ok(cat);
    }

    [HttpDelete("{categoryId}")]
    public async Task<IActionResult> Delete(string categoryId)
    {
        var result = await _db.ServiceCategories.DeleteOneAsync(c => c.CategoryId == categoryId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Category deleted." });
    }

    [HttpPut("bulk")]
    public async Task<IActionResult> BulkUpdate([FromBody] List<ServiceCategory> cats)
    {
        await _db.ServiceCategories.DeleteManyAsync(_ => true);
        if (cats.Count > 0)
            await _db.ServiceCategories.InsertManyAsync(cats);
        return Ok(new { message = "Categories updated." });
    }
}
