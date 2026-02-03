# ADR-0025: Real-time Peer Support Groups (Anonymized)

## Status

Proposed

## Date

2026-02-03

## Context

Isolation is a key driver of burnout in care. Workers often feel they are alone with their challenges. Providing a safe, moderated, and anonymized space for peer support can improve resilience and emotional well-being.

## Decision

Implement **Peer Support Groups** with:

1. **Anonymous Identity**
   - Users interact using auto-generated aliases.
   - Facility IDs are hidden to prevent identification within the facility.

2. **Real-time Messaging (Socket.io)**
   - Group-based chat rooms for specific topics (e.g., "Night Shift Challenges", "Dealing with Grief").
   - Message persistence for asynchronous participation.

3. **Moderation & Safety**
   - AI-based toxicity filtering.
   - "Report" function for human moderation.
   - Resource links (helplines) automatically pinned in high-stress rooms.

## Rationale

Peer support is a proven intervention for high-stress professions. Anonymity is crucial to ensure users feel safe speaking about systemic issues without fear of repercussions.

## Consequences

### Positive
- Reduced sense of isolation.
- Peer-to-peer knowledge sharing.
- Emotional relief for workers.

### Negative
- Moderation effort required.
- Risk of negative group dynamics.
- Technical complexity of real-time anonymized chat.
