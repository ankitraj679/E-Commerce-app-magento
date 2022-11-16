/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import { warn } from "@app/Omni";
import { Color, Styles, withTheme, GoogleAnalytics } from "@common";
import { Home } from "@containers";
import { Menu, NavBarLogo, HeaderHomeRight } from "./IconNav";

@withTheme
export default class HomeScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      "headerStyle",
      Styles.Common.toolbar()
    );
    const dark = navigation.getParam("dark", false);

    return {
      headerTitle: NavBarLogo({ navigation, dark }),
      headerLeft: Menu(dark),
      headerRight: HeaderHomeRight(navigation),

      headerTintColor: Color.headerTintColor,
      headerStyle,
      headerTitleStyle: Styles.Common.headerStyle,

      // use to fix the border bottom
      headerTransparent: false,
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
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
    const { navigate } = this.props.navigation;


    return (
      <View style={{ flex: 1 }}>
        <Home
          onShowAll={(config, index) =>
            navigate("ListAllScreen", { config, index })
          }
          showCategoriesScreen={() => navigate("CategoriesScreen")}
          onViewProductScreen={(item) => {
            this.props.navigation.tabBarVisible = false;
            GoogleAnalytics.strackEvent("Detail product", "Click", "Click view detail", 1);
            navigate("DetailScreen", item);
          }}
        />
      </View>
    );
  }
}
