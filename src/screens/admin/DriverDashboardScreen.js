import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';

const DriverDashboardScreen = () => {
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logoutUser());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Driver Dashboard</Text>
            <View style={styles.buttonContainer}>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default DriverDashboardScreen;
