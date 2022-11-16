/** @format */

import React, { PureComponent } from "react";
import { View } from "react-native";
import { WebView } from 'react-native-webview';

import { Color, Styles, withTheme, Theme } from "@common";
import { CustomPage } from "@containers";
import { Menu, NavBarLogo } from "./IconNav";

@withTheme
export default class CustomPageScreen extends PureComponent {
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
      headerTitle: NavBarLogo({ navigation, dark }),
      headerLeft: Menu(dark),

      headerTintColor: Color.headerTintColor,
      headerStyle: Styles.Common.toolbar(background, dark),
      headerTitleStyle: Styles.Common.headerStyle,

      // use to fix the border bottom
      headerTransparent: true,
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
    const { state } = this.props.navigation;
    if (typeof state.params === "undefined") {
      return <View />;
    }

    if (typeof state.params.url !== "undefined") {
      const jsCode = "jQuery('header, footer, .small-12.medium-5.large-3.contact-page-static-block.columns, .app_link').css('display', 'none')";
      const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
      return (
        <View style={{ flex: 1, paddingTop: 40 }}>
          <WebView
            startInLoadingState
            injectedJavaScript={INJECTEDJAVASCRIPT}
            source={{ uri: state.params.url }} />
        </View>
      );
    }

    return (
      <View>
        <CustomPage id={state.params.id} />
      </View>
    );
  }
}
