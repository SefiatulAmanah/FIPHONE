import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Notification} from 'iconsax-react-native';
import {CategoryList} from '../../../data';
import {ItemSmall, ListHorizontal} from '../../components';
import {fontType, colors} from '../../theme';
import firestore from '@react-native-firebase/firestore';
const ItemCategory = ({item, onPress, color}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={category.item}>
        <Text style={{...category.title, color}}>{item.categoryName}</Text>
      </View>
    </TouchableOpacity>
  );
};
const FlatListCategory = () => {
  const [selected, setSelected] = useState(1);
  const renderItem = ({item}) => {
    const color = item.id === selected ? colors.blue() : colors.grey();
    return (
      <ItemCategory
        item={item}
        onPress={() => setSelected(item.id)}
        color={color}
      />
    );
  };
  return (
    <FlatList
      data={CategoryList}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      ItemSeparatorComponent={() => <View style={{width: 10}} />}
      contentContainerStyle={{paddingHorizontal: 24}}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setproductData] = useState([]);
  useEffect(() => {
    const fetchProductData = () => {
      try {
        const productCollection = firestore().collection('product');
        const unsubscribeProduct = productCollection.onSnapshot(querySnapshot => {
          const products = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setproductData(products);
          setLoading(false);
        });

        return () => {
          unsubscribeProduct();
        };
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchProductData();
  }, []);

  const horizontalData = productData.slice(0, 5);
  const verticalData = productData.slice(5);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FIPHONEAPPS</Text>
        <Notification color={colors.black()} variant="Linear" size={24} />
      </View>
      <View style={styles.listCategory}>
        <FlatListCategory />
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size={'large'} color={colors.blue()} />
          ) : (
            <View style={styles.listBlog}>
              <ListHorizontal data={horizontalData} />
              <View style={styles.listCard}>
                {verticalData.map((item, index) => (
                  <ItemSmall item={item} key={index} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: fontType['Pjs-ExtraBold'],
    color: colors.black(),
  },
  listCategory: {
    paddingVertical: 10,
  },
  listBlog: {
    paddingVertical: 10,
    gap: 10,
  },
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },
});
const category = StyleSheet.create({
  item: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: colors.grey(0.08),
  },
  title: {
    fontFamily: fontType['Pjs-SemiBold'],
    fontSize: 14,
    lineHeight: 18,
  },
});