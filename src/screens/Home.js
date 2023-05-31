import * as React from 'react';
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../config/fb';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Product from '../components/Product';

export default function Home() {

    const [products, setProducts] = React.useState([]);
    const navigation = useNavigation();

    React.useEffect(() => {
        const collectionRef = collection(database, 'plants');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log('querySnapshot unsusbscribe');
            setProducts(
                querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    emoji: doc.data().emoji,
                    apodo: doc.data().apodo,
                    hortaliza: doc.data().hortaliza,
                    status: doc.data().status,
                    createdAt: doc.data().createdAt,
                }))
            );
        });

        return unsubscribe;
    }, []);

    return (
        <RN.View style={styles.container}>
            <RN.ImageBackground
                source={require('../../assets/fondo.jpg')} // Ruta de la imagen de fondo
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <RN.ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <RN.Text style={styles.title}>Hortalizas</RN.Text>
                    {products.map((product) => (
                        <Product key={product.id} {...product} />
                    ))}
                    <RN.TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Add')}
                    >
                        <RN.Text style={styles.buttonText}>+</RN.Text>
                    </RN.TouchableOpacity>
                </RN.ScrollView>
            </RN.ImageBackground>
        </RN.View>
    );
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F3F9',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        margin: 16,
        color: 'black',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollViewContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    button: {
        backgroundColor: '#0FA5E9',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
});
