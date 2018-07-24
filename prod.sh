#!/bin/bash
yarn run build;
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;
cd ./dist;
git add . ;
git commit -m "`(date +%F%T)`";
git push origin master;
