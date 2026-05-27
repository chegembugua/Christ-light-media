/**
 * API Routes Documentation — Christ Light Media
 * 
 * All routes return:
 * { data: T, pagination?: { page, pageSize, total } }
 * or
 * { error: string }
 * 
 * Authentication:
 * - Pass Supabase session cookie via requests (automatic in browsers)
 * - Server will extract from Authorization header or cookies
 */

// ============================================================================
// MEDIA ENDPOINTS
// ============================================================================

/**
 * GET /api/media
 * List published media with filters
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10, max 100)
 * - type: 'SERMON' | 'PODCAST' | 'MUSIC' | 'WORSHIP' | 'RADIO'
 * - category: string
 * - published: 'true' | 'false'
 * 
 * Returns: Media[]
 */

/**
 * POST /api/media
 * Create new media (admin only)
 * 
 * Body:
 * {
 *   title: string (required)
 *   description?: string
 *   coverImage?: string (URL)
 *   audioUrl?: string (URL)
 *   videoUrl?: string (URL)
 *   type: 'SERMON' | 'PODCAST' | 'MUSIC' | 'WORSHIP' | 'RADIO' (required)
 *   category?: string
 *   speaker?: string
 *   duration?: number (seconds)
 *   podcastShowId?: string
 * }
 * 
 * Returns: Media (201)
 */

/**
 * GET /api/media/[id]
 * Fetch single media with comments
 * 
 * Returns: Media with podcastShow + comments[]
 */

/**
 * PUT /api/media/[id]
 * Update media (admin only)
 * 
 * Body: Partial media fields
 * Returns: Media
 */

/**
 * DELETE /api/media/[id]
 * Delete media (admin only)
 * 
 * Returns: { id, message }
 */

// ============================================================================
// DEVOTIONS ENDPOINTS
// ============================================================================

/**
 * GET /api/devotions
 * List devotions
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - published: 'true' | 'false'
 * - startDate: ISO string
 * - endDate: ISO string
 * 
 * Returns: Devotion[]
 */

/**
 * POST /api/devotions
 * Create devotion (admin only)
 * 
 * Body:
 * {
 *   title: string (required)
 *   verse?: string
 *   verseText?: string
 *   reflection?: string
 *   date: ISO string (required)
 * }
 * 
 * Returns: Devotion (201)
 */

// ============================================================================
// NEWS ENDPOINTS
// ============================================================================

/**
 * GET /api/news
 * List news articles
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - category: string
 * - published: 'true' | 'false'
 * 
 * Returns: News[]
 */

/**
 * POST /api/news
 * Create news article (admin only)
 * 
 * Body:
 * {
 *   title: string (required)
 *   slug: string (required, unique)
 *   content: string (required)
 *   excerpt?: string
 *   coverImage?: string (URL)
 *   category?: string
 * }
 * 
 * Returns: News (201)
 */

/**
 * GET /api/news/[id]
 * Fetch news by ID or slug
 * 
 * Returns: News (404 if unpublished and not admin)
 */

/**
 * PUT /api/news/[id]
 * Update news (admin only)
 * 
 * Body: Partial news fields
 * Returns: News
 */

/**
 * DELETE /api/news/[id]
 * Delete news (admin only)
 * 
 * Returns: { id, message }
 */

// ============================================================================
// PRAYER REQUEST ENDPOINTS
// ============================================================================

/**
 * GET /api/prayer-requests
 * List public prayer requests
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - category: string
 * - answered: 'true' | 'false'
 * 
 * Returns: PrayerRequest[] with user info + vote count
 */

/**
 * POST /api/prayer-requests
 * Create prayer request (authenticated users)
 * 
 * Body:
 * {
 *   title: string (required)
 *   content: string (required)
 *   category?: string
 *   isPublic?: boolean (default true)
 * }
 * 
 * Returns: PrayerRequest (201)
 */

/**
 * GET /api/prayer-requests/[id]
 * Fetch single prayer request with votes
 * 
 * Returns: PrayerRequest (404 if private and not owner)
 */

