import React, {Component} from 'react';
import axios from 'axios';
import { KeyboardAvoidingView, ImageBackground, StyleSheet, View } from 'react-native';
import { Button, Card, Input, Text } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Dusseldorf from '../../assets/Covers/Dusseldorf.jpg';
import { Ionicons } from '@expo/vector-icons';


export default class Login extends Component{
    constructor(props){
        super(props)
        this.state = {
            token: null,
            username: '',
            password: ''
        }
    }

    login = event => {
        event.preventDefault();
        const { navigate } = this.props.navigation;
        const postObj = {
            "username": this.state.username,
            "password": this.state.password
        }
        axios.post(`http://travelplanner.lpsoftware.space/api/auth/`, postObj,{
            headers: {
              'Authorization': `Bearer ${this.state.token}`
            }})
        .then(function (response) {
            navigate('Home', {userData: response.data})
        })
        .catch(function (error) {
            console.log("Error in login", error);
            alert("Usuario/Contraseña incorrecta", error)
        });
    }

    render(){
        return(
            <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={-hp('50%')} style={{flex: 1 , flexDirection: 'row'}}>
                <ImageBackground source={Dusseldorf} style={styles.image}>
                    < Text h1 style={{ position: "absolute" ,top: hp("10%") }}>Travel Planner</Text>
                    
                    <Card containerStyle={styles.loginCard}>
                        <Card containerStyle={styles.loginUser}>
                            <Input
                                inputStyle={{width: '50%'}}
                                leftIconContainerStyle={styles.inputIcon}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Username'
                                leftIcon={<Ionicons name='md-person' size={20}/>}
                                onChangeText={text => this.setState({username:text})}
                            />
                        </Card>
                        <Card containerStyle={styles.loginPass}>
                            <Input
                                inputStyle={{width: '50%'}}
                                leftIconContainerStyle={styles.inputIcon}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Password'
                                secureTextEntry
                                leftIcon={<Ionicons name='md-key' size={20}/>}
                                onChangeText={text => this.setState({password:text})}
                            />
                        </Card>
                        <View style={styles.buttonContainer}>
                            <Button
                                buttonStyle={styles.loginButton}
                                titleStyle={styles.buttonTitle}
                                title="Login"
                                onPress={this.login.bind(this)}
                            />
                            <Button
                                disabled
                                buttonStyle={styles.loginButton}
                                titleStyle={styles.buttonTitle}
                                title="Register"
                            />
                        </View>
                    </Card>
                </ImageBackground>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        width: wp("100%"),
        height: hp("100%")
    },
    loginCard: {
        backgroundColor: 'rgba(100,100,100, 0.5)',
        position: 'absolute',
        bottom: hp('7%'),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: wp('-0.5%'),
        width: wp('80%'),
        borderRadius: 30,
        borderWidth: 2,
        alignContent: 'center'
    },
    loginUser: {
        marginTop: hp("0%"),
        marginBottom: hp('10%'),
        width: wp('70%'),
        height: hp('7%'),
        borderRadius: 20,
        borderWidth: 2
    },
    loginPass: {
        marginTop: hp("-8%"),
        width: wp('70%'),
        height: hp('7%'),
        borderRadius: 20,
        borderWidth: 2
    },
    textLogin: {
        borderBottomWidth: 0,
        marginTop: hp('-2%')
    },
    loginButton: {
        marginTop: hp("2%"),
        borderRadius: 10,
        borderWidth: 2,
        height: hp("5%"),
        width: wp("30%"),
        backgroundColor: '#3e403e',
        borderColor: 'transparent'
    },
    buttonContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    inputIcon: {
        left: hp('-2%')
    },
    buttonTitle: {
        color: 'white'
    }
  });