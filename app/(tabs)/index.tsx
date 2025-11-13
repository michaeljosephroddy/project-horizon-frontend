import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnalyticsScreen } from '../../src/screens/AnalyticsScreen';
import { DashboardScreen } from '../../src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
    </Stack.Navigator>
  );
}