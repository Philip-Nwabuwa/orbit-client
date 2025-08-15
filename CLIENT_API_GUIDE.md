# Collabix API Client Integration Guide

> **For Frontend Developers**: Complete API endpoint documentation for building the Collabix client application

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Authentication System](#authentication-system)
- [Core API Endpoints](#core-api-endpoints)
- [WebSocket Real-time Events](#websocket-real-time-events)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Development Tools](#development-tools)

---

## 🚀 Quick Start

### Base Configuration

```typescript
const API_BASE_URL = 'http://localhost:3000/api/v1'
const WS_URL = 'ws://localhost:3001'

// Standard headers for all requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}` // when authenticated
}
```

### Response Format

All API responses follow this structure:

```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}
```

---

## 🔐 Authentication System

### JWT Token-Based Authentication

The API uses **JWT tokens** with:
- **Access Token**: Short-lived (15 minutes), for API requests
- **Refresh Token**: Long-lived, for obtaining new access tokens

### Authentication Flow

```typescript
// 1. Register new user
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

// 2. Login
POST /api/v1/auth/login
{
  "email": "user@example.com", 
  "password": "securePassword123"
}

// Response includes:
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "..." },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

// 3. Refresh access token
POST /api/v1/auth/refresh
{
  "refreshToken": "eyJ..."
}
```

### Authentication Endpoints

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/auth/register` | POST | Register new account | 5/15min |
| `/auth/login` | POST | User login | 5/15min |
| `/auth/refresh` | POST | Refresh access token | 10/min |
| `/auth/logout` | POST | Logout current session | 100/15min |
| `/auth/logout-all` | POST | Logout all devices | 100/15min |
| `/auth/me` | GET | Get current user | 100/15min |
| `/auth/verify-email` | POST | Verify email address | 100/15min |
| `/auth/check-token` | POST | Validate token | 100/15min |

### Development Mode

```typescript
// Development-only endpoints (NODE_ENV=development)
POST /api/v1/auth/dev-login
{
  "email": "dev@example.com",
  "name": "Dev User"
}

GET /api/v1/auth/dev-status
// Returns development mode status
```

---

## 🏢 Core API Endpoints

### 1. Workspaces

#### Create Workspace
```typescript
POST /api/v1/workspaces
{
  "name": "My Team Workspace",
  "description": "Our team collaboration space",
  "slug": "my-team" // optional
}
```

#### Get User Workspaces
```typescript
GET /api/v1/workspaces
// Returns all workspaces user is a member of
```

#### Get Workspace Details
```typescript
GET /api/v1/workspaces/{workspaceId}
// Includes channels, members, settings
```

#### Update Workspace
```typescript
PUT /api/v1/workspaces/{workspaceId}
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Workspace Members
```typescript
// Get members
GET /api/v1/workspaces/{workspaceId}/members

// Add member  
POST /api/v1/workspaces/{workspaceId}/members
{
  "email": "newmember@example.com",
  "role": "MEMBER" // OWNER, ADMIN, MEMBER
}

// Update member role
PUT /api/v1/workspaces/{workspaceId}/members/{userId}
{
  "role": "ADMIN"
}

// Remove member
DELETE /api/v1/workspaces/{workspaceId}/members/{userId}
```

### 2. Channels

#### Create Channel
```typescript
POST /api/v1/workspaces/{workspaceId}/channels
{
  "name": "general",
  "description": "General discussion",
  "isPrivate": false,
  "parentId": null // for nested channels
}
```

#### Get Workspace Channels
```typescript
GET /api/v1/workspaces/{workspaceId}/channels
// Returns all channels user has access to
```

#### Channel Management
```typescript
// Get channel details
GET /api/v1/channels/{channelId}

// Update channel
PUT /api/v1/channels/{channelId}
{
  "name": "updated-name",
  "description": "Updated description",
  "isPrivate": true
}

