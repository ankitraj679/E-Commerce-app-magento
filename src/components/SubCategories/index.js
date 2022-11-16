/** @format */

import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions, Text, FlatList, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { toast, warn, getProductImage } from "@app/Omni";
import { Color, Constants, Tools, Languages, Images, Config, Styles, withTheme } from "@common";
import styles from "./styles";
import Parallax from "react-native-parallax";
import * as MagentoUtils from '@utils/MagentoUtils'
import _ from 'lodash'
const { width, height } = Dimensions.get("window");

class SubCategories extends Component {
  state = {
    selectedItems: [],
  }

  render() {
    const {
      categories,
      theme: {
        colors: {
          background
        },
        dark: isDark,
      }
    } = this.props;


    const { selectedItems } = this.state
    var components = []
    const getItems = (categories) => {
      categories.forEach((item, index) => {
        components.push(item)
        if (selectedItems.indexOf(item.id) > -1) {
          getItems(item.children_data)
        }
      })
    }
    getItems(categories)

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.content}>
          <Parallax.ScrollView style={{ flex: 1 }}>
            {components.map(this.renderItem)}
          </Parallax.ScrollView>
        </View>
      </View>
    );
  }

  renderItem = (category, index) => {
    const {
      theme: {
        colors: {
          background
        },
        dark: isDark,
      }
    } = this.props;
    const textStyle =
      index % 2 == 0
        ? { marginRight: 30, textAlign: "right" }
        : { marginLeft: 30, textAlign: "left" };
    const categoryImage = category.image ? { uri: MagentoUtils.getCategoryImageUrl(category.image) } : (category.level % 2 == 0 ? Images.categoryPlaceholder : Images.Banner.Bag)


    return (
      <Parallax.Image
        key={index.toString()}
        onPress={() => this.onPressCategory(category)}
        style={[styles.image, { marginLeft: (category.level - 1) * (category.level > 2 ? 20 : 10) }, category.level > 2 && { height: width / 4 }]}
        overlayStyle={isDark ? styles.overlayDark : styles.overlay}
        containerStyle={styles.containerStyle}
        parallaxFactor={0.4}
        source={categoryImage}>
        <View
          style={[
            styles.dim_layout,
            index % 2 == 0 && { alignItems: "flex-end" },
            index % 2 != 0 && { alignItems: "flex-start" },
          ]}>
          <Text style={[styles.mainCategoryText, { ...textStyle }]}>
            {category.name}
          </Text>
          <Text style={[styles.numberOfProductsText, { ...textStyle }]}>
            {`${category.product_count} products`}
          </Text>
        </View>
      </Parallax.Image>
    );
  }

  onPressCategory = (category) => {
    if (category.children_data.length > 0) {
      const index = this.state.selectedItems.indexOf(category.id)
      if (index > -1) {
        this.setState({ selectedItems: _.filter(this.state.selectedItems, (item, i) => i < index) })
      } else {
        if (category.level - 1 <= this.state.selectedItems.length) {
          this.setState({ selectedItems: [category.id] })
        } else {
          this.setState({ selectedItems: [...this.state.selectedItems, category.id] })
        }
      }
    } else {
      this.props.onPress(category)
    }
  }
}

SubCategories.defaultProps = {
  categories: [],
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories.categoriesTree,
    netInfo: state.netInfo,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { netInfo } = stateProps;
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/CategoryRedux");
  return {
    ...ownProps,
    ...stateProps,
    fetchCategories: () => {
      if (!netInfo.isConnected) return toast(Languages.noConnection);
      actions.fetchCategories(dispatch);
    },
    setSelectedCategory: (category) =>
      dispatch(actions.setSelectedCategory(category)),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(withTheme(SubCategories));
