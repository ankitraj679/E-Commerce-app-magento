import React from 'react';
import { Text } from 'react-native';
import { Font } from '@Expo';
import createIconSet from './vendor/react-native-vector-icons/lib/create-icon-set';
import createIconButtonComponent from './vendor/react-native-vector-icons/lib/icon-button';

export default function (glyphMap, fontName, expoAssetId) {
  const font = { [fontName]: expoAssetId };
  const RNVIconComponent = createIconSet(glyphMap, fontName);

  class Icon extends React.Component {
    static propTypes = RNVIconComponent.propTypes;
    static defaultProps = RNVIconComponent.defaultProps;

    state = {
      fontIsLoaded: Font.isLoaded(fontName),
    };

    async componentWillMount() {
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
    }

    setNativeProps(props) {
      if (this._icon) {
        this._icon.setNativeProps(props);
      }
    }

    render() {
      if (!this.state.fontIsLoaded) {
        return <Text />;
      }

      return (
        <RNVIconComponent
          ref={view => {
            this._icon = view;
          }}
          {...this.props}
        />
      );
    }
  }

  Icon.Button = createIconButtonComponent(Icon);
  Icon.glyphMap = glyphMap;
  Icon.font = font;

  return Icon;
}
