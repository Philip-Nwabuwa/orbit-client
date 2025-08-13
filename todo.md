## Project TODO

### Core chat and data model

- [ ] Move messages to backend API with WebSocket realtime updates (send/edit/delete, reactions, threads)
- [ ] Persist messages and user presence across reloads; optimistic UI on send/reaction
- [ ] Sanitize/markdown-render message content (mentions, links, code blocks)

### Threads

- [ ] Show thread chip under root messages with avatar preview and last reply time
- [ ] Open thread in right panel (InfoPanel replacement) and from message action (sheet) – unify header actions
- [ ] “Also send to channel” option (done in sheet) – add to inline panel and keep state per thread
- [ ] Support attachments in thread replies (images, voice, files)
- [ ] Thread count badges in `LinkedThreads` + jump to specific reply

### Reactions

- [ ] Track per-user reaction state (not just counts); highlight when current user reacted
- [ ] Long-press/hover reaction bar with most-used and recents; keyboard navigation for picker
- [ ] Handle reaction updates from server; debounce bulk updates

### Forwarding

- [ ] Include quoted preview block with link back to original message
- [ ] Preserve and re-upload attachments when forwarding to channels/DMs
- [ ] Audit attribution text, add “Go to original” action

### Drafts & Scheduled

- [ ] Image/file draft persistence (object URL lifecycle, revoke on discard)
- [ ] Scheduled messages: model, schedule UI, edit/cancel, and execution
- [ ] Draft badge counter per sidebar group; surface last edited time in `/drafts`

### Saved Items

- [ ] Store snapshot (author, text, time, attachments) rather than resolving from live message store
- [ ] Add unsave from message hover; show breadcrumb (channel/DM) in list
- [ ] Add search facets (author, channel, date)

### Inbox and DMs

- [ ] Group inbox by date (Today, Yesterday, Older) with unread separators and bulk mark-as-read
- [ ] DM landing: recent conversations with unread, online presence, and pin/favorite controls
- [ ] Add “Start new DM” modal with search

### Right panel parity

- [ ] Channel and DM panels share common tab framework (Info, Pins, Files, Links)
- [ ] Files/Links tabs: index from messages; thumbnails, type filters, open-in-context
- [ ] Replace InfoPanel with Thread view contextually; provide back navigation

### Navigation & routing

- [ ] Ensure every workspace has a General channel (seed if missing); redirect `/w/:id` → General
- [ ] Link Profile and Settings to real routes; add profile menu actions wiring (status, DND)

### Message list UX

- [x] Virtualize `MessageList` for large histories; infinite scroll + day dividers
- [ ] Improve scroll anchoring on new messages vs. manual scroll
- [ ] Image gallery grid polish and full-screen viewer for multi-image

### Accessibility

- [ ] Keyboard support for emoji picker, popovers, dialogs
- [ ] Focus management on opening/closing panes and sheets
- [ ] ARIA roles/labels for message actions and counts

### Performance & stability

- [ ] Fix hydration edge cases beyond Grammarly (fonts, random IDs, time formatting)
- [ ] Audit Next/Image remotePatterns for avatars and file previews
- [ ] Memoize heavy lists; avoid re-renders on global store changes

### Testing & QA

- [ ] Add unit tests for stores (messages, drafts, saved) and components (MessageItem, ThreadPane)
- [ ] E2E flows: send message, add reaction, start thread, forward, save/unsave, drafts
- [ ] Lint/typecheck CI; preview deploy

### Documentation

- [ ] README: architecture, local dev, feature flags, data model (threads, reactions)
- [ ] Contributing guide and code style notes

### Nice-to-haves

- [ ] Emoji autocomplete `:` and mention autocomplete `@` in composer
- [ ] Quick actions in thread header (follow thread, mute)
- [ ] Presence/typing indicators in threads and DMs
