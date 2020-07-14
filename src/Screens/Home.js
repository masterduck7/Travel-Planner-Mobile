import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, ListItem, Divider } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
//import getEnvVars from '../Enviroment/env';

export default class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            //imageApiURL: '',
            userData: {},
            nextTrips: [],
            number_trips : 0,
            number_flights : 0,
            number_cities : 0,
            totalYear : 0
        }
    }

    componentDidMount(){
        //getEnvVars().then(vars => this.setState({imageApiURL: vars.default.imageApiURL}));
        this.setState({
            userData: this.props.route.params.userData
        })
        this.getData(this.props.route.params.userData)
    }

    componentWillUnmount(){
        this.setState({
            userData: {},
            nextTrips: [],
            number_trips : 0,
            number_flights : 0,
            number_cities : 0,
            totalYear : 0
        })
    }

    getData(data){
        axios.get(`https://travelplanner.lpsoftware.space/api/trips_status_user?userID=${data.userID}&status=Active`,{
            headers: {
              'Authorization': `Bearer ${data.accessToken}`
            }})
            .then(res => {
                if (!res.data["Error"]) {
                    let nextTrips = []
                    let number_trips = 0
                    let number_flights = 0
                    let number_cities = 0
                    let total_city_cost = 0
                    let total_activities = 0
                    let total_hotels = 0
                    let total_flights = 0
                    res.data.forEach(trip => {
                        if ( ((moment(trip.start_date).fromNow()).includes("in") || (moment(trip.start_date).fromNow()).includes("en")) && nextTrips.length < 7 ) {
                            nextTrips.push(
                                {
                                    'destination': trip.destination,
                                    'start_date': trip.start_date,
                                    'end_date': trip.end_date,
                                    'trip_id': trip.id
                                }
                            )
                        }
                        if ( moment(trip.start_date).format('YYYY') === moment().format('YYYY')) {
                            number_trips = Number(number_trips) + 1
                            trip.flights.forEach(flight => {
                                number_flights = Number(number_flights) + 1
                                total_flights = Number(total_flights) + Number(flight.price)
                            })
                            trip.cities.forEach(city => {
                                number_cities = Number(number_cities) + 1
                                city.hotels.forEach(hotel => {
                                    total_hotels = Number(total_hotels) + Number(hotel.total_price)
                                });
                                city.activities.forEach(activity => {
                                    total_activities = Number(total_activities) + Number(activity.total_price)
                                });
                                city.citycosts.forEach(citycost => {
                                    total_city_cost = Number(total_city_cost) + Number(citycost.total_price)
                                });
                            });
                        }
                    });
                    nextTrips = nextTrips.sort(function(a, b) {
                        var dateA = new Date(a.start_date), dateB = new Date(b.start_date);
                        return dateA - dateB;
                    });
                    this.setState({
                        number_trips : number_trips,
                        number_flights : number_flights,
                        number_cities : number_cities,
                        nextTrips: nextTrips,
                        totalYear : total_city_cost + total_activities + total_hotels + total_flights
                    })
                }else{
                    console.log("Error in Get All Trip data")
                }
            })
            .catch(error => console.log(error))
    }

    logout(e){
        const { navigate } = this.props.navigation;
        navigate('Login')
    }

    goDetails(e){
        e.preventDefault();
        alert("Hello World")
    }

    render(){
        return(
            <ScrollView style={styles.viewHome}>
                <Text style={styles.hello}>Hola {this.state.userData.userLogged}</Text>
                <TouchableScale style={styles.buttonLogout} friction={90} tension={100} onPress={(e) => this.logout(e)}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableScale>
                <Text style={styles.titleStats}>Estadisticas año actual</Text>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-card' /> {this.state.totalYear}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Gastos
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-briefcase' /> {this.state.number_trips}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Viajes
                        </Text>
                    </Card>
                </View>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-airplane' /> {this.state.number_flights}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Vuelos
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-business' /> {this.state.number_cities}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Ciudades
                        </Text>
                    </Card>
                </View>
                <Text style={styles.nextTrips}>Siguientes 7 viajes</Text>
                {
                    this.state.nextTrips.map((item, i) => (
                        <ListItem
                            key={i}
                            Component={TouchableScale}
                            friction={90}
                            tension={100}
                            title={item.destination}
                            subtitle= {moment(item.start_date).format('DD/MM/YYYY').concat(" - ", moment(item.end_date).format('DD/MM/YYYY'))}
                            titleStyle={styles.titleStyle}
                            subtitleStyle={styles.subtitleStyle}
                            containerStyle={styles.containerList}
                            contentContainerStyle={{marginLeft: '5%'}}
                            onPress={(e)=> this.goDetails(e)}
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
        backgroundColor: '#298ad9',
        marginLeft: '4%',
        marginRight: '4%',
        marginTop: '2%',
        borderRadius: 30,
        borderWidth: 0
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
    buttonLogout: {
        backgroundColor: '#298ad9',
        width: wp('20%'),
        height: hp('5%'),
        borderRadius: 20,
        position: 'absolute',
        right: wp('4%'),
        top: hp('4%'),
        marginBottom: hp('-5%'),
        padding: 10
    },
    buttonText: {
        fontSize: hp('1.7%'),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    titleStats: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        textAlign: 'center',
        fontSize: hp('2.5%')
    },
    stat: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    statCard: {
        width: wp('40%'),
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2
    },
    statText: {
        fontSize: hp('2.5%'),
        textAlign: 'center'
    },
    statTextSub:{
        textAlign: 'center',
        fontSize: hp('1.5%'),
        marginTop: hp('1%')
    },
    hello: {
        marginTop: hp('5%'),
        marginBottom: hp('2%'),
        marginLeft: wp('5%'),
        fontSize: hp('2%'),
    },
    nextTrips: {
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        fontSize: hp('2.5%')
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
        fontSize: hp('2%')
    }
})