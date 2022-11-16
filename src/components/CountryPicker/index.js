import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal,
    Text,
    TextInput,
    SafeAreaView
} from 'react-native'
import countries from './countries.json'
import { withTheme, Languages } from '@common'
import _ from 'lodash'

class CountryPicker extends React.PureComponent {
    state = {
        isVisible: false,
        countries: Object.keys(countries)
    }

    show = () => {
        this.setState({ isVisible: true })
    }

    hide = () => {
        this.setState({ isVisible: false })
    }

    render() {
        const {
            theme: {
                colors: { background, text, placeholder },
            },
        } = this.props;

        return (
            <View>
                <TouchableOpacity onPress={this.show}>
                    {this.props.children}
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={this.hide}>
                    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                        <TouchableOpacity onPress={this.hide} style={styles.btnClose} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                            <Text style={[styles.close, { color: text }]}>{Languages.close}</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, { color: text }]}
                            placeholder={Languages.Search}
                            placeholderTextColor={placeholder}
                            onChangeText={this.onSearch} />
                        <View style={styles.line} />
                        <FlatList
                            data={this.state.countries}
                            renderItem={this.renderItem}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </SafeAreaView>
                </Modal>
            </View>
        )
    }

    renderItem = ({ item }) => {
        const {
            theme: {
                colors: { background, text, placeholder },
            },
        } = this.props;

        return (
            <TouchableOpacity onPress={() => this.select(item)}>
                <Text style={[styles.text, { color: text }]}>{countries[item]}</Text>
            </TouchableOpacity>
        )
    }

    select = (item) => {
        this.props.onChange({ cca2: item, name: countries[item] })
        this.hide()
    }

    onSearch = (text) => {
        const items = _.filter(Object.keys(countries), (o) => countries[o].toLowerCase().indexOf(text.toLowerCase()) > -1)
        this.setState({ countries: items })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    text: {
        fontSize: 15,
        marginHorizontal: 15,
        marginVertical: 12
    },
    input: {
        height: 44,
        fontSize: 16,
        padding: 0,
        marginHorizontal: 15
    },
    line: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    btnClose: {
        marginLeft: 15,
        marginVertical: 10
    },
    close: {
        fontSize: 14,
        color: "#000"
    }
})

export default withTheme(CountryPicker)