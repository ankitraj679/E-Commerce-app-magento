import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native'
import data from './data.json'
import { Constants, Languages, withTheme } from "@common";

class Location extends React.PureComponent {
    render() {
        const {
            theme: {
                colors: {
                    background, text
                }
            }
        } = this.props
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                <ScrollView contentContainerStyle={styles.contentWrap}>
                    {data.map((item, index) => (
                        <View key={index}>
                            <Text style={[styles.title, { color: text }]}>{item.country}</Text>
                            {item.stores.map((store) => (
                                <View style={styles.row}>
                                    <View style={[styles.dot, { backgroundColor: text }]} />
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity onPress={() => this.openLink(store.link)}>
                                            <Text style={[styles.name]}>{store.name}</Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.text, { color: text }]}>{store.address}</Text>
                                        <Text style={[styles.text, { color: text }]}>{store.opentime}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        )
    }

    openLink = (url) => {
        Linking.openURL(url)
            .then((res) => {

            })
            .catch((err) => {
                alert(err)
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    contentWrap: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        marginTop: 20,
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        marginBottom: 15
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 10,
        marginTop: 10
    },
    name: {
        fontSize: 16,
        color: "#59cafa",
        fontWeight: 'bold'
    },
    text: {
        fontSize: 15,
        color: 'rgba(111,111,111,1.0)',
        marginTop: 8
    }
})
export default withTheme(Location)