// Delete channel
DELETE /api/v1/channels/{channelId}
```

#### Channel Members
```typescript
// Get channel members
GET /api/v1/channels/{channelId}/members

// Add member to private channel
POST /api/v1/channels/{channelId}/members
{
  "userId": "user-id"
}

// Remove member
DELETE /api/v1/channels/{channelId}/members/{userId}
```

### 3. Messages

#### Send Channel Message
```typescript
POST /api/v1/channels/{channelId}/messages
{
  "content": "Hello team!",
  "messageType": "text", // text, file, voice, system
  "mentions": ["user-id-1", "user-id-2"],
  "parentMessageId": "reply-to-message-id" // for threads
}
```

#### Send Message with Files
```typescript
POST /api/v1/channels/{channelId}/messages/with-files
// Content-Type: multipart/form-data
{
  "content": "Check out these files",
  "messageType": "file",
  "files": [File objects] // max 5 files, 25MB each
}
```

#### Send Voice Message
```typescript
POST /api/v1/channels/{channelId}/messages/voice
// Content-Type: multipart/form-data  
{
  "content": "Voice message description",
  "voiceFile": File // WAV format, max 5 minutes
}
```

#### Get Channel Messages
```typescript
GET /api/v1/channels/{channelId}/messages?limit=50&cursor=message-id&includeThreads=true
// Cursor-based pagination for performance
```

#### Message Actions
```typescript
// Update message
PUT /api/v1/messages/{messageId}
{
  "content": "Updated message content"
}

// Delete message  
DELETE /api/v1/messages/{messageId}

// Add reaction
POST /api/v1/messages/{messageId}/reactions
{
  "emoji": "👍"
}

// Remove reaction
DELETE /api/v1/messages/{messageId}/reactions/{emoji}

// Get message thread
GET /api/v1/messages/{messageId}/thread?limit=20&cursor=reply-id
```

### 4. Direct Messages

#### Start Direct Message
```typescript
POST /api/v1/workspaces/{workspaceId}/direct-messages
{
  "participantId": "other-user-id"
}
```

#### Get DM Conversations  
```typescript
GET /api/v1/workspaces/{workspaceId}/direct-messages
// Returns all DM conversations for user
```

#### Send DM
```typescript
POST /api/v1/direct-messages/{dmId}/messages
{
  "content": "Private message",
  "messageType": "text"
}
```

#### DM with Files/Voice
```typescript
POST /api/v1/direct-messages/{dmId}/messages/with-files
POST /api/v1/direct-messages/{dmId}/messages/voice
// Same format as channel messages
```

### 5. Tasks

#### Create Task
```typescript
POST /api/v1/workspaces/{workspaceId}/tasks
{
  "title": "Complete feature implementation",
  "description": "Detailed task description",
  "status": "TODO", // TODO, IN_PROGRESS, IN_REVIEW, DONE
  "priority": "HIGH", // LOW, MEDIUM, HIGH, URGENT  
  "assigneeId": "user-id",
  "dueDate": "2024-12-31T23:59:59Z",
  "tags": ["frontend", "urgent"],
  "channelId": "channel-id" // optional
}
```

#### Get Tasks
```typescript
// Get workspace tasks
GET /api/v1/workspaces/{workspaceId}/tasks?status=TODO,IN_PROGRESS&assigneeId=user-id&page=1&limit=20

// Get specific task
GET /api/v1/tasks/{taskId}
```

#### Update Task
```typescript
PUT /api/v1/tasks/{taskId}
{
  "status": "IN_PROGRESS",
  "assigneeId": "new-assignee-id"
}
```

#### Task Comments
```typescript
// Add comment
POST /api/v1/tasks/{taskId}/comments
{
  "content": "Progress update on this task"
}

// Get comments
GET /api/v1/tasks/{taskId}/comments
```

#### Task Attachments
```typescript
// Add attachment
POST /api/v1/tasks/{taskId}/attachments
// multipart/form-data with file

// Get attachments  
GET /api/v1/tasks/{taskId}/attachments

