import React, {Component} from 'react';
import { AsyncStorage, View } from 'react-native';

export default class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            userData: {}
        }
    }

    componentDidMount = async () => {
        this._retrieveData()
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('userData');
          if (value !== null) {
            this.setState({
                userData: JSON.parse(value)
            })
          }
        } catch (error) {
          console.log("Error retrieving data")
        }
    };

    render(){
        return(
            <View>
                <h1>Hello World</h1>
                <h2>{this.state.userData.userLogged}</h2>
            </View>
        )
    }
}