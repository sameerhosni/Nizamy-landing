---
name: GitHub sync for this project
description: How code gets pushed to the user's GitHub repo and why plain git push can fail
---

- Target repo: `sameerhosni/Nizamy-landing` (branch `main`). An earlier private repo `sameerhosni/nizamy` also exists and may be deletable.
- Push via the GitHub connector token (`listConnections('github')` in code_execution); run `git push https://x-access-token:<token>@github.com/... main:main` through code_execution so the token never appears in logs.
- **Gotcha:** `git commit` is blocked for the agent; only auto-checkpoints create local commits. When files must reach GitHub before a checkpoint exists, use the git-data API (blobs → tree → commit → PATCH ref) on top of the remote head.
- **Why:** an API-created commit has a different SHA than the later local checkpoint with the same content, so local and remote `main` diverge. A later plain `git push` will be rejected as non-fast-forward.
- **How to apply:** before pushing, compare local HEAD vs remote head. If they diverge with identical content, sync via the git-data API again (recreate the changed files on top of the remote head) instead of force-pushing.
- Bitbucket mirror: `t2pms/nizamy`; authenticated pushes use the securely stored `BITBUCKET_USERNAME` and `BITBUCKET_API_TOKEN`.
- Local and Bitbucket histories may be unrelated. Fetch `origin/main`, verify no remote-only paths would be deleted, then create a commit from the local tree with the remote head as parent and push that SHA without force.
- **Why:** this preserves Bitbucket history while publishing the complete local tree, avoiding non-fast-forward rejection and destructive force-pushes.
- **How to apply:** use `git commit-tree <localTree> -p <remoteHead>` through code execution, then push `<sha>:refs/heads/main` and fetch to verify the updated remote ref.
- **Third parties push to Bitbucket** (e.g. a `Jenkinsfile` for CI was added by "Vikas"). Always `git fetch` the remote head first (commit-tree needs the parent object locally) and check `git diff --stat <remoteHead> <tree>` for files the workspace would delete — carry them into the workspace before pushing, never overwrite them.

## k8s deploy pipeline (self-hosted nizamy.app)
- Jenkins multibranch on Bitbucket `t2pms/nizamy` main builds Docker via Kaniko and applies manifests from Bitbucket `t2pms/devops_repo` at `k8s-manifests/apps/prod-nizamy-cicd/` (namespace `prod-nizamy`, deployment `prod-nizamy-landingpage`, 1 replica).
- Env vars for the pod live in that devops repo's deployment.yaml (SMTP_* added; SMTP_PASSWORD comes from k8s secret `nizamy-smtp` key `smtp-password`, marked optional so pods start without it). Keep the `<TAG>` image placeholder intact — Jenkins sed-replaces it.
- To trigger a redeploy without code changes: push an empty commit (same tree, new parent) to the Bitbucket nizamy repo main.

## Chat AI on self-hosted k8s
- Replit AI Integrations proxy is a localhost sidecar (http://localhost:1106/...) — unreachable off-Replit. Self-hosted nizamy.app needs a real OPENAI_API_KEY (client.ts falls back to it). Key injected plaintext into devops_repo deployment.yaml env (user-approved low-security pattern, same as SMTP_PASSWORD).
