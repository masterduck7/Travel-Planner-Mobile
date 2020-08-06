import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { KeyboardAvoidingView, Modal, StyleSheet, Text, View } from 'react-native';
import { Card, Input, Divider, ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Menu, { MenuItem } from 'react-native-material-menu';
import Flag from 'react-native-flags';


export default class TripDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            cityList: {},
            tripData: {},
            flights: [],
            cities: [],
            hotels: [],
            costs: [],
            activities: [],
            userData: {},
            selectedTab: 'cities',
            tripID: null,
            modalAddCost: false,
            selectedCity: 'Select City',
            selectedCityKey: '',
            nameCost: '',
            priceCost: '',
            modalFlightDetail: false,
            flightSelected: {},
            modalHotelDetail: false,
            hotelSelected: {},
            breakfastHotelSelected: ""
        }
    }

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.setState({
                userData: this.props.route.params.userData,
                tripID: this.props.route.params.tripID
            })
            this.getData(this.props.route.params.userData, this.props.route.params.tripID)
        });
    }

    getData(data, tripID){
        axios.get(`https://travelplanner.lpsoftware.space/api/trips/${tripID}`,{
            headers: {
              'Authorization': `Bearer ${data.accessToken}`
            }})
            .then(res => {
                if (!res.data["Error"]) {
                    var hotels = []
                    var costs = []
                    var activities = []
                    var cities = {}
                    var flights = res.data.flights
                    res.data.cities.forEach(city => {
                        cities[city.name] = city.id
                        city.hotels.forEach(hotel => {
                            hotels.push(hotel)
                        });
                        city.activities.forEach(activity => {
                            activities.push(activity)
                        });
                        city.citycosts.forEach(cost => {
                            costs.push(cost)
                        });
                    });
                    flights = flights.sort(function(a, b) {
                        var dateA = new Date(a.start_date), dateB = new Date(b.start_date);
                        return dateA - dateB;
                    });
                    hotels = hotels.sort(function(a, b) {
                        var dateA = new Date(a.start_date), dateB = new Date(b.start_date);
                        return dateA - dateB;
                    });
                    activities = activities.sort(function(a, b) {
                        var dateA = new Date(a.activity_date), dateB = new Date(b.activity_date);
                        return dateA - dateB;
                    });
                    this.setState({
                        cityList: cities,
                        tripData: res.data,
                        cities: res.data.cities,
                        flights: flights,
                        hotels: hotels,
                        costs: costs,
                        activities: activities
                    })
                }else{
                    console.log("Error in Get Trip detail")
                }
            })
            .catch(error => console.log(error))
    }

    goTo(e, view, data, type){
        const { navigate } = this.props.navigation;
        if (type != null){
            navigate(view, {userData: this.state.userData, type: data})
        }else{
            navigate(view, {userData: this.state.userData, userData: data})
        }
    }

    selectTab(value){
        this.setState({selectedTab: value})
    }

    selectFlight(item){
        this.setState({flightSelected: item, modalFlightDetail: true})
    }

    selectHotel(item){
        if (item.breakfast) {
            this.setState({hotelSelected: item, modalHotelDetail: true, breakfastHotelSelected: "YES"})   
        } else {
            this.setState({hotelSelected: item, modalHotelDetail: true, breakfastHotelSelected: "NO"})
        }
    }

    renderElement(){
        if (this.state.selectedTab === 'cities') {
            return(
                <View>
                    <Text style={styles.titleSub}>Cities</Text>
                    {
                        this.state.cities.map((item, i) => (
                            <ListItem
                                key={i}
                                leftAvatar={<Flag code={item.country} size={32} />}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.name}
                                titleStyle={styles.titleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                            />
                        ))
                    }
                </View>
            )
        }
        else if (this.state.selectedTab === 'flights'){
            return(
                <View>
                    <Text style={styles.titleSub}>Flights</Text>
                    {
                        this.state.flights.map((item, i) => (
                            <ListItem
                                key={i}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.origin + " - " + item.destination}
                                titleStyle={styles.titleStyle}
                                subtitle= {moment(item.start_date).format('DD/MM/YYYY').concat(" - ", moment(item.end_date).format('DD/MM/YYYY'))}
                                subtitleStyle={styles.subtitleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                                onPress={(e)=> this.selectFlight(item)}
                            />
                        ))
                    }
                </View>
            )
        }
        else if (this.state.selectedTab === 'hotels'){
            return(
                <View>
                    <Text style={styles.titleSub}>Hotels</Text>
                    {
                        this.state.hotels.map((item, i) => (
                            <ListItem
                                key={i}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.name}
                                titleStyle={styles.titleStyle}
                                subtitle= {moment(item.start_date).format('DD/MM/YYYY').concat(" - ", moment(item.end_date).format('DD/MM/YYYY'))}
                                subtitleStyle={styles.subtitleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                                onPress={(e)=> this.selectHotel(item)}
                            />
                        ))
                    }
                </View>
            )
        }
        else if (this.state.selectedTab === 'activities'){
            return(
                <View>
                    <Text style={styles.titleSub}>Activities</Text>
                    {
                        this.state.activities.map((item, i) => (
                            <ListItem
                                key={i}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.name}
                                titleStyle={styles.titleStyle}
                                subtitle= {moment(item.activity_date).format('DD/MM/YYYY')  + " (" + item.badge_total_price + " " + item.total_price + " )"}
                                subtitleStyle={styles.subtitleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                            />
                        ))
                    }
                </View>
            )
        }
        else if (this.state.selectedTab === 'costs'){
            return(
                <View>
                    <Text style={styles.titleSub}>Costs</Text>
                    <TouchableScale style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.setState({modalAddCost: true})}>
                        <Ionicons name="ios-add" size={20} color="white" />
                    </TouchableScale>
                    {
                        this.state.costs.map((item, i) => (
                            <ListItem
                                key={i}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.name + " (" + item.badge_total_price + " " + item.total_price + ")"}
                                titleStyle={styles.titleCostStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                            />
                        ))
                    }
                </View>
            )
        }
        else{
            return(
                <View>
                    <Text style={styles.titleSub}>No data found</Text>
                </View>
            )
        }
    }

    postCost(){
        var postObj = {
            cityID: this.state.selectedCityKey,
            name: this.state.nameCost,
            total_price: this.state.priceCost,
            badge_total_price: 'USD'
        }
        axios.post(`https://travelplanner.lpsoftware.space/api/costs/`, postObj, {
            headers: {
              'Authorization': `Bearer ${this.state.userData.accessToken}`
            }})
            .then(e => {
                this.setState({modalAddCost: false, selectedCity: 'Select City', nameCost: '', priceCost: '', selectedCityKey: ''})
                this.goTo(e, 'Trip Details', this.state.tripID, 'tripID')
            })
            .catch(function (error) {
                console.log("Error in add cost");
            });
    }

    setMenuRef = ref => {
        this._menu = ref;
    };
     
    hideMenu = (key,value) => {
        this._menu.hide();
        this.setState({selectedCity: key, selectedCityKey: value})
    };
     
    showMenu = () => {
        this._menu.show();
    };

    paid = () => {
        if (this.state.hotelSelected.amount_paid !== this.state.hotelSelected.total_price) {
            return(
                <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> PAID</Text>: USD {this.state.hotelSelected.amount_paid}/{this.state.hotelSelected.total_price}</Text>
            )
        }
    }

    notPaid = () => {
        if (this.state.hotelSelected.amount_not_paid !== 0) {
            return(
                <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> NOT PAID</Text>: USD {this.state.hotelSelected.amount_not_paid}</Text>
            )
        }
    }

    render(){
        let myCities = Object.entries(this.state.cityList).map(([key, value]) => {
            return  <MenuItem key={value} onPress={(e) => this.hideMenu(key,value)}>
                        {key}
                    </MenuItem>
        });
        return(
            <ScrollView style={styles.viewHome}>
                {/* Costs modal */}
                <Modal
                    visible={this.state.modalAddCost}
                    transparent={true}
                    animationType = {"slide"}
                    onRequestClose={() => this.setState({modalAddCost: false})}
                >
                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={hp('8%')}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Add Cost</Text>
                        <Menu
                            ref={this.setMenuRef}
                            button={
                                <TouchableScale friction={90} tension={100} onPress={(e) =>  this.showMenu()} style={styles.dropdown}>
                                    <Text style={styles.dropdownText}>{this.state.selectedCity}</Text>
                                </TouchableScale>
                            }
                        >
                            {myCities}
                        </Menu>
                        <Card containerStyle={styles.inputModal}>
                            <Input
                                inputStyle={{width: '50%'}}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Name'
                                value={this.state.nameCost}
                                onChangeText={value => this.setState({nameCost: value})}
                            />
                        </Card>
                        <Card containerStyle={styles.inputModal}>
                            <Input
                                inputStyle={{width: '50%'}}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Total price (USD)'
                                value={this.state.priceCost}
                                onChangeText={value => this.setState({priceCost: value})}
                            />
                        </Card>
                        <View style={styles.buttonContainer}>
                            <TouchableScale style={styles.buttonConfirm} friction={90} tension={100} onPress={(e) => this.postCost()}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableScale>
                            <TouchableScale style={{...styles.buttonConfirm, backgroundColor: '#ED8C72', marginLeft: wp('3%')}} friction={90} tension={100} onPress={(e) => this.setState({modalAddCost: false})}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableScale>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                {/* Flight detail modal */}
                <Modal
                    visible={this.state.modalFlightDetail}
                    transparent={true}
                    animationType = {"slide"}
                    onRequestClose={() => this.setState({modalFlightDetail: false})}
                >
                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={hp('8%')}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{this.state.flightSelected.destination}</Text>
                        <View style={{alignItems: 'flex-start', left: wp('-3%')}}>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> ORIGIN</Text>: {this.state.flightSelected.origin}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> FLIGHTS</Text>: {moment(this.state.flightSelected.start_date).format("DD/MM/YY")} - {moment(this.state.flightSelected.end_date).format("DD/MM/YY")}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> AIRLINE</Text>: {this.state.flightSelected.airline_name}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> FLIGHT NUMBER</Text>: {this.state.flightSelected.flight_number}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> PRICE</Text>: USD {this.state.flightSelected.price}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableScale style={{...styles.buttonConfirm, backgroundColor: '#ED8C72', marginLeft: wp('3%')}} friction={90} tension={100} onPress={(e) => this.setState({modalFlightDetail: false})}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableScale>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                {/* Hotel detail modal */}
                <Modal
                    visible={this.state.modalHotelDetail}
                    transparent={true}
                    animationType = {"slide"}
                    onRequestClose={() => this.setState({modalHotelDetail: false})}
                >
                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={hp('8%')}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>{this.state.hotelSelected.name}</Text>
                        <View style={{alignItems: 'flex-start', left: wp('-3%')}}>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> DATES</Text>: {moment(this.state.hotelSelected.start_date).format("DD/MM/YY")} - {moment(this.state.flightSelected.end_date).format("DD/MM/YY")}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> BEDS</Text>: {this.state.hotelSelected.number_beds}</Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> BREAKFAST</Text>: {this.state.breakfastHotelSelected} </Text>
                            <Text style={{marginBottom: hp("1%")}}><Text style={{fontWeight: "bold"}}> PRICE</Text>: {this.state.hotelSelected.total_price} </Text>
                            {this.paid()}
                            {this.notPaid()}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableScale style={{...styles.buttonConfirm, backgroundColor: '#ED8C72', marginLeft: wp('3%')}} friction={90} tension={100} onPress={(e) => this.setState({modalHotelDetail: false})}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableScale>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                <Text style={styles.titleMain}>{this.state.tripData.destination}</Text>
                <TouchableScale style={styles.buttonBack} friction={90} tension={100} onPress={(e) => this.goTo(e, 'My Trips', this.state.userData )}>
                    <Ionicons name="md-arrow-round-back" size={20} color="white" />
                </TouchableScale>
                <View style={styles.cardButtonContainer}>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.selectTab('flights')}>
                        <FontAwesome5 name="plane" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.selectTab('cities')}>
                        <FontAwesome5 name="city" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.selectTab('hotels')}>
                        <FontAwesome name="hotel" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.selectTab('activities')}>
                        <FontAwesome5 name="skiing" size={30} color="white" />
                    </TouchableScale>
                    <TouchableScale style={styles.cardButton} friction={90} tension={100} onPress={(e) => this.selectTab('costs')}>
                        <FontAwesome name="credit-card" size={30} color="white" />
                    </TouchableScale>
                </View>
                { this.renderElement() }
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
        marginLeft: wp('4%'),
        marginRight: wp('4%'),
        marginTop: hp('0.5%'),
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
    titleCostStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: hp('1.6%')
    },
    titleMain: {
        marginTop: hp('7%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('3%')
    },
    titleSub: {
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
        textAlign: 'center',
        fontSize: hp('2.5%')
    },
    buttonBack: {
        backgroundColor: '#ED8C72',
        width: wp('10%'),
        height: hp('5%'),
        borderRadius: 10,
        position: 'absolute',
        left: wp('4%'),
        top: hp('4%'),
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
        width: wp('15%'),
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
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B9C4C9',
        borderRadius: 10,
        marginTop: hp("30%"),
        height: hp('35%'),
        width: wp('80%'),
        margin: wp("10%")
    },
    textLogin: {
        borderBottomWidth: 0,
        marginTop: hp('-2%')
    },
    modalTitle: {
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('2.5%')
    },
    inputModal: {
        width: wp('70%'),
        height: hp('5%'),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    buttonConfirm: {
        justifyContent: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('4%'),
        borderRadius: 10,
        backgroundColor: '#2F496E',
        width: wp('30%'),
        height: hp('4%')
    },
    buttonContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dropdown: {
        backgroundColor: 'white',
        padding: hp('1%'),
        width: wp('70%'),
        height: hp('5%'),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white'
    },
    dropdownText: {
        left: wp('4%'),
        color: 'gray',
        fontSize: hp('2%')
    }
});