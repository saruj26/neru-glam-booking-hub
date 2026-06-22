using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class Customer
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("memberSince")]
    public string MemberSince { get; set; } = string.Empty;

    [BsonElement("level")]
    public string Level { get; set; } = "Silver";

    [BsonElement("points")]
    public int Points { get; set; } = 0;

    [BsonElement("pointsForNext")]
    public int PointsForNext { get; set; } = 500;

    [BsonElement("nextLevel")]
    public string NextLevel { get; set; } = "Gold";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
