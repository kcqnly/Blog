#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

cp CNAME public 
# navigate into the build output directory
cd public/
rm -rf .DS_Store
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/kcqnly/Blog.git main:pages

cd -
