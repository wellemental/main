# Wellemental

Author(s): Michael Vosters

Last updated: April 1, 2021

## Overview

A meditation & yoga app for kids – taught by diverse teachers in both English and Español

## Stack

Cross-platform using React, React Native, Typescript, and Firebase.

## Monorepo Structure

The project is monorepo using yarn workspaces and has code sharing between the React & RN packages. Read [this tutorial](https://dev.to/brunolemos/tutorial-100-code-sharing-between-ios-android--web-using-react-native-web-andmonorepo-4pej) for more information.

I implemented code sharing in the second half of the project, which you'll see in the 'common' package. I'll try to abstract as much as possible before you start, but there will still be some loose ends that haven't been ported over yet.

Just a heads up, the 'services' and 'components' packages are currently all mobile code. I'll be porting them into the 'mobile' package before you start, so don't worry about them.

I'm using the 'firebase' javascript SDK for web and 'react-native-firebase' for mobile – as it has full functionality and is better optimized. Downside is that there's a lot of duplicate code between services. You could definitely find a way to standardize and code share, but I haven't had the time to do so.

## To Note

- Check Trello for all remaining stories, although I'll likely have a lot of them knocked out by the time we transition.
- Before the transition, I'll be refactoring the Content context to use a proper reducer and allow for more efficient filtering, sorting, and overall state management. I'll also work to have things 100% standardized between web and mobile.

## Setup

1. Run 'yarn install' in the root directory
1. Run 'cd packages/mobile' and then 'yarn pods'
