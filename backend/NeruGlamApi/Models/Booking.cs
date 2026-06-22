using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NeruGlamApi.Models;

public class BookingCustomer
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class BookingService
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public class BookingOffer
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public double DiscountValue { get; set; }
    public List<string> ApplicableServices { get; set; } = new();
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public bool Active { get; set; }
    public string? Code { get; set; }
}

public class PricingBreakdown
{
    public double OriginalPrice { get; set; }
    public double DiscountAmount { get; set; }
    public string DiscountLabel { get; set; } = string.Empty;
    public double FinalPrice { get; set; }
    public double AdvancePercent { get; set; }
    public double AdvanceAmount { get; set; }
    public double RemainingAmount { get; set; }
    public BookingOffer? Offer { get; set; }
}

public class BookingPaymentInfo
{
    public string Method { get; set; } = "cash";
    public string Status { get; set; } = "pending_payment";
    public double PaidAmount { get; set; }
    public double RemainingAmount { get; set; }
    public string? TransactionId { get; set; }
}

public class Booking
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("bookingId")]
    public string BookingId { get; set; } = string.Empty;

    [BsonElement("customer")]
    public BookingCustomer Customer { get; set; } = new();

    [BsonElement("service")]
    public BookingService Service { get; set; } = new();

    [BsonElement("date")]
    public string Date { get; set; } = string.Empty;

    [BsonElement("time")]
    public string Time { get; set; } = string.Empty;

    [BsonElement("specialRequests")]
    public string SpecialRequests { get; set; } = string.Empty;

    [BsonElement("pricing")]
    public PricingBreakdown Pricing { get; set; } = new();

    [BsonElement("payment")]
    public BookingPaymentInfo Payment { get; set; } = new();

    [BsonElement("status")]
    public string Status { get; set; } = "pending_payment";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
