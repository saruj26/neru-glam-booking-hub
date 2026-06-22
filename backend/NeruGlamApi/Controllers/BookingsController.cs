using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NeruGlamApi.DTOs;
using NeruGlamApi.Models;
using NeruGlamApi.Services;

namespace NeruGlamApi.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly MongoDbService _db;

    public BookingsController(MongoDbService db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bookings = await _db.Bookings
            .Find(_ => true)
            .SortByDescending(b => b.CreatedAt)
            .ToListAsync();
        return Ok(bookings);
    }

    [HttpGet("{bookingId}")]
    public async Task<IActionResult> GetById(string bookingId)
    {
        var booking = await _db.Bookings
            .Find(b => b.BookingId == bookingId)
            .FirstOrDefaultAsync();
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpGet("customer/{email}")]
    public async Task<IActionResult> GetByCustomer(string email)
    {
        var bookings = await _db.Bookings
            .Find(b => b.Customer.Email == email.ToLower())
            .SortByDescending(b => b.CreatedAt)
            .ToListAsync();
        return Ok(bookings);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest req)
    {
        var id = await GenerateBookingId();

        var booking = new Booking
        {
            BookingId = id,
            Customer = req.Customer,
            Service = req.Service,
            Date = req.Date,
            Time = req.Time,
            SpecialRequests = req.SpecialRequests,
            Pricing = req.Pricing,
            Payment = req.Payment,
            Status = req.Payment.Status,
        };

        await _db.Bookings.InsertOneAsync(booking);
        return Ok(booking);
    }

    [HttpPatch("{bookingId}/status")]
    public async Task<IActionResult> UpdateStatus(string bookingId, [FromBody] UpdateBookingStatusRequest req)
    {
        var update = Builders<Booking>.Update
            .Set(b => b.Status, req.Status)
            .Set(b => b.Payment.Status, req.Status);

        if (!string.IsNullOrEmpty(req.TransactionId))
            update = update.Set(b => b.Payment.TransactionId, req.TransactionId);

        var result = await _db.Bookings.UpdateOneAsync(
            b => b.BookingId == bookingId, update);

        return result.ModifiedCount == 0 ? NotFound() : Ok(new { message = "Status updated." });
    }

    [HttpDelete("{bookingId}")]
    public async Task<IActionResult> Delete(string bookingId)
    {
        var result = await _db.Bookings.DeleteOneAsync(b => b.BookingId == bookingId);
        return result.DeletedCount == 0 ? NotFound() : Ok(new { message = "Booking deleted." });
    }

    private async Task<string> GenerateBookingId()
    {
        var yr = DateTime.UtcNow.Year;
        var count = await _db.Bookings.CountDocumentsAsync(_ => true);
        return $"NB-{yr}-{(count + 1):D3}";
    }
}
