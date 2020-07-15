import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

export default class MyTrips extends Component{
    constructor(props){
        super(props)
        this.state={
            trips: [],
            userData: {}
        }
    }

    componentDidMount(){
        this.setState({
            userData: this.props.route.params.userData
        })
        this.getData(this.props.route.params.userData)
    }

    componentWillUnmount(){
        this.setState({
            userData: {},
            trips: []
        })
    }

    getData(data){
        axios.get(`https://travelplanner.lpsoftware.space/api/trips_user?userID=${data.userID}`,{
            headers: {
              'Authorization': `Bearer ${data.accessToken}`
            }})
            .then(res => {
                if (!res.data["Error"]) {
                    var trips = res.data.sort(function(a, b) {
                        var dateA = new Date(a.start_date), dateB = new Date(b.start_date);
                        return dateA - dateB;
                    });
                    var formattedTrips = []
                    trips.forEach(trip => {
                        if (moment().isBetween(trip.start_date, trip.end_date)) {
                            formattedTrips.push(
                                {
                                    'destination': trip.destination,
                                    'start_date': trip.start_date,
                                    'end_date': trip.end_date,
                                    'id': trip.id,
                                    'type': 'actual',
                                    'color': '#2988BC'
                                }
                            )
                        }
                        else if ((moment(trip.start_date).fromNow()).includes("in") || (moment(trip.start_date).fromNow()).includes("en")) {
                            formattedTrips.push(
                                {
                                    'destination': trip.destination,
                                    'start_date': trip.start_date,
                                    'end_date': trip.end_date,
                                    'id': trip.id,
                                    'type': 'actual',
                                    'color': '#2F496E'
                                }
                            )
                        }
                    });
                    this.setState({
                        trips: formattedTrips
                    })
                }else{
                    console.log("Error in Get All Trip data")
                }
            })
            .catch(error => console.log(error))
    }

    goDetails(e){
        e.preventDefault();
        alert("Hello World")
    }

    goTo(e, view, data){
        const { navigate } = this.props.navigation;
        navigate(view, {userData: this.state.userData, tripID: data})
    }

    render(){
        return(
            <ScrollView style={styles.viewHome}>
                <Text style={styles.titleMain}>My Trips</Text>
                <TouchableScale style={styles.buttonBack} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                    <Ionicons name="md-arrow-round-back" size={20} color="white" />
                </TouchableScale>
                <TouchableScale disabled={true} style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                    <Ionicons name="ios-add" size={20} color="white" />
                </TouchableScale>
                {
                    this.state.trips.map((item, i) => (
                        <ListItem
                            key={i}
                            Component={TouchableScale}
                            friction={90}
                            tension={100}
                            title={item.destination}
                            subtitle= {moment(item.start_date).format('DD/MM/YYYY').concat(" - ", moment(item.end_date).format('DD/MM/YYYY'))}
                            titleStyle={styles.titleStyle}
                            subtitleStyle={styles.subtitleStyle}
                            containerStyle={[styles.containerList, {backgroundColor: item.color}]}
                            contentContainerStyle={{marginLeft: '5%'}}
                            onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
                        />
                    ))
                }
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
});