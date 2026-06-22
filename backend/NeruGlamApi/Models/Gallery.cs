using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class GalleryCategory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("categoryId")]
    public string CategoryId { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("slug")]
    public string Slug { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("coverImage")]
    public string CoverImage { get; set; } = string.Empty;

    [BsonElement("active")]
    public bool Active { get; set; } = true;

    [BsonElement("order")]
    public int Order { get; set; }
}

public class GalleryImage
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("imageId")]
    public string ImageId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [BsonElement("galleryCategoryId")]
    public string GalleryCategoryId { get; set; } = string.Empty;

    [BsonElement("featured")]
    public bool Featured { get; set; } = false;

    [BsonElement("tag")]
    public string Tag { get; set; } = "none";

    [BsonElement("active")]
    public bool Active { get; set; } = true;

    [BsonElement("order")]
    public int Order { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class BeforeAfterPair
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("pairId")]
    public string PairId { get; set; } = string.Empty;

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("beforeImage")]
    public string BeforeImage { get; set; } = string.Empty;

    [BsonElement("afterImage")]
    public string AfterImage { get; set; } = string.Empty;

    [BsonElement("serviceType")]
    public string ServiceType { get; set; } = string.Empty;

    [BsonElement("active")]
    public bool Active { get; set; } = true;

    [BsonElement("featured")]
    public bool Featured { get; set; } = false;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
