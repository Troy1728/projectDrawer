import { getDatabase } from '@firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { FIREBASE_APP } from './FirebaseConfig';

const checkNetworkConnectivity = async () => {
    const state = await NetInfo.fetch();
    return NetInfo.isConnected;
}

const syncLocalPosts = async () => {
    const isConnected = await checkNetworkConnectivity();
    if (isConnected) {
        const localPostKeys = await AsyncStorage.getAllKeys();
        const database = getDatabase(FIREBASE_APP);

        localPostKeys.forEach(async (key) => {
            if (key.startsWith('locaPost_')) {
                const postData = JSON.parse(await AsyncStorage.getItem(key));
                const postRef = ref(database, `posts/${key.slice(10)}`);
                await set(postRef, postData);
                await AsyncStorage.removeItem(key);
                console.log(`Post synced successfully: ${key}`)
            }
        })
    }
}

export { checkNetworkConnectivity, syncLocalPosts };