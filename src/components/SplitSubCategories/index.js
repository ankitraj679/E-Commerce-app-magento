/** @format */

import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions, Text, FlatList, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { toast, warn, getProductImage } from "@app/Omni";
import { Color, Constants, Tools, Languages, Images, Config, Styles, withTheme } from "@common";
import styles from "./styles";
import Categories from './Categories'
import ProductItem from '../HorizonLayout/ThreeColumn'
import Parallax from "react-native-parallax";

class SplitCategories extends Component {
  state = {
    selectedItem: null,
    subCategories: []
  }

  render() {
    const {
      categories, products, isFetching,
      theme: {
        colors: {
          background
        },
        dark: isDark,
      }
    } = this.props;

    const subCategories = this.state.selectedItem ? categories.filter(
      (category) => category.parent === this.state.selectedItem.id
    ) : []

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Categories selectedItem={this.state.selectedItem} onPress={this.selectCategory} />
        <View style={styles.content}>

          <Parallax.ScrollView style={{ flex: 1 }}>
            {subCategories.map((category, index) => {
              const textStyle =
                index % 2 == 0
                  ? { marginRight: 30, textAlign: "right" }
                  : { marginLeft: 30, textAlign: "left" };
              // const categoryImage =
              //   category.image !== null
              //     ? { uri: category.image.src }
              //     : Images.categoryPlaceholder;
              const categoryImage = Images.categoryPlaceholder
              return (
                <Parallax.Image
                  key={index.toString()}
                  onPress={() => this.props.onPress(category)}
                  style={styles.image}
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
                      {`${category.count} products`}
                    </Text>
                  </View>
                </Parallax.Image>
              );
            })}
          </Parallax.ScrollView>
        </View>
      </View>
    );
  }

  selectCategory = (item) => {
    this.setState({ selectedItem: item })
  }

  componentDidMount() {
    if (this.props.categories && this.props.categories.length > 0) {
      this.setState({ selectedItem: this.props.categories[0] })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categories.length == 0 && nextProps.categories.length > 0) {
      this.setState({ selectedItem: nextProps.categories[0] })
    }
  }
}

SplitCategories.defaultProps = {
  categories: [],
  products: []
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories.list,
    netInfo: state.netInfo,
    products: state.products.list,
    isFetching: state.products.isFetching
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
)(withTheme(SplitCategories));
