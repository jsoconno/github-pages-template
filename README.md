## GitHub Pages Documentation Framework

GitHub Pages Documentation Framework is a user-friendly solution for creating project documentation using Markdown and GitHub Pages efficiently.

## Key Features
* Web app for displaying Markdown-based documentation
* Mobile-friendly, responsive design
* Supports any depth of document hierarchy
* Automated routing configuration based on markdown folder and file structure
* Allows title, description, icon, tags, and owner for each folder and document
* Live search/filtering with keywords and tags (no server infrastructure required)
* Optimized for deployment on GitHub Pages
* Left-sided tree navigator
* Breadcrumb support for easy navigation through any level of document hierarchy
* Tag support for grouping documents together

## Getting Started
* Clone the repository and follow the "Build Setup" instructions below

* Write your documents in Markdown and place them in the `/static/markdown` folder
* Create a GIT repository and import your documentations trunk
* Deploy to GitHub Pages using `export TARGET_BRANCH=gh-pages && npm run gh-pages`
* In your GitHub repository > Settings > scroll down to "GitHub Pages", ensure it points to your "gh-pages" branch
* Find the link to your GitHub Pages deployment on that screen as well

## Found A Bug?
For feedback, enhancement requests, or defect reports, use "Issues" on this repo

## Build Setup

```bash
# install dependencies
npm install

# generate the path configuration (for testing)
npm run generate-config

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification, also build the search index
npm run build

# build the search index only
npm run build-search

# build for production and view the bundle analyzer report
npm run build --report

# deploy playbook to GH pages (includes build and deploy to GH pages)
export TARGET_BRANCH=gh-pages
npm run gh-pages
