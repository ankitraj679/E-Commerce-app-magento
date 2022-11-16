/** @format */

import React, { Component } from "react";
import { View } from "react-native";

import { Languages, Color, Styles, withTheme, Theme } from "@common";
import { Setting } from "@containers";
import { Menu, Logo } from "./IconNav";

@withTheme
export default class SettingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const {
      colors: { background },
    } = global.isDarkTheme ? Theme.dark : Theme.light

    const dark = navigation.getParam("dark", global.isDarkTheme);

    return {
      headerTitle: Logo(dark),
      headerLeft: Menu(dark),

      headerTintColor: Color.headerTintColor,
      headerStyle: Styles.Common.toolbar(background, dark),
      headerTitleStyle: Styles.Common.headerStyle,
    };
  };

  componentWillMount() {
    const {
      theme: {
        colors: { background },
        dark,
      },
    } = this.props;

    this.props.navigation.setParams({
      headerStyle: Styles.Common.toolbar(background, dark),
      dark,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme.dark !== nextProps.theme.dark) {
      const {
        theme: {
          colors: { background },
          dark,
        },
      } = nextProps;
      this.props.navigation.setParams({
        headerStyle: Styles.Common.toolbar(background, dark),
        dark,
      });
    }
  }

  render() {
    return <Setting />;
  }
}