// Delete attachment
DELETE /api/v1/tasks/{taskId}/attachments/{attachmentId}
```

### 6. File Uploads

#### General File Upload
```typescript
POST /api/v1/upload/file
// Content-Type: multipart/form-data
{
  "file": File, // max 50MB
  "uploadType": "message_attachment" // message_attachment, avatar, document
}

// Response:
{
  "success": true,
  "data": {
    "id": "file-id",
    "filename": "document.pdf", 
    "url": "https://cdn.example.com/files/...",
    "size": 1024000,
    "mimeType": "application/pdf"
  }
}
```

#### Multiple Files Upload
```typescript
POST /api/v1/upload/files
// Content-Type: multipart/form-data
{
  "files": [File, File, File], // max 5 files
  "uploadType": "message_attachment"
}
```

#### Avatar Upload
```typescript
POST /api/v1/upload/avatar
// Content-Type: multipart/form-data
{
  "avatar": File // image file, auto-resized
}
```

### 7. User Management

#### Get User Profile
```typescript
GET /api/v1/users/profile
// Returns current user's detailed profile
```

#### Update Profile
```typescript
PUT /api/v1/users/profile
{
  "name": "Updated Name",
  "bio": "Software Developer",
  "timezone": "America/New_York"
}
```

#### User Settings
```typescript
// Get settings
GET /api/v1/users/settings

// Update settings
PUT /api/v1/users/settings
{
  "notifications": {
    "email": true,
    "push": false,
    "desktop": true
  },
  "theme": "dark",
  "language": "en"
}
```

#### Search Users
```typescript
GET /api/v1/workspaces/{workspaceId}/users/search?q=john&limit=10
// Search workspace members
```

---

## ⚡ WebSocket Real-time Events

### Connection Setup

```typescript
import { io, Socket } from 'socket.io-client'

const socket: Socket = io(WS_URL, {
  transports: ['websocket', 'polling'],
  auth: {
    token: accessToken
  }
})

// Connection events
socket.on('connect', () => {
  console.log('Connected to WebSocket')
})

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket')  
})

socket.on('error', (error) => {
  console.error('WebSocket error:', error)
})
```

### Client-to-Server Events

```typescript
// Join workspace room
socket.emit('join_workspace', { workspaceId: 'workspace-id' })

// Join channel room  
socket.emit('join_channel', { channelId: 'channel-id' })

// Leave channel room
socket.emit('leave_channel', { channelId: 'channel-id' })

// Join DM room
socket.emit('join_dm', { dmId: 'dm-id' })

// Typing indicators
socket.emit('typing_start', { 
  channelId: 'channel-id', // or dmId
  userId: 'user-id'
})

socket.emit('typing_stop', {
  channelId: 'channel-id', // or dmId  
  userId: 'user-id'
})

// User presence
socket.emit('presence_update', {
  status: 'online' // online, away, busy, offline
})
```

### Server-to-Client Events

```typescript
// Message events
socket.on('message_created', (data) => {
  // New message in channel/DM
  console.log('New message:', data)
})

socket.on('message_updated', (data) => {
  // Message was edited
  console.log('Message updated:', data)
})

socket.on('message_deleted', (data) => {
  // Message was deleted
  console.log('Message deleted:', data)
})

socket.on('message_reaction_added', (data) => {
  // Reaction added to message
  console.log('Reaction added:', data)
})

socket.on('message_reaction_removed', (data) => {
  // Reaction removed from message
  console.log('Reaction removed:', data)
})

// Channel events  
socket.on('channel_created', (data) => {
  // New channel in workspace
  console.log('Channel created:', data)
})

socket.on('channel_updated', (data) => {
  // Channel details changed
  console.log('Channel updated:', data)
})

socket.on('channel_deleted', (data) => {
  // Channel was deleted
  console.log('Channel deleted:', data)
})

socket.on('channel_member_added', (data) => {
  // User added to channel
  console.log('Member added:', data)
})

