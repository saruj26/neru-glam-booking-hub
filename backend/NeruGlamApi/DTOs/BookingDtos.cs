using NeruGlamApi.Models;

namespace NeruGlamApi.DTOs;

public record CreateBookingRequest(
    BookingCustomer Customer,
    BookingService Service,
    string Date,
    string Time,
    string SpecialRequests,
    PricingBreakdown Pricing,
    BookingPaymentInfo Payment
);

public record UpdateBookingStatusRequest(string Status, string? TransactionId);
