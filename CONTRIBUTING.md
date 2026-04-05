# Pathways Team Workflow Guide

Our main Replit project (**Pathways (Do not edit)**) is synced with the `main` branch on GitHub. All changes go through a branch + pull request process before merging.

---

## 1. Starting New Work

1. Go to the original Repl (**Pathways (Do not edit)**) on Replit.
2. Click the three-dot menu at the top and select **Remix**. This creates your own personal copy where you can work without affecting anyone else.
3. **Authenticate GitHub in your remix:**
   - Open the **Git** tab.
   - Go to **Connections** and sign in with your GitHub account.
   - If it shows Git as **disconnected**, unlink it first, then re-link and sign in again.
   - You need this for pushing and pulling code. Without it, Git commands will fail.
4. The GitHub remote should already be set up. If it's not, open Shell (click the **+** button in the top bar and search for "Shell") and run:
   ```
   git remote add origin https://github.com/ccollins86/Pathways.git
   git fetch origin
   ```
5. Create a branch for your work:
   ```
   git checkout -b your-branch-name
   ```
   Use a descriptive name, e.g. `git checkout -b replace-house-with-mansion`

---

## 2. Making Changes

1. Work in your remixed Repl — use Replit Agent, edit files manually, whatever works.
2. Test using the preview. Since it's your own Repl, nothing you do affects the main project.

---

## 3. Committing & Pushing

The Replit Agent creates commits automatically as you work. You can also commit and push through the **Replit Git UI**.

Alternatively, use Shell:
```
git add .
git commit -m "Clear description of what you changed"
git push origin your-branch-name
```

---

## 4. Submitting for Review

1. Go to [the GitHub repo](https://github.com/ccollins86/Pathways) in your browser.
2. You'll usually see a banner saying your branch had recent pushes — click **Compare & pull request**.
3. If not, click the **Pull requests** tab, then **New pull request**.
4. Set **base** to `main` and **compare** to your branch name.
5. Write a title and description explaining what you changed and why.
6. Click **Create pull request**.

---

## 5. Reviewing

1. Go to the Pull Request on GitHub.
2. Click the **Files changed** tab to see what was added, removed, or modified.
3. Leave comments on specific lines by clicking the **+** icon next to any line.
4. Click **Review changes** and choose:
   - **Approve** — ready to merge
   - **Request changes** — needs fixes first
   - **Comment** — general feedback

---

## 6. Addressing Feedback

1. Go back to your remixed Repl and make the requested fixes.
2. Commit and push again — the Pull Request updates automatically:
   ```
   git add .
   git commit -m "Address review feedback"
   git push origin your-branch-name
   ```
3. Reviewers check again and approve when satisfied.

---

## 7. Merging

1. Once approved, click **Merge pull request** on GitHub.
2. The changes are now part of `main`.
3. To update the original Repl, open its Shell and run:
   ```
   git pull origin main
   ```

> **TODO:** We still need to establish ownership of who is responsible for updating the main Repl after merges. Discuss in the next meeting.

---

## 8. Before Starting Next Work

Update your remix before starting something new:
```
git checkout main
git pull origin main
git checkout -b next-feature-name
```
Or simply remix the original Repl again for a fresh copy.

---

## Example Workflow

> You want to replace the house with a mansion.

1. Remix **Pathways (Do not edit)**.
2. Authenticate GitHub in the Git tab (see Step 1.3).
3. `git checkout -b replace-house-with-mansion`
4. Make your changes (update the House component, swap models, adjust positioning, etc.).
5. Test in preview.
6. Commit and push:
   ```
   git add .
   git commit -m "Replace house with mansion"
   git push origin replace-house-with-mansion
   ```
7. Open a Pull Request on GitHub.
8. Team reviews, you address any feedback, they approve.
9. Merge into `main`.
10. Update the original Repl.
