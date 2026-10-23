# AI task coordination

## Coordination

- Authoritative index: root AI_TASKS.md; progress: TODO.md.
- No task is claimed and no AI is currently executing.
- Source commit: 8becd7416ba933d250e8cf5fa12f6683b5e0054d.
- Git is not initialized. Future parallel development follows rules/14 to locate coordination and separate worktrees.

## Current tasks

- `TASK-20261023-012` — Codex/root; project-level repository initialization and authorized publication of the current application snapshot to `https://github.com/secreat14/PTT-creater.git` on `main`. Scope: inspect and exclude credentials/runtime/cache/log/dependency/build artifacts, initialize this application folder as its own Git repository, create the initial `main` commit, configure the requested remote and push, then verify the remote branch SHA. Preserve the parent repository and sibling projects. Runtime attribution: `RUN-80b0f3fb-a15c-4c51-a083-06fac9601517`. Status: registered/in progress.

<!-- seedagent-runtime-tasks:start -->

## Saplingagent runtime task records

agent-runtime maintains this section serially. Modification tools attempt to register the user request reference and actual scope before execution; registration is nonblocking, and the final record reflects the actual turn status. Ordinary chat and read-only research save sessions without updating this task index. The latest 50 entries appear here; history remains in backend/agent-runtime/ai-tasks/runtime/. Conversation text is excluded. These runtime records do not change the public rules or replace the authoritative development coordination index.

| Task | Turn status | Last update | Details |
| --- | --- | --- | --- |
| RUN-f915a2df-06b4-47a5-97d6-765069475c98 | completed | 2026-10-21T18:32:06.626Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-f915a2df-06b4-47a5-97d6-765069475c98.md) |
| RUN-18b50f1c-a37c-4bac-98bf-b1cfc4d2669e | completed | 2026-10-21T18:33:46.214Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-18b50f1c-a37c-4bac-98bf-b1cfc4d2669e.md) |
| RUN-5e5926d1-164d-4f87-a913-7d51bb4d9b44 | completed | 2026-10-21T22:41:32.947Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-5e5926d1-164d-4f87-a913-7d51bb4d9b44.md) |
| RUN-53d73869-94d0-497d-81e7-89431f9bc01e | completed | 2026-10-21T22:52:22.477Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-53d73869-94d0-497d-81e7-89431f9bc01e.md) |
| RUN-435d8b9a-a745-4841-98c3-a7cc1d09de4a | completed | 2026-10-21T23:38:45.432Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-435d8b9a-a745-4841-98c3-a7cc1d09de4a.md) |
| RUN-444fa945-605d-44e0-be9d-08a893460528 | completed | 2026-10-21T23:42:53.820Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-444fa945-605d-44e0-be9d-08a893460528.md) |
| RUN-dc658099-6c9f-4f92-bd81-f9bd79d880ff | completed | 2026-10-21T23:52:36.662Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-dc658099-6c9f-4f92-bd81-f9bd79d880ff.md) |
| RUN-0cb75171-dbcb-4467-bc0d-9f77e540e2c5 | completed | 2026-10-22T02:41:46.500Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-0cb75171-dbcb-4467-bc0d-9f77e540e2c5.md) |
| RUN-257baeb2-87a0-4113-9f50-ecff34592b9d | completed | 2026-10-22T03:49:38.925Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-257baeb2-87a0-4113-9f50-ecff34592b9d.md) |
| RUN-d04159d9-9166-4ed7-8492-b187e85b21f8 | completed | 2026-10-22T04:14:03.910Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-d04159d9-9166-4ed7-8492-b187e85b21f8.md) |
| RUN-ffe9c3f0-f363-44c3-a15f-dcc2eaec6c7d | completed | 2026-10-22T06:47:04.880Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-ffe9c3f0-f363-44c3-a15f-dcc2eaec6c7d.md) |
| RUN-bd0a0af7-bb1a-4ffc-9620-908004ec78f5 | completed | 2026-10-22T09:43:27.771Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-bd0a0af7-bb1a-4ffc-9620-908004ec78f5.md) |
| RUN-6c2cc3ce-87f8-48b9-b257-362e70f87e8d | completed | 2026-10-22T15:23:22.128Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-6c2cc3ce-87f8-48b9-b257-362e70f87e8d.md) |
| RUN-2056de49-9e54-4fe3-82be-a7385b0e75db | completed | 2026-10-22T22:14:19.877Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-2056de49-9e54-4fe3-82be-a7385b0e75db.md) |
| RUN-80b0f3fb-a15c-4c51-a083-06fac9601517 | inProgress | 2026-10-23T21:31:08.622Z | [Record](backend/agent-runtime/ai-tasks/runtime/RUN-80b0f3fb-a15c-4c51-a083-06fac9601517.md) |

