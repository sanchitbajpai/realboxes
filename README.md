This project is a real-time web application where multiple users can interact with a large grid of checkboxes simultaneously. When one user toggles a checkbox, the update is reflected instantly for all connected users using WebSockets.
The system is designed with scalability in mind, handling large datasets efficiently using Redis and virtualization techniques.
Authentication Flow
User enters a username
Backend generates a JWT token
Token is sent to frontend
WebSocket connection is established using token
Only authenticated users can send toggle events
 WebSocket Flow
Client connects via Socket.IO
User toggles checkbox → event sent to server
Server:
Validates user
Applies rate limiting
Updates Redis bitmap
Publishes event via Redis Pub/Sub
All clients receive update in real-time
  Redis Usage
1. BITMAP (State Storage)

Checkbox states are stored using Redis bitmap:

SETBIT checkboxes <index> <value>
GETBIT checkboxes <index>
Memory efficient (1 bit per checkbox)
1 million checkboxes ≈ 125 KB
2. Pub/Sub (Real-Time Sync)
PUBLISH checkbox_updates {...}
SUBSCRIBE checkbox_updates
Enables communication between multiple backend instances
Ensures all clients stay in sync
 Rate Limiting Logic

Custom rate limiting implemented using Redis:

Key: rate:<userId>
Mechanism:
INCR counter
EXPIRE (time window)
If requests exceed threshold → blocked

Prevents:

Spam clicks
Server overload
  Scaling Strategy
  Frontend Scaling (Virtualization)

Rendering 1 million DOM elements is not feasible.

Solution:

Only visible checkboxes are rendered
As user scrolls, new elements are dynamically created
Old elements are removed

Result:

Constant DOM size (~300–500 elements)
Smooth performance
- Backend Scaling
Redis BITMAP ensures minimal memory usage
Stateless backend (can scale horizontally)
Any server instance can handle requests
- Multi-Server Architecture
Redis Pub/Sub synchronizes updates across servers
Enables horizontal scaling
No direct server-to-server dependency
- Conflict Handling
Last-write-wins strategy used
Suitable for real-time collaborative systems
- Abuse Protection
Rate limiting per user
Frontend debounce (prevents rapid clicks)
Socket authentication
