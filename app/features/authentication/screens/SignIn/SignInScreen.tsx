import _ from 'lodash';
import { Body, Button, Container, Header , Left, Right} from 'native-base';
import React from 'react';
import { Alert, Keyboard, NativeScrollEvent, NativeScrollPoint, NativeSyntheticEvent, StatusBar, StyleProp, Text, TextStyle, View, ViewStyle, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FeatherIcon from 'react-native-vector-icons/Feather'
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AuthApi from '../../../../api/auth';
import { ApiClient } from '../../../../api/client';
import HairlineSeparatorWithText from '../../../../components/HairlineSeperator';
import formStyles  from '../../../../components/SignUpForm/styles';
import { SocialProviderAuthCarousel } from '../../../../components/SocialIconCarousel/SocialIconCarousel';
import { SignInTermsOfService } from '../../../../components/TermsOfService';
import ApplicationStyles from '../../../../config/ApplicationStyles';
import Fonts from '../../../../config/Fonts';
import Metrics from '../../../../config/metrics';
import { Colors, Layout, text } from '../../../../config/styles';
import { GetPropsFromDispatch } from '../../../../store/ActionCreators';
import AppActions from '../../../../store/AppActions';
import { StateStore } from '../../../../store/AppReducer';
import { Storage } from '../../../../utils/storage';
import { loginForm } from '../SignUp/Forms';
import strings from './strings';
import NavigationService from 'app/utils/NavigationService';
import { Toast } from "components/Toast";
import { Box } from "components/Box";

type ScrollState = 'Start' | 'End';
type KeyboardState = 'Open' | 'Closed';

const KEYBOARD_OFFSET = 55;//verticalScale(55);
const SCROLL_TARGET = Dimensions.get('screen').height > 667 ? 227 : 150;//verticalScale(227); // This is a temporary value and will be removed once the in simulator overscroll issue is rectified.
const SCROLL_HEIGHT_TARGET = SCROLL_TARGET - KEYBOARD_OFFSET;

type StateInjectedProps = ReturnType<typeof mapStateToProps>;
// needed to properly type dispatch injected props
type DispatchInjectedProps = GetPropsFromDispatch<typeof AppActions>;
type InjectedProps = StateInjectedProps & DispatchInjectedProps;
type SignInScreenProps = NavigationScreenProps & InjectedProps;
interface State {
    hideSecureInput: boolean;
    scrollState: ScrollState;
    keyboardState: KeyboardState;
    isInTransition: boolean;
}

const initialState: State = {
    hideSecureInput: true, 
    isInTransition: false,
    keyboardState: 'Closed',
    scrollState: 'Start'
}
export class SignInScreen extends React.Component<SignInScreenProps, State> {
    
    
    public scrollRef: KeyboardAwareScrollView | null = null;
    public state = initialState;
    
    public componentWillMount = () => {
        this.setState(initialState);
    }

    
    /**
     * Hides input in a secured form.
     */
    public hideInput = (): void => this.setState({ hideSecureInput: true });
    /**
     * Show input in a secured form.
     */
    public showInput = (): void => this.setState({ hideSecureInput: false });
    /**
     * Toggle secure input display.
     */
    public toggleInputSecurity = (): void => this.setState((prevState) => ({ hideSecureInput : !prevState.hideSecureInput } ));

    public scrollToY = (height: number) => this.scrollRef?.scrollToPosition(0, height, true);
    
    public onTransitionBegin = ()=> this.setState({isInTransition: true});

    public onTransitionEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = _.get(event, 'nativeEvent.contentOffset') as NativeScrollPoint;
        if(y >= SCROLL_HEIGHT_TARGET) {
            this.setState({scrollState: 'End', isInTransition: false});
        } else if(y <= 0) {
            this.setState({scrollState: 'Start', isInTransition: false});
        }
    }
    public handleOnFocus = (targetX?: number) => { 
        this.scrollToY(SCROLL_HEIGHT_TARGET);
    }

    public handleSubmit = (username: string, password: string) => {
        // this.props.signIn({ username, password });
        
        AuthApi.signIn({ username, password }) 
        .then(result => { 
            if(result.state === 'Authenticated') {   
                Storage.OnUpdateUsername();
                ApiClient.instance.createUserProfile({ })
                .then(response=> response)
                .catch(error=> error)
                .finally(()=> NavigationService.navigate('Home'));
            } else if (result.state === 'ConfirmAccountCodeWaiting') {
                
                Alert.alert('Please confirm your account');
                NavigationService.navigate('AccountConfirmation');
            } else {
                
                Alert.alert(`${result.error!.message}`);
            }
        })
        // tslint:disable-next-line:no-console
        .catch(error=> console.log(error));
    }

    public renderLeftHeaderIcon = () => {
        console.log(this.state);
        if(!this.state.isInTransition) {
        return this.state.scrollState !== 'Start' ?  
            <FeatherIcon
                style={{paddingLeft: Metrics.margin }}
                name={'x'}
                color={Colors.black}
                size={ Metrics.icons.small}
                onPress={Keyboard.dismiss}/> :
            <IoniconIcon 
                style={{paddingLeft: Metrics.margin}}
                name={ 'ios-arrow-back' } 
                color={ Colors.black }
                size={ Metrics.icons.small }
                onPress={()=> NavigationService.navigate('Landing')}/> 
        }
        
    }


    

    public render(): JSX.Element {
        return (
            <Box flex={1}>
            <Header
                style={{ backgroundColor: Colors.transparent }}
                iosBarStyle={'light-content'}
                translucent={true}
                androidStatusBarColor={Colors.burgundy}
                transparent={false}
                noShadow={false}>
                <StatusBar networkActivityIndicatorVisible={true} hidden={false} barStyle={'default'} translucent={true} />
                <Left>
                    <Button 
                        transparent={true}
                        disabled={(this.state.isInTransition)}
                        onPressIn={() => this.state.scrollState !== 'Start' ? Keyboard.dismiss() : NavigationService.navigate('Landing')}>
                        {this.renderLeftHeaderIcon()}
                    </Button>
                </Left>
                <Body>
                    <Text style={ApplicationStyles.screenTitle as StyleProp<TextStyle>}>{strings.loginTitle}</Text>
                </Body>
                <Right/>
            </Header>
            <KeyboardAwareScrollView
                ref={(scrollView)=> this.scrollRef = scrollView}
                style={{ flex: 1, backgroundColor: Colors.transparent}}
                contentContainerStyle={[formStyles.container]}
                keyboardShouldPersistTaps={'always'}
                enableResetScrollToCoords={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                onMomentumScrollBegin={this.onTransitionBegin}
                onMomentumScrollEnd= {this.onTransitionEnd}
                onKeyboardDidHide={()=> this.setState({keyboardState: 'Closed'})}
                onKeyboardDidShow={()=> this.setState({keyboardState: 'Open'})}>
                <View style={[Layout.verticalLeftAlign, {alignItems: 'center'}]}>
                    <View style={{marginTop: 30}}/>
                    <Text style={[text.regularDark, {fontSize: Fonts.size.medium, marginBottom: 0}]}> {strings.continueWith} </Text>
                        <View style={{ marginBottom: Metrics.margin, marginTop: Metrics.margin2x }} />
                        {/* <Box debug justifyContent={'center'}> */}
                            <SocialProviderAuthCarousel 
                                onSuccess={()=> NavigationService.navigate('Home')} 
                                onFailure={()=> Alert.alert('Social sign in failed.') }
                                marginRight={Metrics.marginHalf} 
                                // containerStyle={{ flexDirection: 'row'}}
                                containerStyle={{ marginLeft: 60, marginRight: Metrics.margin2x, marginTop: 0, marginBottom: 0, flexDirection: 'row'}} 
                                navigation={this.props.navigation}
                            />
                        {/* </Box> */}
                </View>
                { HairlineSeparatorWithText( { containerStyle: hairLineStyle } ) }
                { loginForm(this.handleSubmit, this.props.navigation, strings.loginButton, ForgotPasswordSection(() => NavigationService.navigate('ForgotPassword')), this.handleOnFocus) }
                { SignInTermsOfService(tosStyle) }
            </KeyboardAwareScrollView>
            </Box>
        );
    }
}


const mapStateToProps = (state: StateStore) => ({
    AuthState: state.authReducer
});
const mapDispatchToProps = (dispatch: Dispatch) => 
    bindActionCreators<typeof AppActions, DispatchInjectedProps>(AppActions, dispatch);
  
export default connect<StateInjectedProps, DispatchInjectedProps, {}, StateStore>(
    mapStateToProps,
    mapDispatchToProps
)(SignInScreen);
  

export const ForgotPasswordSection = (onPress: ()=> void): JSX.Element => (
<View style={[Layout.horizontalLeftAlign, Layout.alignCentered, {marginBottom: 25}]}>
    <Text style={text.regularDark} > {strings.forgotPassword} </Text>
    <Text onPress={onPress} style={[text.mediumDark, {marginLeft: -5}]}> {strings.getHelp} </Text>
</View>
);

const hairLineStyle = { flexDirection: 'row', marginHorizontal: 60, marginBottom: Metrics.margin2x, marginTop: -125} as StyleProp<ViewStyle>;
const tosStyle = { marginBottom: 200, marginTop: Metrics.margin2x, flexDirection: 'column' } as StyleProp<ViewStyle>; 