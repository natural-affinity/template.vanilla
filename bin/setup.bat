@echo off

echo "installing node dependencies"
cmd.exe /c npm install -g bower gulp-cli
cmd.exe /c npm install gulp
cmd.exe /c npm install
cmd.exe /c bower install
