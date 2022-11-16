import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import { Constants, Languages, withTheme } from "@common";
import * as MagentoWorker from '../../services/MagentoWorker'

class ContactUs extends React.PureComponent {
    state = {
        name: "",
        email: "",
        phone: "",
        comment: "",
        loading: false
    }
    render() {
        const {
            theme: {
                colors: {
                    background, text
                }
            }
        } = this.props
        const { name, email, phone, comment, loading } = this.state

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                <ScrollView contentContainerStyle={styles.contentWrap}>
                    <Text style={[styles.title, { color: text }]}>{Languages.contactus}</Text>
                    <Text style={[styles.subtitle, { color: text }]}>{Languages.ContactInformation}</Text>
                    <Text style={styles.label}>{Languages.Name}</Text>
                    <TextInput value={name} onChangeText={(name) => this.setState({ name })} style={[styles.input, { color: text }]} />
                    <Text style={styles.label}>{Languages.email}</Text>
                    <TextInput value={email} onChangeText={(email) => this.setState({ email })} style={[styles.input, { color: text }]} />
                    <Text style={styles.label}>{Languages.Phone}</Text>
                    <TextInput value={phone} onChangeText={(phone) => this.setState({ phone })} style={[styles.input, { color: text }]} />
                    <Text style={styles.label}>{Languages.Comment}</Text>
                    <TextInput value={comment} onChangeText={(comment) => this.setState({ comment })} style={[styles.comment, { color: text }]} multiline={true} textAlignVertical="top" />
                    <TouchableOpacity style={styles.btnSubmit} onPress={this.submit} disabled={loading}>
                        {!loading && <Text style={styles.submitTxt}>{Languages.Submit}</Text>}
                        {loading && <ActivityIndicator color="#fff" />}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }

    submit = () => {
        const { name, email, phone, comment } = this.state
        this.setState({ loading: true })
        MagentoWorker.sendContactUs(name, email, phone, comment)
            .then((res) => {
                this.setState({ loading: false })
            })
            .catch((err) => {
                this.setState({ loading: false })
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
        paddingVertical: 20
    },
    title: {
        fontSize: 32
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 50,
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        marginTop: 15,
        marginBottom: 5,
        color: 'rgba(111,111,111,1.0)'
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 0,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#f4f4f4"
    },
    comment: {
        height: 150,
        paddingHorizontal: 10,
        paddingVertical: 0,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#f4f4f4"
    },
    btnSubmit: {
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#59cafa",
        width: 150,
        alignSelf: 'center',
        marginVertical: 20
    },
    submitTxt: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 'bold'
    }
})
export default withTheme(ContactUs)