#!/bin/bash
#begin by resetting SURF working directory to last commit state
git -C ./dist reset --hard;
#git pull to sync with remote to avoid collisions
git -C ./dist pull origin master;

#build for prod (need prod endpoints)
yarn run build;

#get most recent commit and current branch in SURF
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)

#git add, commit, and push code up to github
git -C ./dist add . ;
git -C ./dist commit -m "Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ./dist push origin master;
