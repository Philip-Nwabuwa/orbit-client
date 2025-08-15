# Collabix Development Todo

This todo.md file outlines the complete development roadmap for integrating the Collabix client application with the backend API. The phases are organized to build upon each other systematically.

## Project Status Overview

- ✅ **Frontend Architecture**: Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- ✅ **State Management**: Zustand stores for channels, messages, members, tasks, etc.
- ✅ **UI Components**: shadcn/ui components, responsive layouts, sidebar system
- ✅ **Routing Structure**: Workspace/channel/DM routing with nested layouts
- 🔄 **API Integration**: Needs implementation (covered in this todo)
- ❌ **Real-time Features**: WebSocket integration required
- ❌ **Authentication**: JWT token management needs implementation
- ❌ **File Uploads**: API integration for files/voice messages

---

## Phase 1: Authentication & API Foundation

### Task 1.1: API Client Setup

- [ ] Update `/src/lib/api.ts` with proper base URL configuration
- [ ] Implement `APIResponse<T>` interface based on API guide
- [ ] Add proper error handling with `ApiError` class
- [ ] Configure rate limiting headers handling
- [ ] Add retry logic for token refresh and rate limits
- [ ] Test with health check endpoint `/api/v1/health`

### Task 1.2: JWT Token Management

- [ ] Implement secure token storage (localStorage with fallback)
- [ ] Create token refresh mechanism with automatic retry
- [ ] Add token validation checking
- [ ] Implement logout functionality (clear all tokens)
- [ ] Handle token expiration gracefully across the app
- [ ] Add authentication state to Zustand store

### Task 1.3: Authentication Flow Implementation

- [ ] Update `/src/components/auth/LoginFlow.tsx` with API integration
- [ ] Implement registration form with validation
- [ ] Add email verification handling
- [ ] Create development login for testing (`/auth/dev-login`)
- [ ] Add proper error messages for auth failures
- [ ] Implement redirect logic after successful auth

### Task 1.4: User Profile Management

- [ ] Create user profile store with Zustand
- [ ] Implement get user profile API call
- [ ] Add update profile functionality
- [ ] Implement avatar upload with progress indicator
- [ ] Add user settings management (notifications, theme, etc.)
- [ ] Create profile settings page/modal

### Task 1.5: Route Protection

- [ ] Add authentication middleware for protected routes
- [ ] Implement workspace access validation
- [ ] Add loading states during auth checks
- [ ] Handle unauthorized access gracefully
- [ ] Create proper redirect flows

**Validation:**

- [ ] Test complete auth flow from registration to logout
- [ ] Verify token refresh works automatically
- [ ] Confirm protected routes redirect properly
- [ ] Test development login functionality

---

## Phase 2: Core Workspace & Channel Functionality

### Task 2.1: Workspace Management

- [ ] Update workspace store with API integration
- [ ] Implement create workspace functionality
- [ ] Add get user workspaces API call
- [ ] Implement workspace selection/switching
- [ ] Add workspace settings management
- [ ] Create workspace member management

### Task 2.2: Channel System Integration

- [ ] Update `/src/store/channelStore.ts` with API calls
- [ ] Implement create channel functionality
- [ ] Add channel hierarchy support (nested channels)
- [ ] Implement channel permissions (private/public)
- [ ] Add channel member management
- [ ] Update channel list UI with real data

### Task 2.3: Channel Navigation & UI

- [ ] Update `/src/components/Sidebar/ChannelList.tsx` with API data
- [ ] Implement channel creation modal
- [ ] Add channel settings panel
- [ ] Implement channel member addition/removal
- [ ] Add channel favorites functionality
- [ ] Update channel search with API integration

### Task 2.4: Member Management

- [ ] Update `/src/store/memberStore.ts` with API integration
- [ ] Implement workspace member invitation system
- [ ] Add member role management (OWNER, ADMIN, MEMBER)
- [ ] Create member search functionality
- [ ] Implement member profile views
- [ ] Add member removal functionality

