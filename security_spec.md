# Firebase Security Specification

## Data Invariants
1. **Listings**:
   - Anyone (authenticated) can read listings.
   - Only the authenticated creator of a listing (matching `sellerId`) can create, update, or delete it.
   - Listings cannot be modified in a way that shifts `sellerId` or `sellerEmail`.
   - Creation time `createdAt` must be verified.
2. **Shops**:
   - Anyone can read shop profiles.
   - Only the authenticated owner (matching `ownerId`) can create or modify their Virtual Shop.
   - `ownerId` is immutable.
3. **ChatSessions**:
   - Only the authenticated participants of a session (`buyerId` or `sellerId`) can create, read, or get messages.
   - Messages can only be written to a chat session if the sender matches `senderId` and is one of the session participants.
4. **User Profiles**:
   - Users can only read, create, and write to their own profile isolated in `/users/{userId}/profile/info`.

## The "Dirty Dozen" Payloads (Anti-Spoofing & Attribute-Based Tests)
1. **Identity Spoofing - Listing**: Alter `sellerId` of a listing during creation to hijack authorship. Expect: `PERMISSION_DENIED`.
2. **Identity Hijacking - Shop**: Create a shop with an `ownerId` that matches another user's ID. Expect: `PERMISSION_DENIED`.
3. **Privilege Modification - Profile**: Modify and hijack another user's private settings in `/users/{hostileUserId}/profile/info`. Expect: `PERMISSION_DENIED`.
4. **Orphaned Writes - Sibling/Chat**: Write message to session `/chats/session_foo/messages/msg_bar` while not a participant of `chats/session_foo`. Expect: `PERMISSION_DENIED`.
5. **Rogue Field Poisoning - Listing**: Inject random admin flags or views payload into a listing update block. Expect: `PERMISSION_DENIED` thanks to strict field checking.
6. **Bypassing Verification**: Authenticate as non-verified email or anonymous user to create listings. Expect: `PERMISSION_DENIED` since `email_verified == true` is required.
7. **Temporal Violation - Timestamp**: Set creation timestamp `createdAt` as a manual past date rather than `request.time`. Expect: `PERMISSION_DENIED`.
8. **Eavesdropping Chats**: Read chat documents in `/chats` as a client that does not own the conversation. Expect: `PERMISSION_DENIED`.
9. **Junk ID Poisoning**: Create listing with a huge junk string ID or SQL injection payload. Expect: `PERMISSION_DENIED` via `isValidId()` regex check.
10. **Shadow Profile Spying**: Run a broad listing query of private profiles without restricting to personal users. Expect: `PERMISSION_DENIED`.
11. **Immortal Key Alteration**: Change immutable `createdAt` field on existing listing during updates. Expect: `PERMISSION_DENIED`.
12. **Unauthenticated Scrapes**: Read list collection of raw chats without being an authenticated user. Expect: `PERMISSION_DENIED`.
