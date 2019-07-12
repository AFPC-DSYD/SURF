#!/bin/bash
yarn run fla;
#get most recent commit and current branch in SURF
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)
#push code up to github surf_fla
git -C ../SURF_FLA add . ;
git -C ../SURF_FLA commit -m "Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ../SURF_FLA push origin master;

yarn run build;
#get most recent commit and current branch in SURF
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)

#git add, commit, and push code up to github
git -C ./dist add . ;
git -C ./dist commit -m "Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ./dist push origin master;

