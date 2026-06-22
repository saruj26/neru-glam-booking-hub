using MongoDB.Driver;
using NeruGlamApi.Models;

namespace NeruGlamApi.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _db;

    public MongoDbService(IConfiguration config)
    {
        var connectionString = config["MongoDB:ConnectionString"]!;
        var databaseName = config["MongoDB:DatabaseName"]!;
        var client = new MongoClient(connectionString);
        _db = client.GetDatabase(databaseName);
        EnsureIndexes();
    }

    public IMongoCollection<Customer> Customers =>
        _db.GetCollection<Customer>("customers");

    public IMongoCollection<Booking> Bookings =>
        _db.GetCollection<Booking>("bookings");

    public IMongoCollection<Offer> Offers =>
        _db.GetCollection<Offer>("offers");

    public IMongoCollection<ServiceCategory> ServiceCategories =>
        _db.GetCollection<ServiceCategory>("serviceCategories");

    public IMongoCollection<GalleryCategory> GalleryCategories =>
        _db.GetCollection<GalleryCategory>("galleryCategories");

    public IMongoCollection<GalleryImage> GalleryImages =>
        _db.GetCollection<GalleryImage>("galleryImages");

    public IMongoCollection<BeforeAfterPair> BeforeAfterPairs =>
        _db.GetCollection<BeforeAfterPair>("beforeAfterPairs");

    public IMongoCollection<BeautyTip> BeautyTips =>
        _db.GetCollection<BeautyTip>("beautyTips");

    public IMongoCollection<PaymentConfig> PaymentConfigs =>
        _db.GetCollection<PaymentConfig>("paymentConfig");

    public IMongoCollection<Review> Reviews =>
        _db.GetCollection<Review>("reviews");

    private void EnsureIndexes()
    {
        Customers.Indexes.CreateOne(
            new CreateIndexModel<Customer>(
                Builders<Customer>.IndexKeys.Ascending(c => c.Email),
                new CreateIndexOptions { Unique = true }));

        Bookings.Indexes.CreateOne(
            new CreateIndexModel<Booking>(
                Builders<Booking>.IndexKeys.Ascending(b => b.BookingId),
                new CreateIndexOptions { Unique = true }));
    }
}
