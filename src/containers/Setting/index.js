/** @format */

import React from "react";
import {withTheme} from "@common";
import { View } from "react-native";
import LanguagePicker from "./LanguagePicker";
import styles from "./styles";

class Setting extends React.PureComponent {
  render() {
    return (
      <View style={styles.settingContainer}>
        <LanguagePicker />
      </View>
    );
  }
}
export default withTheme(Setting);
