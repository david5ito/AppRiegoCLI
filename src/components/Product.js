import * as React from 'react';
import * as RN from 'react-native';
import { database } from '../../config/fb';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IconButton } from 'react-native-paper';

import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
export default function Product({
    id,
    emoji,
    apodo,
    hortaliza,
    status,
}) {
    const navigation = useNavigation();

    const onDelete = () => {
        const docRef = doc(database, 'plants', id);
        deleteDoc(docRef);
    }

    const onEdit = () => {
        const docRef = doc(database, 'plants', id);
        updateDoc(docRef, {
            status: true,
        });
    }

    const onNavigateToInformation = () => {
        navigation.navigate('Information', { plantId: id });
    };

    return (
        <RN.View>
            <RN.TouchableOpacity onPress={onNavigateToInformation}>
                <RN.View style={{ ...styles.productContainer, opacity: 0.85 }}>
                    <RN.Text style={styles.apodo}>{apodo}</RN.Text>
                    <RN.View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <RN.Text style={styles.emoji}>{emoji}</RN.Text>
                        <RN.TouchableOpacity onPress={onDelete}>
                        <RN.Image
                            source={require('../../assets/delete-32.png')}
                            style={styles.deleteIcon}
                        />
                        </RN.TouchableOpacity>
                    </RN.View>
                    <RN.Text style={styles.hortaliza}>{hortaliza}</RN.Text>

                    {status ? (
                        <RN.TouchableOpacity
                            style={[styles.button, { backgroundColor: 'gray' }]}
                        >
                            <RN.Text style={styles.buttonText}>Regada</RN.Text>
                        </RN.TouchableOpacity>
                    ) : (
                        <RN.TouchableOpacity onPress={onEdit} style={styles.button}>
                            <RN.Text style={styles.buttonText}>Regar</RN.Text>
                        </RN.TouchableOpacity>
                    )}
                </RN.View>
            </RN.TouchableOpacity>
        </RN.View>
    )
}

const styles = RN.StyleSheet.create({
    productContainer: {
        padding: 16,
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 8,
    },
    emoji: {
        fontSize: 100,
    },
    apodo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    hortaliza: {
        fontSize: 24,
        color: 'black',
    },
    button: {
        backgroundColor: '#0FA5E9',
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    deleteIcon: {
        width: 24,
        height: 24,
    },
});