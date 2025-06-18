import { messaging } from './firebase-init';
import { getToken } from 'firebase/messaging';

export async function requestFcmToken(userId) {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn("Notification permission denied");
      return;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: 'BEiokVTrMNI-n2044wkefcT8xb4_7H4b9MpvcxAKv6P9YvAzob56aSVeYJtUV8TSjBzzb2bzdXE3u34gT8OHUpA' // Replace with actual VAPID key from Firebase Console
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);
      saveTokenToServer(userId, currentToken, 'web');
    } else {
      console.warn("No FCM token received.");
    }

  } catch (err) {
    console.error("FCM token error:", err);
  }
}

function saveTokenToServer(userId, token, deviceType = 'web') {
  fetch("https://software.iqjita.com/save_fcm_token.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      user_id: userId,
      fcm_token: token,
      device_type: deviceType,
    }),
  })
  .then((res) => res.text())
  .then((res) => console.log("Token saved:", res))
  .catch((err) => console.error("Failed to save token:", err));
}
