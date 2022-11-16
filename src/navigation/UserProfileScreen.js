/** @format */

import React, { PureComponent } from "react";

import { Color, Styles, withTheme, Theme } from "@common";
import { UserProfile } from "@containers";
import { Logo, Menu } from "./IconNav";

@withTheme
export default class UserProfileScreen extends PureComponent {
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
    const { navigation } = this.props;

    return <UserProfile navigation={navigation} />;
  }
}
