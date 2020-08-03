import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import { Ionicons, FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Card, Input, Divider, ListItem } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

export default class TripDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            tripData: {},
            flights: [],
            cities: [],
            hotels: [],
            costs: [],
            activities: [],
            userData: {},
            selectedTab: 'cities',
            tripID: null,
            modalAddCost: false
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
                    res.data.cities.forEach(city => {
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
                    this.setState({
                        tripData: res.data,
                        cities: res.data.cities,
                        flights: res.data.flights,
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

    goTo(e, view, data){
        const { navigate } = this.props.navigation;
        navigate(view, {userData: this.state.userData, userData: data})
    }

    selectTab(value){
        this.setState({selectedTab: value})
    }

    renderElement(){
        if (this.state.selectedTab === 'cities') {
            return(
                <View>
                    <Text style={styles.titleSub}>Cities</Text>
                    <TouchableScale disabled={true} style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                        <Ionicons name="ios-add" size={20} color="white" />
                    </TouchableScale>
                    {
                        this.state.cities.map((item, i) => (
                            <ListItem
                                key={i}
                                Component={TouchableScale}
                                friction={90}
                                tension={100}
                                title={item.name}
                                titleStyle={styles.titleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                                onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
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
                    <TouchableScale disabled={true} style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                        <Ionicons name="ios-add" size={20} color="white" />
                    </TouchableScale>
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
                                onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
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
                    <TouchableScale disabled={true} style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                        <Ionicons name="ios-add" size={20} color="white" />
                    </TouchableScale>
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
                                onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
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
                    <TouchableScale disabled={true} style={styles.buttonAdd} friction={90} tension={100} onPress={(e) => this.goTo(e, 'Home')}>
                        <Ionicons name="ios-add" size={20} color="white" />
                    </TouchableScale>
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
                                onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
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
                                title={item.name}
                                titleStyle={styles.titleStyle}
                                subtitle= {item.badge_total_price + " " + item.total_price}
                                subtitleStyle={styles.subtitleStyle}
                                containerStyle={[styles.containerList, {backgroundColor: '#2F496E'}]}
                                contentContainerStyle={{marginLeft: '5%'}}
                                onPress={(e)=> this.goTo(e, 'Trip Details', item.id)}
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

    render(){
        return(
            <ScrollView style={styles.viewHome}>
                {/* Costs modal */}
                <Modal
                    visible={this.state.modalAddCost}
                    transparent={true}
                    animationType = {"slide"}
                    onRequestClose={() => this.setState({modalAddCost: false})}
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Add Cost</Text>
                        <Card containerStyle={styles.inputModal}>
                            <Input
                                inputStyle={{width: '50%'}}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='City'
                            />
                        </Card>
                        <Card containerStyle={styles.inputModal}>
                            <Input
                                inputStyle={{width: '50%'}}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Name'
                            />
                        </Card>
                        <Card containerStyle={styles.inputModal}>
                            <Input
                                inputStyle={{width: '50%'}}
                                inputContainerStyle={styles.textLogin}
                                placeholderTextColor="gray"
                                placeholder='Total price (USD)'
                            />
                        </Card>
                        <View style={styles.buttonContainer}>
                            <TouchableScale style={styles.buttonConfirm} friction={90} tension={100} onPress={(e) => this.goTo(e, 'My Trips', this.state.userData )}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableScale>
                            <TouchableScale style={{...styles.buttonConfirm, backgroundColor: '#ED8C72', marginLeft: wp('3%')}} friction={90} tension={100} onPress={(e) => this.setState({modalAddCost: false})}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableScale>
                        </View>
                    </View>
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
    titleSub: {
        marginTop: hp('4%'),
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
        marginTop: hp('4%'),
        marginLeft: wp('3%'),
        marginRight: wp('3%')
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B9C4C9',
        borderRadius: 10,
        marginTop: hp("30%"),
        height: '40%',
        width: wp('80%'),
        margin: wp("10%")
    },
    textLogin: {
        borderBottomWidth: 0,
        marginTop: hp('-2%')
    },
    modalTitle: {
        marginTop: hp('4%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp('2.5%')
    },
    inputModal: {
        width: wp('70%'),
        height: hp('5%'),
        borderRadius: 10,
        borderWidth: 2
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
    }
});