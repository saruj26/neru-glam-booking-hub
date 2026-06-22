using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class Offer
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("offerId")]
    public string OfferId { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("discountType")]
    public string DiscountType { get; set; } = "percentage";

    [BsonElement("discountValue")]
    public double DiscountValue { get; set; }

    [BsonElement("applicableServices")]
    public List<string> ApplicableServices { get; set; } = new();

    [BsonElement("startDate")]
    public string StartDate { get; set; } = string.Empty;

    [BsonElement("endDate")]
    public string EndDate { get; set; } = string.Empty;

    [BsonElement("active")]
    public bool Active { get; set; } = true;

    [BsonElement("code")]
    public string? Code { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
