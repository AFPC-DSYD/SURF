#!/bin/bash
yarn run fla;
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;

rm -rf ../New_Push
mkdir ../New_Push
mkdir ../New_Push/FLA
mkdir ../New_Push/PROD

cp -a ./dist ../New_Push/FLA
mv ../New_Push/FLA/dist ../New_Push/FLA/PERS_STAT

yarn run build;
mv ./fonts ./dist/static/.;
rm ./dist/static/js/*.map;
rm ./dist/static/*.png;
rm ./dist/static/*.jpg;
rm ./dist/static/*.JPG;

cp -a ./dist ../New_Push/PROD
mv ../New_Push/PROD/dist ../New_Push/PROD/PERS_STAT

