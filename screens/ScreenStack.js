import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from  'react-navigation'
import Home from './Home'
import UpdateCust from './UpdateCust'

const screens = {
    Home: {
        screen: Home
    },
    UpdateCust: {
        screen: UpdateCust,
        navigationOptions: {
            title: 'Update Customer',
        }
    }
}

const ScreenStack = createStackNavigator(screens);

export default createAppContainer(ScreenStack);