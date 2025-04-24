
# Neru Beauty Center - PHP Backend API

This directory contains the PHP backend API for Neru Beauty Center application.

## Directory Structure

```
php-backend/
├── api/                  # API endpoints
│   ├── auth/             # Authentication related endpoints
│   ├── services/         # Services related endpoints
│   ├── bookings/         # Bookings related endpoints
│   ├── reviews/          # Reviews related endpoints
│   └── wishlist/         # Wishlist related endpoints
├── config/               # Configuration files
├── includes/             # Helper functions and classes
├── models/               # Database models
└── uploads/              # Directory for uploaded files
```

## API Endpoints

### Authentication
- `POST /api/auth/login.php` - Login user/admin
- `POST /api/auth/register.php` - Register a new user
- `POST /api/auth/logout.php` - Logout user

### Services
- `GET /api/services/list.php` - Get all services
- `GET /api/services/categories.php` - Get service categories
- `GET /api/services/view.php?id={id}` - Get a specific service
- `POST /api/services/create.php` - Create a new service (admin only)
- `PUT /api/services/update.php` - Update a service (admin only)
- `DELETE /api/services/delete.php` - Delete a service (admin only)

### Bookings
- `GET /api/bookings/list.php` - Get all bookings (admin) or user's bookings
- `GET /api/bookings/view.php?id={id}` - Get a specific booking
- `POST /api/bookings/create.php` - Create a new booking
- `PUT /api/bookings/update.php` - Update a booking status (admin only)
- `DELETE /api/bookings/delete.php` - Cancel a booking

### Reviews
- `GET /api/reviews/list.php?service_id={id}` - Get reviews for a service
- `POST /api/reviews/create.php` - Create a new review
- `PUT /api/reviews/approve.php` - Approve a review (admin only)
- `DELETE /api/reviews/delete.php` - Delete a review (admin only)

### Wishlist
- `GET /api/wishlist/list.php` - Get user's wishlist
- `POST /api/wishlist/add.php` - Add service to wishlist
- `DELETE /api/wishlist/remove.php` - Remove service from wishlist

## Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Services Table
```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50),
  image VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Service Inclusions Table
```sql
CREATE TABLE service_inclusions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT,
  description VARCHAR(255) NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  service_id INT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  payment_amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  service_id INT,
  rating INT NOT NULL,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  service_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

## Implementation Instructions

1. Set up a MySQL database using the schema provided above
2. Configure the database connection in `config/database.php`
3. Implement the API endpoints following RESTful principles
4. Set up proper authentication and authorization
5. Implement input validation and error handling
6. Connect the React frontend to these API endpoints

## Security Considerations

- Implement proper authentication using JWT tokens
- Sanitize all inputs to prevent SQL injection
- Use password hashing for user passwords (bcrypt/Argon2)
- Implement rate limiting to prevent brute force attacks
- Set up proper CORS policies
- Validate user permissions for admin-only endpoints

## API Response Format

All API endpoints should return JSON responses with the following structure:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "message": "Error message here"
}
```
