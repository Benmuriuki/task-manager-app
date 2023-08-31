import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../Aunth/firebase';
//import { Clipboard } from '@react-native-clipboard/clipboard';

const PromotionScreen = () => {
  const navigation = useNavigation();
  const [referralCode, setReferralCode] = useState('');
  const [promotionLink, setPromotionLink] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    fetchEarnedPoints();
  }, []);

  const fetchEarnedPoints = async () => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    const userDocRef = doc(db, 'users', currentUserId);
    const userDocSnap = await userDocRef.get();
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setEarnedPoints(userData.earnedPoints || 0);
    }
  };

  const handleGenerateLink = async () => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    // Generate the promotion link with the user's promotion code
    const promotionLink = `https://example.com/signup?ref=${currentUserId}`;

    // Update the promotion link in the user's document
    const userDocRef = doc(db, 'users', currentUserId);
    await updateDoc(userDocRef, {
      promotionLink,
    });

    setPromotionLink(promotionLink);
  };

  const handleCopyLink = () => {
    Clipboard.setString(promotionLink);
    Alert.alert('Copied to Clipboard', 'Promotion link copied to clipboard.');
  };

  const handleReferral = async () => {
    // Check if the referral code is valid
    const referralDocRef = doc(db, 'users', referralCode);
    const referralDocSnap = await referralDocRef.get();
    if (!referralDocSnap.exists()) {
      Alert.alert('Invalid Referral Code', 'Please enter a valid referral code.');
      return;
    }

    try {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      // Update the promotion status for the current user
      const userDocRef = doc(db, 'users', currentUserId);
      await updateDoc(userDocRef, {
        promotion: true,
      });

      // Increment the referral count and earned points for the referred user
      await updateDoc(referralDocRef, {
        referralCount: increment(1),
        earnedPoints: increment(50),
      });

      Alert.alert('Promotion Successful', 'Congratulations! You have received a promotion.');
      fetchEarnedPoints(); // Fetch updated earned points
    } catch (error) {
      console.error('Error promoting user: ', error);
      Alert.alert('Error', 'Failed to process promotion. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.earnedPointsContainer}>
        <Text style={styles.earnedPointsText}>Total Earnings: {earnedPoints}</Text>
      </View>
      <Text style={styles.title}>Refer a Friend and earn.</Text>
      <Text style={styles.subtitle}>Generate a referral link to share with your friends:</Text>
      <TouchableOpacity style={styles.button} onPress={handleGenerateLink}>
        <Text style={styles.buttonText}>Generate Link</Text>
      </TouchableOpacity>
      {promotionLink ? (
        <>
          <TouchableOpacity style={styles.promotionLinkContainer} onPress={handleCopyLink}>
            <Text style={styles.promotionLink}>{promotionLink}</Text>
            <Text style={styles.copyLinkText}>Copy</Text>
          </TouchableOpacity>
          <Text style={styles.promotionCode}>
            Your Promotion Code: {auth.currentUser?.uid}
          </Text>
        </>
      ) : null}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius:2,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  promotionLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

    borderWidth:2,
    borderRadius: 1,
    borderColor: 'gray',
    padding: 10,
  },
  promotionLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
    flex: 1,
  },
  copyLinkText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  promotionCode: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  earnedPointsContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'tomato-blue',
    padding: 8,
  },
  earnedPointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromotionScreen;
