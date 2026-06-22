using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class PaymentConfig
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("configKey")]
    public string ConfigKey { get; set; } = "main";

    [BsonElement("advancePercent")]
    public double AdvancePercent { get; set; } = 10;

    [BsonElement("onlineEnabled")]
    public bool OnlineEnabled { get; set; } = true;

    [BsonElement("cashEnabled")]
    public bool CashEnabled { get; set; } = true;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
