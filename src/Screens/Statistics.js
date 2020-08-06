import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

export default class Statistics extends Component{
    constructor(props){
        super(props)
        this.state={
            totalFlights: 0,
            totalFlightsCost: 0,
            totalHotelNights: 0,
            totalHotelNightsCost: 0,
            totalActivities: 0,
            totalActivitiesCost: 0,
            totalCities: 0,
            totalCityCosts: 0,
            avgFlights: 0,
            avgHotels: 0,
            avgActivities: 0,
            avgCityCosts: 0,
            totalTrips: 0
        }
    }

    componentDidMount(){
        this.setState({
            userData: this.props.route.params.userData
        })
        this.getData(this.props.route.params.userData)
    }

    getData(data){
        axios.get(`https://travelplanner.lpsoftware.space/api/trips_user?userID=${data.userID}`,{
            headers: {
              'Authorization': `Bearer ${data.accessToken}`
            }})
            .then(res => {
                if (!res.data["Error"]) {
                    let TotalFlights = 0
                    let TotalFlightsCost = 0
                    let TotalHotelNights = 0
                    let TotalHotelNightsCost = 0
                    let TotalActivities = 0
                    let TotalActivitiesCost = 0
                    let TotalCities = 0
                    let TotalCityCosts = 0
                    res.data.forEach(trip => {
                        trip.flights.forEach(flight => {
                            TotalFlightsCost = Number(TotalFlightsCost) + Number(flight.price)
                            TotalFlights = Number(TotalFlights) + Number(1)
                        });
                        trip.cities.forEach(city => {
                            city.hotels.forEach(hotel => {
                                let diff = moment(hotel.end_date).diff(moment(hotel.start_date), 'days')
                                TotalHotelNights = Number(TotalHotelNights) + Number(diff)
                                TotalHotelNightsCost = Number(TotalHotelNightsCost) + Number(hotel.total_price)
                            });
                            city.activities.forEach(activity => {
                                TotalActivitiesCost = Number(TotalActivitiesCost) + Number(activity.total_price)
                                TotalActivities = Number(TotalActivities) + Number(1)
                            });
                            TotalCities = Number(TotalCities) + Number(1)
                            city.citycosts.forEach(citycost => {
                                TotalCityCosts = Number(TotalCityCosts) + Number(citycost.total_price)
                            });
                        });
                    });

                    this.setState({
                        totalFlights: TotalFlights,
                        totalFlightsCost: TotalFlightsCost,
                        totalHotelNights: TotalHotelNights,
                        totalHotelNightsCost: TotalHotelNightsCost,
                        totalActivities: TotalActivities,
                        totalActivitiesCost: TotalActivitiesCost,
                        totalCities: TotalCities,
                        totalCityCosts: TotalCityCosts,
                        avgFlights: Number(TotalFlightsCost/TotalFlights).toFixed(0),
                        avgHotels: Number(TotalHotelNightsCost/TotalHotelNights).toFixed(0),
                        avgActivities: Number(TotalActivitiesCost/TotalActivities).toFixed(0),
                        avgCityCosts: Number(TotalCityCosts/TotalCities).toFixed(0),
                        totalTrips: Number(TotalFlightsCost) + Number(TotalHotelNightsCost) + Number(TotalActivitiesCost) + Number(TotalCityCosts)
                    })
                }else{
                    console.log("Error in Get All Trip data")
                }
            })
            .catch(error => console.log(error))
    }

    goTo(e, view){
        const { navigate } = this.props.navigation;
        navigate(view, {userData: this.state.userData})
    }

    render(){
        return(
            <ScrollView style={styles.viewHome}>
                <Text style={styles.titleMain}>Statistics</Text>
                <TouchableScale style={styles.buttonBack} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                    <Ionicons style={styles.buttonBackIcon} name="md-arrow-round-back" size={20} color="white" />
                </TouchableScale>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-stats' />  ${this.state.totalTrips}
                        </Text>
                        <Text style={styles.statTextSub}>
                            All trips costs
                        </Text>
                    </Card>
                </View>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-briefcase' /> {this.state.totalFlights}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Flights
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-card' /> {this.state.avgFlights}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Flights Average
                        </Text>
                    </Card>
                </View>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-bed' /> {this.state.TotalHotelNights}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Hotel Nights
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-card' /> {this.state.avgHotels}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Hotel Night Average
                        </Text>
                    </Card>
                </View>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-basketball' /> {this.state.totalActivities}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Activities
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-card' /> {this.state.avgActivities}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Activities Average
                        </Text>
                    </Card>
                </View>
                <View style={styles.stat}>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-pin' /> {this.state.totalCities}
                        </Text>
                        <Text style={styles.statTextSub}>
                            Cities
                        </Text>
                    </Card>
                    <Card containerStyle={styles.statCard}>
                        <Text style={styles.statText}>
                            <Ionicons size={30} name='md-card' /> {this.state.avgCityCosts}
                        </Text>
                        <Text style={styles.statTextSub}>
                            City cost Average
                        </Text>
                    </Card>
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
        marginTop: hp('5%'),
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
        top: hp('5%'),
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
        top: hp('5%'),
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
});