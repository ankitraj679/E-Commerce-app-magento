import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native'
import data from './data.js'
import dataAr from './data-ar.js'
import { Images, Languages, withTheme } from "@common";
import ExpanableList from 'react-native-expandable-section-flatlist';
import _ from 'lodash'
import HTML from 'react-native-render-html';
import { connect } from "react-redux";

class FAQ extends React.PureComponent {
    constructor(props) {
        super(props)
        console.log("language: ", props.language);

        this.state = {
            data: props.language == "ar" ? dataAr : data,
        }
    }


    render() {
        const {
            theme: {
                colors: {
                    background, text
                }
            }
        } = this.props
        const list = _.map(this.state.data, (o) => ({ header: o.title, member: [o.content] }))

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                <ScrollView contentContainerStyle={styles.contentWrap}>
                    <Text style={[styles.title, { color: text }]}>{Languages.FAQTopics}</Text>
                    <View style={styles.searchWrap}>
                        <TextInput style={[styles.input, { color: text }]} clearButtonMode="while-editing" onChangeText={this.onChangeText} />
                        <TouchableOpacity style={styles.btnSearch} onPress={this.search}>
                            <Text style={styles.searchTxt}>{Languages.Search}</Text>
                        </TouchableOpacity>
                    </View>
                    {list.length > 0 && (
                        <View style={styles.content}>
                            <ExpanableList
                                dataSource={list}
                                headerKey="header"
                                memberKey="member"
                                renderRow={this._renderRow}
                                renderSectionHeaderX={this._renderSection}
                            />
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        )
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        const {
            theme: {
                colors: {
                    background, text
                }
            }
        } = this.props
        return (
            <HTML html={rowItem} imagesMaxWidth={Dimensions.get('window').width - 30} onLinkPress={this.onLinkPress} tagsStyles={{ a: { color: "#59cafa", textDecorationLine: 'none' } }} baseFontStyle={{ color: text }} />
        )
    }
    _renderSection = (section, sectionId, isOpened) => {
        const {
            theme: {
                colors: {
                    background, text
                }
            }
        } = this.props

        return (
            <View style={styles.section}>
                <Image source={isOpened ? Images.IconArrowDown : Images.IconArrowRight} style={[styles.icon, { tintColor: text }, isOpened && styles.openedIcon]} />
                <Text style={[styles.sectionTxt]}>{section}</Text>
            </View>
        )
    }

    onChangeText = (text) => {
        this.searchText = text
        if (text.trim().length == 0) {
            this.setState({ data: this.props.language == "ar" ? dataAr : data })
        }
    }

    search = () => {
        if (this.searchText && this.searchText.trim().length > 0) {
            this.setState({ data: _.filter(this.props.language == "ar" ? dataAr : data, (o) => o.title.indexOf(this.searchText) > -1 || o.content.indexOf(this.searchText) > -1) })
        }
    }

    onLinkPress = (e, href) => {
        this.props.navigation.navigate("BrowserScreen", { url: href })

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
        fontSize: 32,
        textAlign: 'center',
        color: '#000'
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 0,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#f4f4f4"
    },
    btnSearch: {
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        backgroundColor: "#59cafa",
        paddingHorizontal: 10
    },
    searchTxt: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 'bold'
    },
    content: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#f4f4f4"
    },
    section: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    sectionTxt: {
        fontSize: 16,
        color: "#59cafa"
    },
    icon: {
        width: 5,
        height: 10,
        resizeMode: 'contain',
        marginRight: 5
    },
    openedIcon: {
        width: 10,
        height: 5,
    },
    link: {
        color: "#59cafa"
    },
    dot: {
        width: 5,
        height: 5
    },
    bold: {
        fontWeight: 'bold'
    },
    text: {
        fontSize: 14,
        letterSpacing: 0.5
    }
})

const mapStateToProps = (state) => ({ language: state.language.lang });

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...stateProps,
    };
}

module.exports = connect(
    mapStateToProps,
    undefined,
    mergeProps
)(withTheme(FAQ));