<!-- seedagent-runtime-tasks:end -->


## TASK-20261023-001 — Repair repeated Dock Quit refusal

Codex/root;2026-10-23;rules2026-10-15.1. User identifies this ppt制作与演示 app as repeatedly unable to quit. Scope: adopt the already checked Saplingagent main96a895f gateway response-draining fix and its four-test regression, append related contract/deploy/handoff records, validate idle services, cold-start the corrected owned controller and test native Quit. Existing source8becd741/kernel0.9.5 uses the old leaking gateway; logs contain KERNEL_BUSY twice while live manager is ready/notbusy and Agent activeRuns0. Backups/source hashes are under .cache/dock-quit-fix-20261023/. Preserve all app code/data/credentials/config, original manifest/nativeapp, sibling projects and parent Git. This application is an untracked subtree of a parent Git repository, not a separately initialized repo; no customercommit/push or branch change. RootAI_TASKS/TODO is this application's local authority; no coordination directory exists. Status registered/inprogress; no human acceptance or successful stop yet claimed.


## TASK-20261023-001 — Repair implemented and verified

Codex/root; 2026-10-23; specification 2026-10-15.1 at start and end. The old gateway reproduced the reported idle KERNEL_BUSY refusal. The four upstream regression checks produced two failures on the original file; after adopting gateway.mjs and its test from main 96a895f3c92657a1961d3db1dd622e508732850c (original fix commit 3b972ea), all 47 runtime-manager tests passed, with no failures or skips. No dependency or external API change.

The previously stuck instance was recovered after confirming root/instance/PID ownership, zero active AI runs and successful agent/builder/workspace drain preparation. Only its controller received normal SIGTERM; all owned services exited. The corrected gateway was then cold-started by the existing native app. Runtime status was ready and not busy. Native Command-Q subsequently exited the app, controller, four services, Codex processes and MCP child; all six active service/control ports were released. Native app inventory confirmed isRunning:false. Three unrelated project controllers remained running. The PPT app is left stopped and can be opened normally.

Only gateway.mjs, its four-test regression, appended service contract/deployment notes and this task's records changed. Hash comparison of 606 baseline source files found only the five intended existing-file changes and no missing files. Original kernel0.9.5 manifest and existing native app were retained; this is a targeted patch, not a full kernel upgrade. Source backups and test/lifecycle evidence are in .cache/dock-quit-fix-20261023/. Handoff: kernel/services/runtime-manager/ai-tasks/TASK-20261023-001.md.

The user identified this app; repair and self-check are complete, with no human acceptance claimed. No real model request or native Windows check was performed. This application has no own Git repository and is untracked in its parent repository; no commit, push, branch change or parent Git change. Main already contains this repair and remains 96a895f; release/tags are unchanged. No remaining implementation work for the reproduced failure; user can reopen the app and confirm ordinary use/quit.


## TASK-20261023-011 — Upgrade PPT recipient kernel and verify normal Quit

