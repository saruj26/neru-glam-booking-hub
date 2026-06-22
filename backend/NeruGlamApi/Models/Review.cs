using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class Review
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("reviewId")]
    public string ReviewId { get; set; } = string.Empty;

    [BsonElement("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [BsonElement("customerEmail")]
    public string CustomerEmail { get; set; } = string.Empty;

    [BsonElement("rating")]
    public int Rating { get; set; } = 5;

    [BsonElement("comment")]
    public string Comment { get; set; } = string.Empty;

    [BsonElement("serviceCategory")]
    public string ServiceCategory { get; set; } = string.Empty;

    [BsonElement("bookingId")]
    public string? BookingId { get; set; }

    [BsonElement("approved")]
    public bool Approved { get; set; } = false;

    [BsonElement("featured")]
    public bool Featured { get; set; } = false;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
