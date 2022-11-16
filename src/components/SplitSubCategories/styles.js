import React, { StyleSheet, Dimensions } from "react-native";
import { Color, Constants, Styles } from "@common";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  content: {
    flex: 1
  },
  list: {
    paddingTop: 12
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlay: {
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  overlayDark: {
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  containerStyle: {
    shadowColor: "#000",
    backgroundColor: "transparent",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  image: {
    flex: 1,
    // width: Styles.width,
    height: Styles.width / 2 - 80,
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  dim_layout: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  mainCategoryText: {
    color: "white",
    fontSize: 20,
    fontFamily: Constants.fontHeader,
  },
  numberOfProductsText: {
    color: "white",
    fontSize: 12,
    fontFamily: Constants.fontFamily,
  },
});
