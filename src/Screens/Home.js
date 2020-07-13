import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { View } from 'react-native';

export default class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            userData: {},
            nextTrips: [],
            number_trips : 0,
            number_flights : 0,
            number_cities : 0,
            totalYear : 0
        }
    }

    componentWillMount(){
        this.setState({
            userData: this.props.route.params.userData
        })
        this.getData(this.props.route.params.userData)
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
                        if ( (moment(trip.start_date).fromNow()).includes("en") && nextTrips.length < 7 ) {
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

    render(){
        return(
            <View>
                <h1>Hello World</h1>
                <h2>{this.state.userData.userLogged}</h2>
                <h3>{this.state.totalYear}</h3>
                <h3>{this.state.number_trips}</h3>
                <h3>{this.state.number_flights}</h3>
                <h3>{this.state.number_cities}</h3>
            </View>
        )
    }
}