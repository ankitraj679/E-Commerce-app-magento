/** @format */

import React, { PureComponent } from "react";
import { View } from "react-native";
import { WebView } from 'react-native-webview';

import { Color, Styles, withTheme } from "@common";
import { Back, EmptyView } from "./IconNav";

@withTheme
export default class BrowserScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);

    return {
      headerLeft: Back(navigation, null, dark),
      headerRight: EmptyView(),

      headerTintColor: Color.headerTintColor,
      headerStyle,
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

    return (
      <View style={{ flex: 1, paddingTop: 40 }}>
        <WebView
          startInLoadingState
          source={{ uri: state.params.url }} />
      </View>
    );
  }
}
