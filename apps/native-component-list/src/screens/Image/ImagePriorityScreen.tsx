import { Image, ImageCachePolicy, ImageContentFit, ImagePriority } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import Button from '../../components/Button';
import { Colors } from '../../constants';

export default function ImagePriorityScreen() {
  const [id, setId] = useState(0);

  const defaultProps = {
    style: styles.image,
    contentFit: ImageContentFit.COVER,
    cachePolicy: ImageCachePolicy.NONE,
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageRow}>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `https://picsum.photos/id/${id + 1}/1000/2000` }}
            {...defaultProps}
            priority={ImagePriority.LOW}
          />
          <Text style={styles.label}>LOW</Text>
        </View>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `https://picsum.photos/id/${id + 2}/1000/2000` }}
            {...defaultProps}
            priority={ImagePriority.NORMAL}
          />
          <Text style={styles.label}>NORMAL</Text>
        </View>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `https://picsum.photos/id/${id + 3}/1000/2000` }}
            {...defaultProps}
            priority={ImagePriority.HIGH}
          />
          <Text style={styles.label}>HIGH</Text>
        </View>
      </View>
      <Button title="Reload" onPress={() => setId(id + 3)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'flex-start',
  },
  imageRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  imageBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: '90%',
    width: '33%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  label: {
    position: 'absolute',
    bottom: -20,
    left: 0,
  },
});
