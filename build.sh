#!/bin/sh
PRODUCT_NAME="NuomiHotel" 
APP_NAME="hzy"
rm -rf output 
mkdir -p output/app/$APP_NAME
cp -r actions controllers library models script output/app/$APP_NAME
cd output
find ./ -name .svn -exec rm -rf {} \;
tar cvzf selfebtpl.tar.gz app
rm -rf app