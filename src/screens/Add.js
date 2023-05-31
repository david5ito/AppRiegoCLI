import * as React from 'react';
import * as RN from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../config/fb';
import { useNavigation } from '@react-navigation/native';
import EmojiPicker from 'rn-emoji-keyboard';
import * as ImagePicker from 'react-native-image-picker';

export default function Add() {
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [newItem, setNewItem] = React.useState({
        emoji: '📷',
        apodo: '',
        hortaliza: '',
        status: false,
        createdAt: new Date(),
    });

    //<RN.Button title="Imagen" onPress={pickImage} /> es para usar el boton
    const pickImage = () => {
        let result = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        console.log(result);

        if(!result.canceled){
            setNewItem({...newItem, emoji:result.assets[0].uri});
        }
    };

    const handlePick = (emojiObject) => {
        setNewItem({
            ...newItem,
            emoji: emojiObject.emoji,
        });
    }

    //Registrar
    const onSend = async () => {
        const docRef = await addDoc(collection(database, 'plants'), newItem);
        navigation.goBack();
      }

      return (
        <RN.ImageBackground
          source={require('../../assets/fondo.jpg')} // Ruta de la imagen de fondo
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <RN.View style={styles.container}>
            <RN.Text style={styles.title}>Nuevo Registro</RN.Text>
            
    
            <RN.Text onPress={() => setIsOpen(true)} style={styles.emoji}>
              {newItem.emoji}
            </RN.Text>
            <EmojiPicker
              onEmojiSelected={handlePick}
              open={isOpen}
              onClose={() => setIsOpen(false)}
            />
            <RN.TextInput
            onChangeText={(text) => setNewItem({ ...newItem, apodo: text })}
            style={[styles.inputContainer, { backgroundColor: 'white' }]}
            placeholder="Apodo de la hortaliza"
            placeholderTextColor="black"
            />
            <RN.TextInput
            onChangeText={(text) => setNewItem({ ...newItem, hortaliza: text })}
            style={[styles.inputContainer, { backgroundColor: 'white' }]}
            placeholder="Nombre de la hortaliza"
            placeholderTextColor="black"
            />
            <RN.Button title="Guardar" onPress={onSend} />
          </RN.View>
        </RN.ImageBackground>
      );
    }
    
    const styles = RN.StyleSheet.create({
      container: {
        flex: 1,
        padding: 25,
        backgroundColor: 'transparent',
        alignItems: 'center',
      },
      backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
         opacity: 0.85,
      },
      title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'black',
      },
      inputContainer: {
        width: '90%',
        padding: 13,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        color: 'black',
      },
      emoji: {
        fontSize: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginVertical: 6,
        color: 'black',
      },
    });