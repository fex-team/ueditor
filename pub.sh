#!/usr/bin/env bash
set -e # halt script on error
git config --global http.postBuffer 524288000
git config --global user.name "fexteam"
git config --global user.email "fex@baidu.com"
git config --global push.default simple
rm -rf ./repo
git clone "https://${GIT_USER}:${GIT_TOKEN}@${GH_REF}" repo -q
mkdir -p ./repo/ueditor
cp -r ./_site/* ./repo/ueditor
cd ./repo
git add --all .
git commit -m "Update docs"
git push -q
