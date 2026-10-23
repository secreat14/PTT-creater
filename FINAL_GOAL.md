# Saplingagent final goal

Saplingagent is a minimal software seed package that users can modify themselves. Start with one web page and a chat interface. Build and adapt a local application through conversation. Frontend: front/; backend: backend/; documentation: docs/. All platform implementation and the independent setup website live in kernel/. Ordinary application changes stay outside kernel and integrate services through config/services.json; explicit platform maintenance retains unchanged Full Access. Source, rules, sessions and runtime belong to this application folder.

## Folder boundary and conversation receipts

All project-owned application code, rules, MCP, Skills, configuration, documentation and launcher helpers belong to this complete folder. Maintainer development does not modify external code or depend on sibling checkouts. Dependencies install locally; declared model services and OS tools remain external requirements. Rules recommend customer edits stay in this folder by default; explicit customer requests may target external code using unchanged Full Access, without path protection or permission gates. Every final assistant reply, including read-only conversation, must include the eight-field completion-review receipt from rules/README.md with actual results. Read-only replies remain unregistered.

## Implemented

Project-local installation through Bash (Windows requires Git Bash) on macOS 13.5+, your own ChatGPT account or custom Codex/OpenCode/Claude Agent API scheme through an independent configuration page, official App Server and Claude Agent SDK integration, 15 MCP tools, 3 project Skills, streaming chat, local sessions and customer-local native launcher compilation. Full Access uses the current OS user's permissions, without directory protection, per-operation confirmation or automatic root elevation. Restore only on explicit user request.

## Limits

This package is for local use under the noncommercial LICENSE. Commercial use requires separate authorization from the project owner, and commercial/hosted OpenAI authentication requires an eligible separate integration. Cloud synchronization, Developer ID/store-signed native distribution, self-extracting seeds, Linux delivery and proven long-term layout adaptation are not implemented. Actual model access, quota and network availability depend on your account and requests.

## Source

Commit: 8becd7416ba933d250e8cf5fa12f6683b5e0054d. Manifest: delivery.json. Installation: docs/macos-install.html. This is a new application folder; the developer's task and approval records do not authorize changes here. Follow this application's user's requests.