socket.on('channel_member_removed', (data) => {
  // User removed from channel
  console.log('Member removed:', data)
})

// Workspace events
socket.on('workspace_updated', (data) => {
  // Workspace details changed
  console.log('Workspace updated:', data)
})

socket.on('workspace_member_added', (data) => {
  // New workspace member
  console.log('Workspace member added:', data)
})

socket.on('workspace_member_removed', (data) => {
  // Member left/removed from workspace
  console.log('Workspace member removed:', data)
})

// Task events
socket.on('task_created', (data) => {
  // New task created
  console.log('Task created:', data)
})

socket.on('task_updated', (data) => {
  // Task details changed
  console.log('Task updated:', data)
})

socket.on('task_assigned', (data) => {
  // Task assigned to user
  console.log('Task assigned:', data)
})

socket.on('task_completed', (data) => {
  // Task marked as complete
  console.log('Task completed:', data)
})

// Typing indicators
socket.on('user_typing_start', (data) => {
  // User started typing
  console.log('User typing:', data)
})

socket.on('user_typing_stop', (data) => {
  // User stopped typing
  console.log('User stopped typing:', data)
})

// Presence updates
socket.on('user_presence_updated', (data) => {
  // User status changed
  console.log('User presence:', data)
})

socket.on('user_online', (data) => {
  // User came online
  console.log('User online:', data)
})

socket.on('user_offline', (data) => {
  // User went offline
  console.log('User offline:', data)
})
```

### Event Data Structures

```typescript
interface MessageCreatedData {
  id: string
  content: string
  messageType: 'text' | 'voice' | 'file' | 'system'
  authorId: string
  author: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
  channelId?: string
  dmId?: string
  workspaceId: string
  attachments?: Array<{
    id: string
    filename: string
    url: string
    size: number
    mimeType: string
  }>
  audioUrl?: string
  audioDuration?: number
  mentions?: string[]
  parentMessageId?: string
  createdAt: string
  updatedAt: string
}

interface TypingData {
  userId: string
  userName: string
  channelId?: string
  dmId?: string
  workspaceId: string
}

interface PresenceData {
  userId: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: string
}
```

---

## 🚨 Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "message": "Email is required"
    }
  }
}
```

### Common Error Codes

```typescript
// Authentication errors
'INVALID_CREDENTIALS'      // Wrong email/password
'TOKEN_EXPIRED'           // Access token expired
'TOKEN_INVALID'           // Invalid token format
'EMAIL_NOT_VERIFIED'      // Email verification required

// Authorization errors  
'WORKSPACE_ACCESS_DENIED' // Not a workspace member
'CHANNEL_ACCESS_DENIED'   // No channel access
'TASK_ACCESS_DENIED'      // Cannot access task

// Validation errors
'VALIDATION_ERROR'        // Request validation failed
'DUPLICATE_ENTRY'         // Resource already exists
'RESOURCE_NOT_FOUND'      // Requested resource missing

// Rate limiting
'RATE_LIMIT_EXCEEDED'     // Too many requests

// File upload errors
'FILE_TOO_LARGE'         // File exceeds size limit
'INVALID_FILE_TYPE'      // Unsupported file type
'UPLOAD_FAILED'          // File upload failed
```

### Error Handling Strategy

```typescript
class ApiClient {
  async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(endpoint, options)
      const data = await response.json()
      
      if (!data.success) {
        throw new ApiError(data.error)
      }
      
      return data.data
    } catch (error) {
      if (error instanceof ApiError) {
        // Handle specific API errors
        switch (error.code) {
          case 'TOKEN_EXPIRED':
            await this.refreshToken()
            return this.request(endpoint, options) // Retry
          case 'RATE_LIMIT_EXCEEDED':
            await this.waitForRateLimit()
            return this.request(endpoint, options) // Retry
          default:
            throw error
        }
      }
      throw error
    }
  }
}

class ApiError extends Error {
  constructor(public error: { code: string; message: string; details?: any }) {
    super(error.message)
    this.code = error.code
  }
}
```

