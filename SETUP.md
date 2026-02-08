# Setup Instructions for GitHub Repository

Follow these steps to create the documentation repository and deploy it to GitHub Pages.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in with your account (livetradingcoderlive-trading-league@proton.me)

2. Click the **"+"** icon in the top right and select **"New repository"**

3. Configure the repository:
   - **Repository name**: `trade-cmp-docs`
   - **Description**: `Official documentation for LiveTradingLeague platform`
   - **Visibility**: Public
   - **Initialize**: Do NOT initialize with README, .gitignore, or license (we already have these)

4. Click **"Create repository"**

## Step 2: Initialize Local Repository

Open your terminal and navigate to the documentation directory:

```bash
cd /Users/klev/Code/Ltl/trade-cmp-docs
```

Initialize git and push to GitHub:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: VitePress documentation site with GitHub Pages deployment"

# Add remote origin (replace with your actual repository URL)
git remote add origin https://github.com/livetradingcoder/trade-cmp-docs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/livetradingcoder/trade-cmp-docs`

2. Click **"Settings"** tab

3. In the left sidebar, click **"Pages"**

4. Under **"Build and deployment"**:
   - **Source**: Select "GitHub Actions"
   - The workflow file (`.github/workflows/deploy.yml`) will be automatically detected

5. Click **"Save"**

## Step 4: Trigger First Deployment

The GitHub Actions workflow will automatically run when you push to the `main` branch. To trigger it manually:

1. Go to the **"Actions"** tab in your repository

2. Click on **"Deploy Documentation to GitHub Pages"** workflow

3. Click **"Run workflow"** button

4. Select `main` branch and click **"Run workflow"**

5. Wait for the workflow to complete (usually 2-3 minutes)

## Step 5: Access Your Documentation

Once the deployment is complete:

1. Go to **Settings → Pages** in your repository

2. You'll see a message: **"Your site is live at https://livetradingcoder.github.io/trade-cmp-docs/"**

3. Click the link to view your documentation site

## Step 6: Update VitePress Base URL (if needed)

If your repository name is different from `trade-cmp-docs`, update the base URL:

1. Edit `docs/.vitepress/config.ts`

2. Change the `base` property:
   ```typescript
   base: '/your-repo-name/',
   ```

3. Commit and push:
   ```bash
   git add docs/.vitepress/config.ts
   git commit -m "Update base URL for GitHub Pages"
   git push
   ```

## Step 7: Configure Custom Domain (Optional)

To use a custom domain like `docs.livetradingleague.com`:

1. Add a `CNAME` file to `docs/public/`:
   ```bash
   echo "docs.livetradingleague.com" > docs/public/CNAME
   ```

2. Commit and push:
   ```bash
   git add docs/public/CNAME
   git commit -m "Add custom domain"
   git push
   ```

3. Configure DNS:
   - Add a CNAME record pointing to `livetradingcoder.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

4. In GitHub Settings → Pages:
   - Enter your custom domain
   - Check "Enforce HTTPS"

## Local Development

To work on the documentation locally:

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev
```

Visit `http://localhost:5173` to preview your changes.

## Making Updates

To update the documentation:

1. Make changes to markdown files in `docs/`

2. Test locally:
   ```bash
   npm run docs:dev
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push
   ```

4. GitHub Actions will automatically rebuild and deploy

## Updating the Changelog

When releasing new versions:

1. Edit `docs/changelog.md`

2. Add new version section:
   ```markdown
   ## [1.1.0] - 2026-02-15

   ### Added
   - New feature description

   ### Changed
   - Changed feature description

   ### Fixed
   - Bug fix description
   ```

3. Update version in `docs/.vitepress/config.ts`:
   ```typescript
   {
     text: 'v1.1.0',
     items: [
       { text: 'Changelog', link: '/changelog' },
       { text: 'Contributing', link: '/contributing' }
     ]
   }
   ```

4. Commit and push changes

## Troubleshooting

### Deployment Failed

Check the Actions tab for error messages:
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Review the error logs
4. Common issues:
   - Node version mismatch (ensure Node 20 in workflow)
   - Build errors (test locally with `npm run docs:build`)
   - Missing dependencies (ensure `package-lock.json` is committed)

### 404 Page Not Found

If you get 404 errors:
1. Check that `base` in `config.ts` matches your repository name
2. Ensure GitHub Pages is enabled in Settings
3. Wait a few minutes for DNS propagation

### Styles Not Loading

If styles are broken:
1. Check browser console for errors
2. Verify `base` URL is correct
3. Clear browser cache
4. Check that all assets are in `docs/public/`

## Repository Structure

```
trade-cmp-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── docs/
│   ├── .vitepress/
│   │   └── config.ts           # VitePress configuration
│   ├── public/
│   │   └── logo.svg            # Logo and static assets
│   ├── getting-started/        # Getting started guides
│   ├── guide/                  # User guides
│   ├── api/                    # API reference
│   ├── deployment/             # Deployment guides
│   ├── index.md                # Homepage
│   └── changelog.md            # Version history
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Next Steps

1. Customize the logo in `docs/public/logo.svg`
2. Update social links in `docs/.vitepress/config.ts`
3. Add more documentation pages as needed
4. Set up branch protection rules for `main` branch
5. Configure GitHub repository settings (description, topics, etc.)

## Support

If you encounter issues:
- Check [VitePress documentation](https://vitepress.dev/)
- Review [GitHub Pages documentation](https://docs.github.com/en/pages)
- Open an issue in the repository
