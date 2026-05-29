---
title: "What I Learned Building Otaku Community"
description: "Lessons from designing a full-stack platform for anime and manga fans — from modular architecture and fan-out on write, to async media uploads and the over-engineering trap."
publishDate: 2025-12-20
tags: ["java", "spring-boot", "architecture", "personal"]
draft: false
---

The best way to learn system design is to build something you actually care about — and then watch it fall apart under your own assumptions.

[Otaku Community](https://otaku-community.vercel.app) is a full-stack social platform connecting anime and manga fans, translators, and content creators. Posts, follows, feeds, comments, notifications, media uploads — the works. I started it in December 2024 as a personal project, and it's been running ever since. Here's what I learned building it.

![Otaku Community news feed — posts, sidebar navigation, and community panel](/otaku-community-01.png)

---

## Modular Architecture: Designing for Sanity, Not Just Functionality

The first real decision I made was structural. Rather than lumping everything into layers (controllers here, services there, repositories everywhere), I organized the backend into independent feature modules — User, Post, Comment, Notification, Integration — where each module owns its controller, service, repository, and domain logic end-to-end.

It sounds simple, but it changes how you think about the codebase. When something breaks in the notification flow, you go to the Notification module. When you need to add a feature to posts, everything you need is colocated. No hunting across packages to piece together what a single feature actually does.

This structure also made it easier to reason about boundaries. Each module has a clear responsibility, which meant I could add features — or remove them — without worrying about cascading side effects across the whole system. That discipline paid off when the scope of the project grew.

![User profile page — bio, favorite character, anime/manga favorites, and activity tabs](/otaku-community-user-profile-01.png)

---

## The Feed Problem: Cursor-Based Pagination + Fan-Out on Write

Building a news feed surfaces two problems at once: how to paginate it, and how to populate it.

For pagination, I went with **cursor-based** rather than offset-based. Offset pagination breaks under concurrent writes — if someone posts while a user is scrolling, records shift and you get duplicates or skipped items. Cursor-based pagination anchors to the last seen item, making infinite scrolling smooth and consistent regardless of what's happening on the write side.

For population, I used **asynchronous fan-out on write**. When a user creates a post, a background job distributes it to each follower's feed immediately — so when followers open their feeds, the data is already there. Reads are instant; the cost lives on the write side.

The tradeoff is write amplification: one post triggers many inserts. For a platform of this scale, that's manageable. But it forced me to think carefully about batching those background writes efficiently rather than firing them one by one. Redis helped here — both as a cache layer and as a coordination point for keeping feed state consistent.

---

## Async Media Uploads: Killing the Spinner

Early on, image and video uploads were synchronous. The user clicked upload, the server processed the file, and then — eventually — responded. On anything but a perfect connection: a frozen UI and a spinner that inspired no confidence.

The fix was moving all media processing into an **async batch pipeline**. The upload request returns immediately. A background worker picks up the job, processes the file (resizing, format conversion, storage), and pushes real-time progress updates back to the client via **WebSocket**. Users see 0%, 25%, 50%, done — without the request ever blocking.

The reliability improvement mattered more than the UX improvement. When processing fails, the job retries. The user doesn't need to resubmit anything. That kind of resilience is invisible when it works, but it's the difference between a platform that feels solid and one that doesn't.

---

![Anime Discovery page — seasonal and top anime browsing with grid layout](/otaku-community-02.png)

## Auth0 and Not Rolling Your Own Auth

I integrated **Auth0** for authentication rather than building it from scratch. At first this felt like a cop-out — surely I should understand auth by implementing it myself?

In hindsight, it was the right call. Auth is one of those areas where the implementation details are deceptively complex and the failure modes are serious. Delegating it to a proven provider meant I got OAuth flows, token management, and social login out of the box, secured by people whose entire job is getting auth right. That freed me to spend time on the parts of the system that were actually unique to this project.

The integration with Spring Security was straightforward once I understood how JWT validation fit into the filter chain. That understanding was worth more than any custom auth code I might have written.

---

## The Over-Engineering Trap

Here's the one I'm most embarrassed about: I over-built the notification system before I had a single real user.

I designed multi-channel delivery, priority queues, per-user preference routing, and delivery receipts. It was technically interesting. It was also completely unnecessary for a project with zero traffic. I spent weeks on infrastructure that could have been a database table and a polling endpoint.

The rule I follow now: **build the simplest thing that could work, then optimize when real data shows you where the bottleneck actually is.** The notification system I have today is simpler, faster, and took a fraction of the time. Premature architectural complexity doesn't just waste time — it locks you into decisions before you have the information to make them well.

---

## What I'd Do Differently

**Invest more in the data model upfront.** I changed my schema multiple times mid-build because I hadn't thought through relationships carefully enough. Liquibase migrations saved me, but an afternoon of whiteboarding would have saved days of rework.

**Ship earlier.** I kept polishing before showing it to anyone. The first real feedback I got changed a core feature. All that polish was on something that changed anyway.

**Write integration tests sooner.** Unit tests against mocked services gave me false confidence. The real edge cases showed up only when I integrated the actual database and message queue. Integration tests are slower — they're also the only tests that tell you whether the system actually works.

---

## The Stack, In Full

**Backend:** Java, Spring Boot, Spring Security, Auth0, WebSocket  
**Data:** PostgreSQL, Redis, Liquibase  
**Frontend:** React, TypeScript  
**Infrastructure:** Vercel (frontend), Auth0 (identity)

[Live demo](https://otaku-community.vercel.app) · [Source code](https://github.com/KhoaLy2003/otaku-community)

---

Building Otaku Community taught me more about system design than any course did — because the consequences were real, even if small. A bad pagination strategy doesn't fail a test; it breaks the scroll experience. An over-engineered component costs you weeks, not points.

Build things you care about. Make the mistakes. Pay attention to why things break. That's where the real learning happens.
