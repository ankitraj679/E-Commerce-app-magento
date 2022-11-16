#!/bin/sh
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}==>1. Install Libraries${NC}"
yarn

echo "${BLUE}==>2. Install Expo XDE tool ${NC}"
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
brew update
brew cask install expo-xde
open /Applications/Expo\ XDE.app
fi

echo "${BLUE}==>3. Install Reactotron debug tool (optional) ${NC}"
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    brew update
    brew cask install reactotron
    open /Applications/Reactotron.app
fi


echo "${BLUE} Installing successful! Thank you for your purchased and using the product! ${NC}"
