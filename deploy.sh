#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# Build command
grunt build

# clear and clone our gh-pages branch
rm -rf gh-pages || exit 0;
git clone --branch=gh-pages "git://${GH_REF}" gh-pages

# Take everything built that you want to add to gh-pages
cp -r build/ gh-pages/
cp -r docs/ gh-pages/

# Go to the branch
cd gh-pages

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "juampi92@gmail.com"

# Add changes (based on the replacement done earlier)
git add .
git commit -m "Deploy to GitHub Pages" # It'd be good to add a deploy version to the commit message

# Force push gh-pages branch (current one) with the changes made from the build
# We redirect any output to /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" > /dev/null 2>&1