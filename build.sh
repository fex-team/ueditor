#!/usr/bin/env bash
set -e # halt script on error

mkdir -p _site
ls|grep -v "_site"|xargs -I {} cp -r {} _site/
rm -rf _site/pub.sh
rm -rf _site/build.sh
