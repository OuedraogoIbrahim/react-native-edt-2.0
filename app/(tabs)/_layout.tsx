import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { Appbar, Text } from "react-native-paper";
import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/api/auth";

type TabItem = {
  route: string;
  label: string;
  icon: string;
};

const Colors = {
  white: "#FFFFFF",
  black: "#000000",
  primary: "#34acb4",
};

const TabArr = (user: any): TabItem[] => {
  const baseTabs: TabItem[] = [
    { route: "dashboard", label: "Accueil", icon: "home" },
    { route: "schedule", label: "Emploi du temps", icon: "calendar" },
    { route: "courses", label: "Cours", icon: "book" },
  ];

  return baseTabs;
};

const animateFocused = {
  0: { scale: 0.5, translateY: 7 },
  0.8: { translateY: -24 },
  1: { scale: 1.1, translateY: -14 },
};

const animateUnfocused = {
  0: { scale: 1.1, translateY: -14 },
  1: { scale: 1, translateY: 7 },
};

const circleExpand = {
  0: { scale: 0 },
  1: { scale: 1 },
};

const circleCollapse = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton: React.FC<{
  item: TabItem;
  onPress: () => void;
  accessibilityState: { selected: boolean };
}> = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const viewRef = useRef<Animatable.View & View>(null);
  const circleRef = useRef<Animatable.View & View>(null);
  const textRef = useRef<Animatable.Text & Text>(null);

  useEffect(() => {
    if (focused) {
      viewRef.current?.animate(animateFocused, 800);
      circleRef.current?.animate(circleExpand, 800);
      textRef.current?.transitionTo({ scale: 1, opacity: 1 }, 800);
    } else {
      viewRef.current?.animate(animateUnfocused, 800);
      circleRef.current?.animate(circleCollapse, 800);
      textRef.current?.transitionTo({ scale: 0, opacity: 0 }, 800);
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={800} style={styles.container}>
        <View
          style={[
            styles.btn,
            { backgroundColor: focused ? Colors.primary : Colors.white },
          ]}
        >
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Ionicons
            name={item.icon}
            size={24}
            color={focused ? Colors.white : Colors.primary}
          />
        </View>
        <Animatable.Text
          ref={textRef}
          style={[
            styles.text,
            { color: focused ? Colors.primary : Colors.black },
          ]}
        >
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const navigation = useRouter();
  const { user, isConnected } = useContext(AuthContext);
  const { logout } = useAuth();

  useEffect(() => {
    if (!isConnected) {
      navigation.replace("/");
    }
  }, [isConnected, navigation]);

  const path = usePathname();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMenuToggle = () => {
    if (isMenuVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleProfilePress = () => {
    setIsMenuVisible(false);
    navigation.navigate("/profile");
  };

  const handleLogoutPress = async () => {
    setIsMenuVisible(false);
    await logout();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        headerShown: true,
        headerStyle: {
          backgroundColor: "#f8f8f8",
        },
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("/");
            }}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="home" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Appbar.Action icon="cog" onPress={handleMenuToggle} />
            {isMenuVisible && (
              <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleProfilePress}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color={Colors.black}
                  />
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogoutPress}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={Colors.black}
                  />
                  <Text style={styles.menuText}>Déconnexion</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        ),
      }}
    >
      {TabArr(user).map((item, index) => (
        <Tabs.Screen
          key={index}
          name={item.route}
          options={{
            tabBarShowLabel: false,
            tabBarButton: (props) => <TabButton {...props} item={item} />,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  tabBar: {
    height: 70,
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    elevation: 5,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 25,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0,
  },
  headerRightContainer: {
    position: "relative",
    marginRight: 16,
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
});
