namespace NeruGlamApi.DTOs;

public record RegisterRequest(
    string Name,
    string Email,
    string Password,
    string Phone,
    string Address
);

public record LoginRequest(
    string Email,
    string Password
);

public record AdminLoginRequest(
    string Username,
    string Password
);

public record AuthResponse(
    string Token,
    string Name,
    string Email,
    string Phone,
    string Address,
    string MemberSince,
    string Level,
    int Points,
    int PointsForNext,
    string NextLevel,
    string Role
);