### Task 2.5: Navigation & Routing

- [ ] Implement dynamic workspace routing
- [ ] Add channel/DM URL generation
- [ ] Update navigation store with API data
- [ ] Implement breadcrumb navigation
- [ ] Add deep linking support
- [ ] Handle invalid workspace/channel IDs

**Validation:**

- [ ] Test workspace creation and switching
- [ ] Verify channel creation and permissions
- [ ] Confirm member management works correctly
- [ ] Test navigation between channels and workspaces

---

## Phase 3: Real-time Messaging with WebSocket

### Task 3.1: WebSocket Connection Setup

- [ ] Update `/src/lib/socket.ts` with authentication
- [ ] Implement connection management (connect/disconnect/reconnect)
- [ ] Add room joining logic (workspace, channel, DM rooms)
- [ ] Handle connection errors and retry logic
- [ ] Implement heartbeat/ping mechanism
- [ ] Add connection status indicators

### Task 3.2: Message Store Integration

- [ ] Update `/src/store/messageStore.ts` with API calls
- [ ] Implement send message functionality
- [ ] Add message pagination with cursor-based loading
- [ ] Implement message editing and deletion
- [ ] Add message reactions system
- [ ] Implement message threading

### Task 3.3: Real-time Message Handling

- [ ] Implement message_created WebSocket event handling
- [ ] Add message_updated and message_deleted events
- [ ] Implement reaction events (added/removed)
- [ ] Add typing indicators system
- [ ] Implement user presence updates
- [ ] Handle message threading events

### Task 3.4: Message Composer Enhancement

- [ ] Update `/src/components/ChannelView/MessageComposer.tsx` with API
- [ ] Add mention system (@user autocomplete)
- [ ] Implement message drafts saving
- [ ] Add emoji picker integration
- [ ] Implement message formatting (bold, italic, code)
- [ ] Add file attachment UI (prepare for Phase 4)

### Task 3.5: Message Display & Threading

- [ ] Update `/src/components/ChannelView/MessageItem.tsx` with real data
- [ ] Implement message threading UI
- [ ] Add reaction display and interaction
- [ ] Implement message editing inline
- [ ] Add message context menu (delete, reply, etc.)
- [ ] Update virtualized message list with real data

### Task 3.6: Typing Indicators

- [ ] Update `/src/store/typingStore.ts` with WebSocket events
- [ ] Implement typing start/stop emission
- [ ] Add typing indicator UI in channel header
- [ ] Handle multiple users typing
- [ ] Add DM typing indicators
- [ ] Implement proper cleanup on unmount

**Validation:**

- [ ] Test real-time message sending and receiving
- [ ] Verify typing indicators work correctly
- [ ] Confirm message threading functionality
- [ ] Test reconnection after network issues

---

## Phase 4: File Uploads & Voice Messages

### Task 4.1: File Upload Infrastructure

- [ ] Implement file upload API integration
- [ ] Add progress tracking for uploads
- [ ] Implement multiple file upload support
- [ ] Add file type validation and size limits
- [ ] Create file preview generation
- [ ] Implement upload cancellation

### Task 4.2: Image Handling

- [ ] Update message store to handle image attachments
- [ ] Implement image preview in messages
- [ ] Add image viewer modal functionality
- [ ] Implement image compression before upload
- [ ] Add image drag-and-drop support
- [ ] Create image gallery view

### Task 4.3: Voice Message System

- [ ] Update `/src/components/common/VoiceRecorder.tsx` with API
- [ ] Implement voice message recording
- [ ] Add voice message upload functionality
- [ ] Update `/src/components/common/AudioPlayer.tsx` for playback
- [ ] Add voice message waveform visualization
- [ ] Implement voice message duration display

### Task 4.4: File Management

- [ ] Create file browser/manager component
- [ ] Implement file search functionality
- [ ] Add file sharing between channels
- [ ] Implement file deletion functionality
- [ ] Create file organization system
- [ ] Add file download functionality

### Task 4.5: Drag & Drop Enhancement