Codex/root;2026-10-23;specification2026-10-15.1. User explicitly requests upgrading ppt制作与演示 and resolving prior inability to quit. Target /Users/xty/Desktop/projctworks/7.ppt制作/ppt制作与演示, root AI_TASKS/TODO authoritative locally; maintainer coordination is the deployment mirror. Frozen source main5ad5907bdc7b874ebd5686d9322afe197e5c4de2, kernel0.9.6; installed0.9.5/source8becd741 with TASK001 gateway fix and two historical doc additions. Root owns backup, reviewed manifest migration, target-local dependencies/setup build, native rebuild preserving project identity, tests and owned-process lifecycle checks. dock_stop_audit/runtime_stop_audit performed read-only reviews only. Three known local differences are entirely TASK001; preserve its original backup/handoff, adopt upstream fix and archive historical doc text. Application source/config/data/secrets and parent Git remain preserved; no customer Git initialization, commit, push, main/release/tag change, real model request or unrelated-project stop. Status registered/inprogress. Verification and acceptance not yet claimed.


## TASK-20261023-011 — Recipient kernel upgrade completed and Quit verified

Codex/root;2026-10-23;standard2026-10-15.1 start/end. Explicitly authorized ppt制作与演示 recipient upgrade from kernel0.9.5/source8becd741 to frozen main5ad5907bdc7b874ebd5686d9322afe197e5c4de2/kernel0.9.6. This is a local recipient deployment, not main/release synchronization. Exact official manifest and all273 entries verified;127 files applied (81 existing backed up,46 new). Standard journal .runtime/kernel/backups/bf94b670-a714-402f-8058-2a0ec54648fa, phase applied. No baseline regeneration. Three known TASK001 conflicts reviewed: upstream gateway retains its drain fix; old local CONTRACT/DEPLOY appendices survive in backup and original TASK001 handoff. No unknown customer kernel edits found.

Target-local kernel dependencies updated, configuration page rebuilt, and ppt制作与演示.app rebuilt/ad-hoc signed and verified. Project identity d98f6925-9d6b-42cb-b6eb-a656a0a8b947, native bundle ID, artifact name, icon configuration and service cluster preserved. App shows normal Dock entry and new Chinese startup/status text. MIT notices for the upgraded kernel are retained in docs/kernel-0.9.6-{LICENSE,NOTICE}.txt; customer root license and business code were not relicensed or replaced.

Verification:76/76 relevant runtime-manager/Dock/locale/setup/status tests pass with0fail/skip. Standard source recovery tested against all127 journal entries in an isolated copy, with zero mismatch; no recovery applied to the live project. The previous running app was idle(activeRuns0) and exited normally before deployment. The rebuilt native app then completed two independent cold-start→ready→normal Command-Q cycles. First cycle kept both the real PPT page and project status page open. Both cycles closed all9 observed owned native/controller/service/provider/MCP PIDs and all6 active gateway/backend/control ports; macOS reports isRunning:false. Two unrelated project controllers stayed running. Actual PPT slides/navigation and kernel0.9.6 display observed. The app is left stopped for the user to reopen. No real model request, editing of PPT contents, new AI session, Windows hardware test or human acceptance claimed.

Preservation: prior inventory695files;467 nonkernel existing files compared. Application source, config/project identity, authentication files and existing conversation transcripts unchanged. Provider startup updated its own runtime SQLite/WAL/cache/logs and cleaned ephemeral shell/lock files; these are recorded in preservation-check.json and were not restored over live database state. Parent repository HEAD/index/config/packed-refs unchanged. Target has no own Git and remains an untracked parent subtree; no commit, push or branch changes. Maintainer main and release/tag state untouched, including the three pre-existing pending main files.

Evidence and original App: .cache/kernel-upgrade-20261023-011/. Handoff:kernel/launcher/ai-tasks/TASK-20261023-011.md. Human guide:docs/kernel-upgrade-20261023.html. First status check used a double-slash URL and received HTML; corrected to the documented URL before readiness verification. CUA timed out after the first old-app Quit because the app exited; PID/port/native inventory confirmed normal termination. No unresolved upgrade or observed Quit failure; normal future AI-busy shutdown can still require finishing/cancelling work. User acceptance of daily use remains optional/unperformed.
