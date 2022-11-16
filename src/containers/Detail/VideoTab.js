
import React, { PureComponent } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
const width = Dimensions.get("window").width
class VideoTab extends PureComponent {

  getId = (url) => {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

  render() {
    const {
      product
    } = this.props;

    const html = `<iframe width="${width - 40}" height="${width - 60}" src="https://www.youtube.com/embed/${this.getId(product.videoLink)}" frameborder="0" allowfullscreen></iframe>`
    console.log(html);

    return (
      <View style={styles.container}>
        <WebView javaScriptEnabled={true} source={{ uri: `https://www.youtube.com/embed/${this.getId(product.videoLink)}` }} style={styles.webview} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  webview: {
    flex: 1,
    backgroundColor: "red"
  }
})
export default VideoTab