- [ ] Update `/src/lib/dragAndDrop.ts` with API integration
- [ ] Implement drag-and-drop file uploads
- [ ] Add visual feedback for drag operations
- [ ] Implement paste image functionality
- [ ] Add multiple file handling
- [ ] Create upload queue management

**Validation:**

- [ ] Test file uploads with progress tracking
- [ ] Verify voice message recording and playback
- [ ] Confirm drag-and-drop functionality
- [ ] Test file management features

---

## Phase 5: Direct Messages

### Task 5.1: DM Store Integration

- [ ] Update `/src/store/directMessagesStore.ts` with API calls
- [ ] Implement create DM conversation functionality
- [ ] Add DM list retrieval
- [ ] Implement DM message sending
- [ ] Add DM-specific WebSocket room handling
- [ ] Implement DM search functionality

### Task 5.2: DM UI Components

- [ ] Update `/src/components/DirectMessage/DMView.tsx` with real data
- [ ] Implement DM header with user info
- [ ] Add DM info panel functionality
- [ ] Update DM list in sidebar with API data
- [ ] Implement DM creation modal
- [ ] Add DM notification management

### Task 5.3: DM Real-time Features

- [ ] Implement DM WebSocket event handling
- [ ] Add DM typing indicators
- [ ] Implement DM user presence
- [ ] Add DM file sharing
- [ ] Implement DM voice messages
- [ ] Add DM message threading

### Task 5.4: User Discovery

- [ ] Implement user search for DM creation
- [ ] Add user profile views
- [ ] Implement user status management
- [ ] Add user blocking functionality
- [ ] Create user directory/contacts
- [ ] Implement friend/contact system

**Validation:**

- [ ] Test DM creation and messaging
- [ ] Verify DM real-time features
- [ ] Confirm DM file sharing works
- [ ] Test user discovery and profiles

---

## Phase 6: Task Management

### Task 6.1: Task Store Integration

- [ ] Update `/src/store/taskStore.ts` with API calls
- [ ] Implement create task functionality
- [ ] Add task retrieval and filtering
- [ ] Implement task status updates
- [ ] Add task assignment system
- [ ] Implement task search and filtering

### Task 6.2: Task UI Components

- [ ] Update `/src/components/Tasks/TaskCard.tsx` with real data
- [ ] Implement task creation sheet with API
- [ ] Update task details sheet functionality
- [ ] Add task board views (kanban, list)
- [ ] Implement task filtering and sorting
- [ ] Add task bulk operations

### Task 6.3: Task Real-time Features

- [ ] Implement task WebSocket event handling
- [ ] Add real-time task updates
- [ ] Implement task assignment notifications
- [ ] Add task comment system
- [ ] Implement task activity tracking
- [ ] Add task due date notifications

### Task 6.4: Task Advanced Features

- [ ] Implement task attachments
- [ ] Add task dependencies
- [ ] Implement task templates
- [ ] Add task time tracking
- [ ] Implement task reporting
- [ ] Add task export functionality

### Task 6.5: Task Board Views

- [ ] Update `/src/components/Tasks/TaskBoard.tsx` with API
- [ ] Implement daily task board functionality
- [ ] Update weekly task board with real data
- [ ] Add task drag-and-drop between statuses
- [ ] Implement task calendar view
- [ ] Add task timeline view

**Validation:**

- [ ] Test task creation and management
- [ ] Verify real-time task updates
- [ ] Confirm task board functionality
- [ ] Test task notifications and assignments

---

## Phase 7: Advanced Features & Polish

### Task 7.1: Search & Discovery

- [ ] Implement global search functionality
- [ ] Add message search within channels
- [ ] Implement file search capabilities
- [ ] Add user/channel search
- [ ] Implement search filters and sorting
- [ ] Add search result highlighting

### Task 7.2: Notifications System

- [ ] Implement push notification support
- [ ] Add email notification preferences
- [ ] Create notification center UI
- [ ] Implement notification batching
- [ ] Add notification sound customization
- [ ] Implement do-not-disturb mode

