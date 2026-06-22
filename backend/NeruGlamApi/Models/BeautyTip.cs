using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class BeautyTip
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("tipId")]
    public string TipId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("excerpt")]
    public string Excerpt { get; set; } = string.Empty;

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("coverImage")]
    public string CoverImage { get; set; } = string.Empty;

    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new();

    [BsonElement("author")]
    public string Author { get; set; } = "Neru Beauty Team";

    [BsonElement("readTime")]
    public int ReadTime { get; set; } = 3;

    [BsonElement("featured")]
    public bool Featured { get; set; } = false;

    [BsonElement("active")]
    public bool Active { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
