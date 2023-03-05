import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import AuthNavigation from './navigation/AuthNavigation';

export default function App() {
  
  return (
    <Provider store={store}>
      <AuthNavigation/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  mainSafeArea: {
    flex: 1,
    backgroundColor: "#141414",
  }
});