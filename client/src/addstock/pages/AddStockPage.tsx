import { View } from 'react-native'
import { useAppTheme } from '../../shared/provider/AppThemeProvider';
import AddStockScreen1 from '../components/AddStockScreen1';



const AddStockPage = () => {
  
  const {theme} = useAppTheme();

  return (
    <View style={{ flex: 1 ,borderBottomWidth:50 , borderTopWidth:20 , borderColor:theme.colors.background } }>
<AddStockScreen1 />
    </View>
  )
}

export default AddStockPage