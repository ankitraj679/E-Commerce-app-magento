import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView
} from 'react-native'
import data from './data.json'
import { Constants, Languages, withTheme } from "@common";

class About extends React.PureComponent {
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
                    <Text style={[styles.title, { color: text }]}>{data.title}</Text>
                    <Text style={[styles.content, { color: text }]}>{data.content}</Text>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    contentWrap: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    title: {
        fontSize: 32
    },
    content: {
        fontSize: 16,
        marginTop: 30
    }
})
export default withTheme(About)