/**
 * PUT /api/prayer-requests/[id]
 * Update prayer request (owner only)
 * 
 * Body:
 * {
 *   title?: string
 *   content?: string
 *   category?: string
 *   isAnswered?: boolean
 *   isPublic?: boolean
 * }
 * 
 * Returns: PrayerRequest
 */

/**
 * DELETE /api/prayer-requests/[id]
 * Delete prayer request (owner or admin)
 * 
 * Returns: { id, message }
 */

/**
 * POST /api/prayer-requests/[id]/vote
 * Add prayer vote (authenticated users)
 * 
 * Returns: { vote, message } (201)
 */

/**
 * DELETE /api/prayer-requests/[id]/vote
 * Remove prayer vote
 * 
 * Returns: { message }
 */

// ============================================================================
// COMMENTS ENDPOINTS
// ============================================================================

/**
 * GET /api/comments
 * List comments for media
 * 
 * Query params:
 * - mediaId: string (required)
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * 
 * Returns: Comment[] with user info
 */

/**
 * POST /api/comments
 * Create comment (authenticated users)
 * 
 * Body:
 * {
 *   content: string (required)
 *   mediaId: string (required)
 * }
 * 
 * Returns: Comment (201)
 */

/**
 * GET /api/comments/[id]
 * Fetch single comment
 * 
 * Returns: Comment with user info
 */

/**
 * DELETE /api/comments/[id]
 * Delete comment (owner or admin)
 * 
 * Returns: { id, message }
 */

// ============================================================================
// DONATIONS ENDPOINTS
// ============================================================================

/**
 * GET /api/donations
 * List user's donations (authenticated)
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - type: 'ONE_TIME' | 'MONTHLY' | 'PROJECT'
 * - status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
 * 
 * Returns: Donation[]
 */

/**
 * POST /api/donations
 * Create donation (authenticated users, Stripe integration TBD)
 * 
 * Body:
 * {
 *   amount: number (required, > 0)
 *   type: 'ONE_TIME' | 'MONTHLY' | 'PROJECT' (required)
 *   project?: string
 *   currency?: string (default 'USD')
 * }
 * 
 * Returns: { donation, message } (201)
 */

// ============================================================================
// USER ENDPOINTS
// ============================================================================

/**
 * GET /api/users/profile
 * Fetch authenticated user's profile
 * 
 * Returns: User profile (id, email, fullName, role, avatarUrl, bio, createdAt)
 */

/**
 * PUT /api/users/profile
 * Update authenticated user's profile
 * 
 * Body:
 * {
 *   fullName?: string
 *   bio?: string
 *   avatarUrl?: string (URL)
 * }
 * 
 * Returns: Updated User profile
 */

// ============================================================================
// SEARCH ENDPOINT
// ============================================================================

/**
 * GET /api/search
 * Search across media, news, devotions
 * 
 * Query params:
 * - q: string (required, min 2 chars)
 * - type: 'media' | 'news' | 'devotion' (optional, searches all if not specified)
 * - limit: number (default 20, max 50)
 * 
 * Returns: { media?: [], news?: [], devotions?: [] }
 */

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

/**
 * GET /api/notifications
 * List user's notifications (authenticated)
 * 
 * Query params:
 * - page: number (default 1)
 * - pageSize: number (default 10)
 * - unreadOnly: 'true' | 'false'
 * 
 * Returns: Notification[]
 */

/**
 * PATCH /api/notifications/[id]
 * Mark notification as read
 * 
 * Body:
 * {
 *   isRead: boolean
 * }
 * 
 * Returns: Notification
 */

/**
 * DELETE /api/notifications/[id]
 * Delete notification
 * 
 * Returns: { id, message }
 */

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * 400: Bad Request
 * { error: "Validation or query parameter error" }
 * 
 * 401: Unauthorized
 * { error: "Unauthorized" }
 * 
 * 403: Forbidden
 * { error: "Forbidden" }
 * 
 * 404: Not Found
 * { error: "Resource not found" }
 * 
 * 500: Internal Server Error
 * { error: "Failed to [operation]" }
 */
