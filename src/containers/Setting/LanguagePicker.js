/**
 * Created by Luan on 11/23/2016.
 *
 * @format
 */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, I18nManager, Image } from "react-native";
import { connect } from "react-redux";
import * as Updates from 'expo-updates';
// import RNRestart from "react-native-restart";
import { RadioButtons } from "react-native-radio-buttons";
import { Color, Languages, Images, GoogleAnalytics } from "@common";
import { Button } from "@components";
import styles from "./styles";

class LanguagePicker extends PureComponent {
  static propTypes = {
    language: PropTypes.object,
    switchLanguage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.language.lang,
      isLoading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.language.lang !== nextProps.language.lang) {
      setTimeout(async() => {
        await Updates.reloadAsync();
      }, 500);
    }
  }

  _handlePress = () => {
    const { switchLanguage, language } = this.props;
    if (this.state.selectedOption !== language.lang) {
      let rtl = this.state.selectedOption === "ar";

      this.setState({ isLoading: true });
      let value = this.state.selectedOption === "ar" ? 1 : 2;

      GoogleAnalytics.strackEvent("Languages", "Switch Language", "Switch", value);

      // change RTL
      I18nManager.forceRTL(rtl);
      switchLanguage({
        lang: this.state.selectedOption,
        rtl,
      });
    }
  };

  render() {
    const renderOption = (option, selected, onSelect, index) => {
      let icon = null;
      switch (option) {
        case "en":
          icon = Images.IconUkFlag;
          name = "English";
          break;
        case "ar":
          icon = Images.IconOmanFlag;
          name = "Arabic";
          break;
        default:
          icon = Images.IconUkFlag;
          name = "English";
      }

      return (
        <TouchableOpacity
          onPress={onSelect}
          key={index}
          style={{
            padding: 10,
            backgroundColor: selected
              ? Color.DirtyBackground
              : Color.background,
            flexDirection: "row",
            alignItems: "center",
            width: undefined,
          }}>
          {/* <Icon name={selected ? Icons.Ionicons.RatioOn : Icons.Ionicons.RatioOff} size={15}/> */}
          {/* <Image source={icon} style={styles.icon} /> */}
          <Text
            style={[
              selected
                ? { fontWeight: "bold", marginLeft: 10 }
                : { marginLeft: 10 },
              { color: Color.Text },
            ]}>
            {name}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <RadioButtons
          options={["en", "ar"]}
          onSelection={(selectedOption) => this.setState({ selectedOption })}
          selectedOption={this.state.selectedOption}
          renderOption={renderOption}
          renderContainer={(optionNodes) => (
            <View style={{ margin: 10 }}>{optionNodes}</View>
          )}
        />
        <View style={styles.buttonContainer}>
          <Button
            text={Languages.SwitchLanguage}
            style={styles.button}
            textStyle={styles.buttonText}
            isLoading={this.state.isLoading}
            onPress={this._handlePress}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ language: state.language });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("@redux/LangRedux");
  return {
    ...ownProps,
    ...stateProps,
    switchLanguage: (language) => actions.switchLanguage(dispatch, language),
    switchRtl: (rtl) => actions.switchRtl(dispatch, rtl),
  };
}

module.exports = connect(
  mapStateToProps,
  undefined,
  mergeProps
)(LanguagePicker);
