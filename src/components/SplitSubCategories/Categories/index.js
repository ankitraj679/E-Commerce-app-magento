/** @format */

import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";

import { toast, warn } from "@app/Omni";
import { Languages } from "@common";
import styles from "./styles";
import Item from "./Item";

class Categories extends Component {
  render() {
    const { categories, selectedItem, onPress } = this.props;
    var list = categories.filter((o) => o.parent == 0)

    return (
      <View style={styles.container}>
        <ScrollView>
          {list.map((item, index) => (
            <Item
              item={item}
              key={index}
              selected={selectedItem && item.id == selectedItem.id}
              onPress={() => onPress(item)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    if (this.props.categories.length == 0) {
      this.props.fetchCategories();
    }
  }
}

Categories.defaultProps = {
  categories: [],
};

const mapStateToProps = (state) => {
  return {
    categories: state.categories.list,
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
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(Categories);
