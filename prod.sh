#!/bin/bash
#begin by resetting ps_prod working directory to last commit state
git -C ../SURF_PROD reset --hard;
#git pull to sync with remote
git -C ../SURF_PROD pull origin master;
git pull origin master
#build for prod (need prod endpoints)
yarn run build;
#mv ./fonts ./dist/static/.;
#rm ./dist/static/js/*.map;
#rm ./dist/static/*.png;
#rm ./dist/static/*.jpg;
#rm ./dist/static/*.JPG;

#get most recent commit and current branch in perstat
lastCommitHash=$(git rev-parse --short HEAD)
lastCommit=$(git log -n 1 --oneline)
branchName=$(git rev-parse --abbrev-ref HEAD)

#cd ./dist;
#git add . ;
git -C ../SURF_PROD add . ;
git -C ../SURF_PROD commit -m "Push on: `(date "+%F %T")` from ${lastCommitHash} on branch ${branchName}" -m "Built version of: ${lastCommit}";
git -C ../SURF_PROD push origin master;
