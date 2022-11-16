/** @format */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import { Color, Styles, withTheme, GoogleAnalytics, Theme } from "@common";
import { SafeAreaView } from "@components";
import { Detail } from "@containers";
import { Logo, Back, CartWishListIcons } from "./IconNav";
import * as MagentoWorker from '@services/MagentoWorker'
import { warn } from "@app/Omni";
@withTheme
export default class DetailScreen extends PureComponent {
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
      tabBarVisible: false,
      headerLeft: Back(navigation, null, dark),
      headerRight: CartWishListIcons(navigation),

      headerTintColor: Color.headerTintColor,
      headerStyle: Styles.Common.toolbar(background, dark),
      headerTitleStyle: Styles.Common.headerStyle,
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
    const { state, navigate } = this.props.navigation;

    return (
      <SafeAreaView isSafeAreaBottom>
        <View style={{ flex: 1 }}>
          {typeof state.params !== "undefined" && (
            <Detail
              product={state.params.product}
              onViewCart={() => {
                GoogleAnalytics.strackEvent("Cart", "View", "View cart", 1)
                navigate("CartScreen")
              }}
              onViewProductScreen={this.showProductDetail}
              navigation={this.props.navigation}
              onLogin={() => navigate("LoginScreen")}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  componentDidMount() {
    if (this.props.navigation.state.params && this.props.navigation.state.params.product) {
      const product = this.props.navigation.state.params.product
      MagentoWorker.getProductDetail(product.sku)
        .then(({ images, stock_item }) => {
          this.props.navigation.setParams({ product: { ...product, images, stock_item } });
        })
        .catch((err) => {

        })
    }
  }

  showProductDetail = (product) => {
    this.props.navigation.setParams(product);
    MagentoWorker.getProductDetail(product.product.sku)
      .then(({ images, stock_item }) => {
        this.props.navigation.setParams({ product: { ...product.product, images, stock_item } });
      })
      .catch((err) => {

      })
  }

}
