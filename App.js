/** @format */

import React from "react";
import { Image, I18nManager } from "react-native";

import { AppLoading, Asset, Font } from "@Expo";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import store from "@store/configureStore";
import RootRouter from "./src/Router";
import "./ReactotronConfig";
import { Config, Images, Languages } from '@common'
import _ from 'lodash'

import * as Sentry from 'sentry-expo';
Sentry.init({ dsn: 'https://fc1a9a09e1944b07ae082628c00c6866@sentry.io/1483589' })

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

function cacheFonts(fonts) {
  return fonts.map((font) => Font.loadAsync(font));
}

export default class App extends React.Component {
  state = { appIsReady: false };

  loadAssets = async () => {
    const fontAssets = cacheFonts([
      { OpenSans: require("@assets/fonts/OpenSans-Regular.ttf") },
      { Baloo: require("@assets/fonts/Baloo-Regular.ttf") },

      // { Entypo: require("@expo/vector-icons/fonts/Entypo.ttf") },
      // {
      //   "Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      // },
      // {
      //   MaterialCommunityIcons: require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      // },
      // {
      //   "Material Design Icons": require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      // },
      // { FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf") },
      // {
      //   "simple-line-icons": require("@expo/vector-icons/fonts/SimpleLineIcons.ttf"),
      // },
      // { Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf") },
    ]);

    const homeCategories = _.map(Config.HomeCategories, "image")
    var images = _.clone(Images)
    delete images.PlaceHolderURL
    delete images.icons
    delete images.Banner
    const imageAssets = cacheImages([
      ...homeCategories,
      ...Object.values(Config.Payments),
      ...Object.values(images),
      ...Object.values(Images.icons),
      ...Object.values(Images.Banner),
      Config.LogoImage, Config.LogoWithText, Config.LogoLoading]);
    await Promise.all([...fontAssets, ...imageAssets]);
  };

  render() {
    const persistor = persistStore(store);
    if (!this.state.appIsReady) {
      return (
        <AppLoading
          startAsync={this.loadAssets}
          onFinish={() => this.setState({ appIsReady: true })}
        />
      );
    }

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootRouter />
        </PersistGate>
      </Provider>
    );
  }
}
