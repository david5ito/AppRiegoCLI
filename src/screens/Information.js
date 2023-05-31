import React, { useEffect, useState } from 'react';
import { Text, View, ImageBackground, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../config/fb';
import EmojiPicker from 'rn-emoji-keyboard';

const Information = ({ route }) => {
  const { plantId } = route.params;
  const [plantData, setPlantData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    apodo: '',
    hortaliza: '',
    emoji: '',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const docRef = doc(database, 'plants', plantId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setPlantData(docSnapshot.data());
          setEditedData({
            apodo: docSnapshot.data().apodo,
            hortaliza: docSnapshot.data().hortaliza,
            emoji: docSnapshot.data().emoji,
          });
        } else {
          console.log('El documento no existe');
        }
      } catch (error) {
        console.log('Error al obtener la información de la planta:', error);
      }
    };

    fetchPlantData();
  }, [plantId]);

  const handleEdit = () => {
    setEditMode(true);
    setShowSuccessMessage(false); // Reiniciar el estado del mensaje de éxito al iniciar la edición
  };

  const handlePick = (emojiObject) => {
    setEditedData({
      ...editedData,
      emoji: emojiObject.emoji,
    });
  };

  const handleSave = async () => {
    try {
      const docRef = doc(database, 'plants', plantId);
      await updateDoc(docRef, {
        apodo: editedData.apodo,
        hortaliza: editedData.hortaliza,
        emoji: editedData.emoji,
      });
      setPlantData(editedData);
      setEditMode(false);
      setShowSuccessMessage(true); // Mostrar el mensaje de éxito después de guardar
    } catch (error) {
      console.log('Error al guardar los cambios:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedData({
      apodo: plantData.apodo,
      hortaliza: plantData.hortaliza,
      emoji: plantData.emoji,
    });
    setShowSuccessMessage(false); // Ocultar el mensaje de éxito al cancelar
  };

  const handleInputChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.5 }}
    >
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          {!editMode && plantData && (
            <>
              <Text style={styles.emoji}>{plantData.emoji}</Text>
              <Text style={styles.label}>Apodo:</Text>
              <Text style={styles.text}>{plantData.apodo}</Text>
              <Text style={styles.label}>Hortaliza:</Text>
              <Text style={styles.text}>{plantData.hortaliza}</Text>
            </>
          )}

          {!editMode ? (
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editContainer}>
              <Text style={styles.title}>Editar</Text>

              <TouchableOpacity style={styles.emojiButton} onPress={() => setIsOpen(true)}>
                <Text style={styles.emoji}>{editedData.emoji}</Text>
              </TouchableOpacity>
              <EmojiPicker
                onEmojiSelected={handlePick}
                open={isOpen}
                onClose={() => setIsOpen(false)}
              />

              <Text style={styles.label}>Apodo:</Text>
              <TextInput 
                style={styles.input}
                value={editedData.apodo}
                onChangeText={(value) => handleInputChange('apodo', value)}
                placeholder="Nuevo apodo"
              />

              <Text style={styles.label}>Hortaliza:</Text>
              <TextInput
                style={styles.input}
                value={editedData.hortaliza}
                onChangeText={(value) => handleInputChange('hortaliza', value)}
                placeholder="Nueva hortaliza"
              />

              <View style={styles.editButtonsContainer}>
                <TouchableOpacity
                  style={[styles.saveButton, showSuccessMessage && styles.buttonPressed]}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, showSuccessMessage && styles.buttonPressed]}
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>

              {showSuccessMessage && (
                <Text style={styles.successMessage}>Cambios guardados correctamente</Text>
              )}
            </View>
          )}
        </View>

        {!plantData && (
          <Text style={styles.texto}>Cargando información...</Text>
        )}
      </View>
    </ImageBackground>
  );
};

export default Information;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0FA5E9',
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
  },
  emoji: {
    fontSize: 100,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'gray',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  editContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    color: 'black',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#66CC66',
    padding: 10,
    borderRadius: 8,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#FF6666',
    padding: 10,
    borderRadius: 8,
    width: '45%',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  emojiButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  successMessage: {
    marginTop: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  texto: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  title: {
      fontSize: 32,
      fontWeight: 'bold',
      margin: 16,
      color: 'black',
      textAlign: 'left',
  },
});