---

## ⚠️ Rate Limiting

### Rate Limit Headers

All responses include rate limiting headers:

```typescript
'X-RateLimit-Limit'     // Requests allowed per window
'X-RateLimit-Remaining' // Requests remaining in window  
'X-RateLimit-Reset'     // Window reset time (Unix timestamp)
'Retry-After'          // Seconds to wait (when limit exceeded)
```

### Rate Limit Categories

| Category | Limit | Window | Endpoints |
|----------|-------|--------|-----------|
| Authentication | 5 requests | 15 minutes | `/auth/login`, `/auth/register` |
| Token Refresh | 10 requests | 1 minute | `/auth/refresh` |
| Messaging | 60 requests | 1 minute | Message creation/editing |
| File Upload | 30 requests | 1 minute | File/voice message uploads |
| Workspace Creation | 3 requests | 1 hour | Workspace creation |
| General | 100 requests | 15 minutes | Most other endpoints |

### Handling Rate Limits

```typescript
const handleRateLimit = async (response: Response) => {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After')
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000
    
    console.log(`Rate limited. Waiting ${waitTime}ms...`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    
    // Retry the request
    return true
  }
  return false
}
```

---

## 🔧 Development Tools

### Health Check
```typescript
GET /api/v1/health
// Returns server, database, and Redis status
```

### API Information
```typescript
GET /api/v1/
// Returns API version and available endpoints
```

### Environment Detection
```typescript
// Check if running in development mode
GET /api/v1/auth/dev-status

// Development login (no password required)
POST /api/v1/auth/dev-login
{
  "email": "dev@example.com",
  "name": "Dev User"
}
```

### Database Health
The API connects to multiple databases:
- **PostgreSQL**: Primary data (users, workspaces, messages)
- **Redis**: Caching and sessions
- **MongoDB**: Change streams and real-time events

Check `/api/v1/health` for database connection status.

---

## 📝 Implementation Checklist

### Authentication
- [ ] Implement JWT token storage (localStorage/secure storage)
- [ ] Handle automatic token refresh
- [ ] Implement logout and clear tokens
- [ ] Handle authentication errors gracefully

### WebSocket Connection
- [ ] Establish WebSocket connection with auth token
- [ ] Handle connection/disconnection events
- [ ] Implement automatic reconnection
- [ ] Join appropriate rooms based on user context

### Core Features
- [ ] Workspace management (create, join, leave)
- [ ] Channel management (create, join, permissions)
- [ ] Real-time messaging with WebSocket
- [ ] File upload with progress indicators
- [ ] Voice message recording and playback
- [ ] Task management with real-time updates
- [ ] Direct messaging between users

### UI/UX Considerations
- [ ] Show typing indicators
- [ ] Display user presence (online/offline)
- [ ] Handle message reactions
- [ ] Implement message threading
- [ ] Show upload progress
- [ ] Display error messages appropriately
- [ ] Handle offline/online states

### Performance
- [ ] Implement message pagination
- [ ] Cache user and workspace data
- [ ] Optimize image/file loading
- [ ] Implement lazy loading for channels/messages

---

## 🎯 Getting Started

1. **Set up authentication flow** - Start with login/register
2. **Implement workspace selection** - Users need to choose/create workspace
3. **Build channel list and messaging** - Core chat functionality
4. **Add WebSocket for real-time updates** - Live messaging experience
5. **Implement file uploads** - Enhanced messaging with attachments
6. **Add task management** - Productivity features
7. **Polish with presence indicators and notifications** - Professional experience

This API provides everything needed to build a complete team collaboration platform like Slack or Discord. The WebSocket implementation ensures real-time updates, while the REST API handles all CRUD operations efficiently.

For questions or clarifications about any endpoint, check the source code in `/src/routes/` and `/src/controllers/` or reach out to the backend team.