### Task 7.3: User Presence & Status

- [ ] Implement user online/offline detection
- [ ] Add custom status messages
- [ ] Implement presence indicators in UI
- [ ] Add automatic away status
- [ ] Implement presence in member lists
- [ ] Add presence-based features

### Task 7.4: Performance Optimizations

- [ ] Implement message virtualization improvements
- [ ] Add image lazy loading
- [ ] Implement data caching strategies
- [ ] Add offline support basics
- [ ] Implement connection optimization
- [ ] Add performance monitoring

### Task 7.5: Mobile Responsiveness

- [ ] Optimize mobile navigation
- [ ] Implement touch gestures
- [ ] Add mobile-specific UI adjustments
- [ ] Implement mobile file handling
- [ ] Add mobile keyboard handling
- [ ] Optimize mobile performance

### Task 7.6: Accessibility & UX

- [ ] Add keyboard navigation support
- [ ] Implement screen reader compatibility
- [ ] Add focus management
- [ ] Implement proper ARIA labels
- [ ] Add color contrast compliance
- [ ] Implement accessibility testing

### Task 7.7: Error Handling & Resilience

- [ ] Implement comprehensive error boundaries
- [ ] Add retry mechanisms for failed requests
- [ ] Implement offline state handling
- [ ] Add graceful degradation
- [ ] Implement error reporting
- [ ] Add recovery mechanisms

**Validation:**

- [ ] Test search functionality across all content types
- [ ] Verify notification system works correctly
- [ ] Confirm mobile responsiveness
- [ ] Test accessibility compliance
- [ ] Verify error handling robustness

---

## Phase 8: Testing & Deployment

### Task 8.1: Unit Testing

- [ ] Add tests for API client functionality
- [ ] Test Zustand stores behavior
- [ ] Add component testing with React Testing Library
- [ ] Test WebSocket connection handling
- [ ] Add authentication flow testing
- [ ] Test error handling scenarios

### Task 8.2: Integration Testing

- [ ] Test complete user flows
- [ ] Add real-time feature testing
- [ ] Test file upload scenarios
- [ ] Add cross-browser testing
- [ ] Test mobile functionality
- [ ] Add performance testing

### Task 8.3: End-to-End Testing

- [ ] Add Playwright/Cypress tests
- [ ] Test complete user journeys
- [ ] Add multi-user scenario testing
- [ ] Test real-time collaboration
- [ ] Add stress testing
- [ ] Test deployment scenarios

### Task 8.4: Documentation

- [ ] Update component documentation
- [ ] Add API integration guides
- [ ] Create deployment documentation
- [ ] Add troubleshooting guides
- [ ] Update README with setup instructions
- [ ] Create user documentation

### Task 8.5: Production Preparation

- [ ] Configure production API endpoints
- [ ] Add environment variable management
- [ ] Implement logging and monitoring
- [ ] Add security headers
- [ ] Configure CDN for assets
- [ ] Add SSL/TLS configuration

**Validation:**

- [ ] All tests pass consistently
- [ ] Performance benchmarks meet requirements
- [ ] Security audit completed
- [ ] Documentation is complete and accurate
- [ ] Production deployment successful

---

## Legacy Features (From Previous Todo)

### UI/UX Enhancements

