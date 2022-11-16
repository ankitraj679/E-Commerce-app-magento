/** @format */

import React, { PureComponent } from "react";
import { FlatList, View, Text } from "react-native";
import { withTheme, Languages, Constants } from "@common";
import Item from "./Item";

class ShopByCategory extends PureComponent {
  static defaultProps = {
    categories: [],
    items: [],
  };

  render() {
    const { categories, items, type, onPress, config } = this.props;
    const mapping = {};
    categories.forEach((item) => {
      mapping[item.id] = item.name;
    });
    const column = typeof config.column != 'undefined' ? config.column : 1

    const {
      theme: {
        colors: { text },
      },
    } = this.props;

    return (
      <View>
        <View style={{ marginTop: 10, marginLeft: 10 }}>
          <Text style={[styles.tagHeader, { color: text }]}>{Languages.shopByCategory}</Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={styles.flatlist}
          showsHorizontalScrollIndicator={false}
          numColumns={4}
          data={items}
          renderItem={({ item }) => (
            <Item item={item} type={type} label={item.name} onPress={onPress} />
          )}
        />
      </View>
    );
  }
}

const styles = {
  flatlist: {
    marginBottom: 10
  },
  tagHeader: {
    fontSize: 18,
    letterSpacing: 2,
    fontFamily: Constants.fontHeader
  }
}

export default withTheme(ShopByCategory);
