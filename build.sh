#!/bin/bash

[ ! -d "./static" ] && mkdir static

echo "Minifying main.js."
npx babel-minify main.js --out-file ./static/main.js --mangle true
echo "DONE"

echo "Minifying style.css."
npx css-minify -d ./ -o ./static
mv ./static/style.min.css ./static/style.css
echo "DONE"


echo "Copying over html; couldn't figure out how to minify it easily + not that big anyways."
cp ./index.html ./static/index.html

cp ./capybara.png ./static/capybara.png

