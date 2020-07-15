import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ListItem, Divider } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

export default class TripDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            tripData: {},
            userData: {},
            tripID: null
        }
    }

    componentDidMount(){
        this.setState({
            userData: this.props.route.params.userData,
            tripID: this.props.route.params.tripID
        })
        this.getData(this.props.route.params.userData, this.props.route.params.tripID)
    }

    componentWillUnmount(){
        this.setState({
            userData: {},
            tripData: {},
            tripID: null
        })
    }

    getData(data, tripID){
        axios.get(`https://travelplanner.lpsoftware.space/api/trips/${tripID}`,{
            headers: {
              'Authorization': `Bearer ${data.accessToken}`
            }})
            .then(res => {
                if (!res.data["Error"]) {
                    console.log(res.data)
                    this.setState({
                        tripData: res.data
                    })
                }else{
                    console.log("Error in Get Trip detail")
                }
            })
            .catch(error => console.log(error))
    }

    goDetails(e){
        e.preventDefault();
        alert("Hello World")
    }

    goTo(e, view){
        const { navigate } = this.props.navigation;
        navigate(view, {userData: this.state.userData})
    }

    render(){
        return(
            <ScrollView style={styles.viewHome}>
                <Text style={styles.titleMain}>{this.state.tripData.destination}</Text>
                <TouchableScale style={styles.buttonBack} friction={90} tension={100} onPress={(e) => this.goTo(e, 'My Trips')}>
                    <Ionicons name="md-arrow-round-back" size={20} color="white" />
                </TouchableScale>
                <View style={styles.cardButtonContainer}>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.goTo(e, 'My Trips')}>
                        <FontAwesome5 name="plane" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Statistics')}>
                        <FontAwesome5 name="city" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Statistics')}>
                        <FontAwesome name="hotel" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Statistics')}>
                        <FontAwesome name="credit-card" size={30} color="white" />
                    </TouchableScale>
                </View>
                <Divider style={{marginTop: hp('2%')}} />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>By LPSoftware</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    viewHome: {
        flex: 1,
        flexDirection: 'column'
    },
    containerList: {
        marginLeft: '4%',
        marginRight: '4%',
        marginTop: '2%',
        borderRadius: 20,
        borderWidth: 0,
        backgroundColor: '#2F496E'
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('2%')
    },
    subtitleStyle: {
        color: 'white',
        fontSize: hp('1.5%')
    },
    titleMain: {
        marginTop: hp('4%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('3%')
    },
    buttonBack: {
        backgroundColor: '#ED8C72',
        width: wp('10%'),
        height: hp('5%'),
        borderRadius: 10,
        position: 'absolute',
        left: wp('4%'),
        top: hp('3%'),
        marginBottom: hp('-5%'),
        padding: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonText: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    buttonAdd: {
        backgroundColor: '#2988BC',
        width: wp('10%'),
        height: hp('5%'),
        borderRadius: 10,
        position: 'absolute',
        right: wp('4%'),
        top: hp('3%'),
        marginBottom: hp('-5%'),
        padding: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    footer: {
        width: '100%',
        marginTop: hp('2%'),
        marginBottom: hp('2%')
    },
    footerText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
        fontSize: hp('1.5%')
    },
    cardButton: {
        backgroundColor: '#000B29',
        width: wp('20%'),
        height: hp('7%'),
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    cardButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: hp('2%'),
        marginLeft: wp('3%'),
        marginRight: wp('3%')
    }
});