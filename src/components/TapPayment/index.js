import React, { Component } from 'react';
import { Modal, Text, StyleSheet, View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Config } from '@common'
import qs from 'qs'
import axios from 'axios'
const redirect_url = "http://your_website.com/redirect_url"

class TapPayment extends Component {
    state = {
        isVisible: false,
        isLoading: false,
        transaction_url: ""
    };

    show = (data) => {
        this.setState({ isVisible: true })
        this.charge(data)
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    charge = (customer) => {
        this.setState({ isLoading: true })
        const chargeParams = {
            "amount": customer.amount,
            "currency": "KWD",
            "threeDSecure": true,
            "save_card": false,
            "receipt": {
                "email": false,
                "sms": true
            },
            "customer": {
                "first_name": customer.first_name,
                "last_name": customer.last_name,
                "email": customer.email
            },
            "source": {
                "id": "src_all"
            },
            "post": {
                "url": "http://your_website.com/post_url"
            },
            "redirect": {
                "url": redirect_url
            }
        }
        axios.post("https://api.tap.company/v2/charges", chargeParams, {
            headers: {
                "Authorization": "Bearer " + Config.TapPayment.SecretKey
            }
        })
            .then(({ status, data }) => {
                this.setState({ isLoading: false })
                if (status == 200 && data.id) {
                    this.setState({ transaction_url: data.transaction.url })
                } else {
                    this.hide()
                    alert("Charge error")
                }
            })
            .catch((err) => {
                this.hide()
                this.setState({ isLoading: false })
                alert("can not charge")
            })
    }

    handleNavigationStateChange = navState => {
        const { url } = navState
        if (url && url.startsWith(redirect_url)) {
            const match = url.match(/(#|\?)(.*)/)
            const results = qs.parse(match[2])
            if (results && results.tap_id) {
                this.hide()
                this.props.onPaymentSuccess(results.tap_id)
            }
        }
    };

    render() {
        const { isLoading, transaction_url } = this.state
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.state.isVisible}
                onRequestClose={this.hide}>
                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
                )}
                {!isLoading && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={this.hide}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!isLoading && (
                    <WebView
                        style={styles.flex1}
                        source={{ uri: transaction_url }}
                        scalesPageToFit
                        startInLoadingState={true}
                        onNavigationStateChange={this.handleNavigationStateChange}
                    />
                )}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 64,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS == "ios" ? 20 : 0
    },
    loading: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default TapPayment