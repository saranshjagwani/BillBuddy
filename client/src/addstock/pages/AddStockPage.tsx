import { View } from 'react-native'
import { useAppTheme } from '../../shared/provider/AppThemeProvider';
import AddStockScreen1 from '../components/AddStockScreen1';
import { useRoute } from "@react-navigation/native";

const AddStockPage = () => {
  const { theme } = useAppTheme();

  const route = useRoute<any>();
  const item = route.params?.item;

  console.log("Page received item:", item); // ✅ debug

  return (
    <View style={{ flex: 1, borderBottomWidth: 50, borderTopWidth: 20, borderColor: theme.colors.background }}>
      <AddStockScreen1 item={item} />
    </View>
  );
};

export default AddStockPage;
