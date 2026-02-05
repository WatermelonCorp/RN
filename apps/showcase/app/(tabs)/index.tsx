import { View, StyleSheet } from 'react-native';
import { Button } from '@watermelon/registry/components/ui/button';
import { Text } from '@watermelon/registry/components/ui/text';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <Text variant="h1" className="text-3xl font-bold">Watermelon</Text>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Text variant="h3">Button Component Demo</Text>

        <View style={{ gap: 10 }}>
          <Button onPress={() => alert('Primary pressed')}>
            <Text>Primary Button</Text>
          </Button>

          <Button variant="secondary" onPress={() => alert('Secondary pressed')}>
            <Text variant="h4">Secondary Button</Text>
          </Button>

          <Button variant="destructive" onPress={() => alert('Destructive pressed')}>
            <Text>Destructive Button</Text>
          </Button>

          <Button variant="outline" onPress={() => alert('Outline pressed')}>
            <Text>Outline Button</Text>
          </Button>
          <Button variant="ghost" onPress={() => alert('Ghost pressed')}>
            <Text>Ghost Button</Text>
          </Button>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
