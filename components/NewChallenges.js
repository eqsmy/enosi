import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import CircularProgress from 'react-native-circular-progress-indicator'; // Assuming you want to keep using this for progress
import { CardContent } from '@mui/material';

export default function UserChallenges({ item, onPress, showUser }) {
    // console.log(item);
    const iconSource = activityIcons[item.activity_type];
  return (
    <Card style={styles.challengeCard}>
      {item?.photo_url && (
            <Card.Cover source={{ uri: item.photo_url }} style={styles.challengeImage} />
        )}
    <Card.Content>
        <Text style={styles.challengeTitle}>{item.name}</Text>
                <Text style={styles.challengeDetails}>Info: {item.description}</Text>
        <View style={styles.contentRow}>
            {iconSource && <Image source={iconSource} style={styles.activityImage} />}
            <View style={styles.textContainer}>
                <Text style={styles.challengeDetails}>Goal: {item.activity_type} {item.total_goal} {item.units}</Text>
            </View>
        </View>
    </Card.Content>
        <Card.Actions>
            <Button onPress={onPress} mode="contained" style={styles.joinChallengeButton}  >
            Join Challenge
            </Button>
        </Card.Actions>
    </Card>
  );
}

const activityIcons = {
    "Bike": require('../assets/activityIcons/bike.png'),
    "Hike": require('../assets/activityIcons/hike.png'),
    "Lift": require('../assets/activityIcons/lift.png'),
    "Meditate": require('../assets/activityIcons/meditate.png'),
    "Run": require('../assets/activityIcons/run.png'),
    "Swim": require('../assets/activityIcons/swim.png'),
};

const styles = StyleSheet.create({
    challengeCard: {
        margin: 10,
        elevation: 2, // for Android shadow
        // width: '50%',
        // height: "auto",
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        },
    textContainer: {
        flex: 1,
        marginLeft: 8, // Add some spacing between the icon and the text
    },
    challengeImage: {
        height: 100, // Adjust based on your needs
        width: '100%',
    },
    challengeTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
    challengeDetails: {
        fontSize: 14,
        color: 'gray',
    },
    logbookButton: {
        flex: 1,
    },
    joinChallengeButton: {
        flex: 1,
        backgroundColor: '#BADE86',
    },
    progressContainer: {
        padding: 10,
        alignItems: 'center',
    },
    activityImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
});