- [ ] Show thread chip under root messages with avatar preview and last reply time
- [ ] Open thread in right panel (InfoPanel replacement) and from message action (sheet)
- [ ] "Also send to channel" option – add to inline panel and keep state per thread
- [ ] Support attachments in thread replies (images, voice, files)
- [ ] Thread count badges in `LinkedThreads` + jump to specific reply
- [ ] Track per-user reaction state (not just counts); highlight when current user reacted
- [ ] Long-press/hover reaction bar with most-used and recents; keyboard navigation for picker
- [ ] Include quoted preview block with link back to original message when forwarding
- [ ] Preserve and re-upload attachments when forwarding to channels/DMs
- [ ] Image/file draft persistence (object URL lifecycle, revoke on discard)
- [ ] Scheduled messages: model, schedule UI, edit/cancel, and execution
- [ ] Draft badge counter per sidebar group; surface last edited time in `/drafts`
- [ ] Store saved items snapshot (author, text, time, attachments) rather than resolving from live message store
- [ ] Add unsave from message hover; show breadcrumb (channel/DM) in list
- [ ] Add search facets (author, channel, date) for saved items
- [ ] Group inbox by date (Today, Yesterday, Older) with unread separators and bulk mark-as-read
- [ ] DM landing: recent conversations with unread, online presence, and pin/favorite controls
- [ ] Add "Start new DM" modal with search
- [ ] Channel and DM panels share common tab framework (Info, Pins, Files, Links)
- [ ] Files/Links tabs: index from messages; thumbnails, type filters, open-in-context
- [ ] Replace InfoPanel with Thread view contextually; provide back navigation
- [ ] Ensure every workspace has a General channel (seed if missing); redirect `/w/:id` → General
- [ ] Link Profile and Settings to real routes; add profile menu actions wiring (status, DND)
- [x] Virtualize `MessageList` for large histories; infinite scroll + day dividers
- [ ] Improve scroll anchoring on new messages vs. manual scroll
- [ ] Image gallery grid polish and full-screen viewer for multi-image
- [ ] Keyboard support for emoji picker, popovers, dialogs
- [ ] Focus management on opening/closing panes and sheets
- [ ] ARIA roles/labels for message actions and counts
- [ ] Fix hydration edge cases beyond Grammarly (fonts, random IDs, time formatting)
- [ ] Audit Next/Image remotePatterns for avatars and file previews
- [ ] Memoize heavy lists; avoid re-renders on global store changes
- [ ] Add unit tests for stores (messages, drafts, saved) and components (MessageItem, ThreadPane)
- [ ] E2E flows: send message, add reaction, start thread, forward, save/unsave, drafts
- [ ] Lint/typecheck CI; preview deploy
- [ ] README: architecture, local dev, feature flags, data model (threads, reactions)
- [ ] Contributing guide and code style notes
- [ ] Emoji autocomplete `:` and mention autocomplete `@` in composer
- [ ] Quick actions in thread header (follow thread, mute)
- [ ] Presence/typing indicators in threads and DMs

---

## Development Guidelines

### Code Quality Standards

- Follow TypeScript strict mode requirements
- Use consistent naming conventions (camelCase for variables/functions, PascalCase for components)
- Implement proper error handling in all API calls
- Add proper loading states for all async operations
- Use the existing Zustand patterns for state management

### Performance Considerations

- Implement proper memoization for expensive computations
- Use React.memo for components that don't need frequent re-renders
- Implement proper cleanup in useEffect hooks
- Use virtualization for large lists (messages, members)
- Implement proper image optimization and lazy loading

### Security Practices

- Never store sensitive data in localStorage without encryption
- Validate all user inputs before API calls
- Implement proper CSRF protection
- Use secure WebSocket connections in production
- Follow secure coding practices for file uploads

### Testing Strategy

- Write tests for all API integration functions
- Test error scenarios and edge cases
- Implement proper mocking for external dependencies
- Add integration tests for critical user flows
- Test real-time features with multiple concurrent users

## Priority Notes

**Highest Priority (Must Complete First):**

- Phase 1 (Authentication) - Required for all other phases
- Phase 2 (Workspace/Channels) - Core functionality
- Phase 3 (Real-time Messaging) - Primary feature

**Medium Priority:**

- Phase 4 (File Uploads) - Enhances messaging
- Phase 5 (Direct Messages) - Important for collaboration
- Phase 6 (Task Management) - Productivity features

**Nice to Have:**

- Phase 7 (Advanced Features) - Polish and UX improvements
- Phase 8 (Testing/Deployment) - Production readiness

This roadmap ensures systematic development of the Collabix application, building from core authentication to advanced collaboration features while maintaining code quality and performance standards.
