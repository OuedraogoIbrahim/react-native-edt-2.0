import { StyleSheet, Pressable, View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

export const SkeletonPage = () => {
  return (
    <Pressable style={styles.container}>
      <MotiView
        transition={{
          type: "timing",
        }}
        style={[styles.container, styles.padded]}
        // animate={{ backgroundColor: "#ffffff" }}
      >
        <Spacer />
        <Skeleton colorMode="light" width={250} />
        <Spacer height={8} />
        <Skeleton colorMode="light" width={"100%"} />
        <Spacer height={8} />
        <Skeleton colorMode="light" width={"100%"} />
      </MotiView>
    </Pressable>
  );
};

const Spacer = ({ height = 16 }) => <View style={{ height }} />;

const styles = StyleSheet.create({
  shape: {
    justifyContent: "center",
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  padded: {
    padding: 16,
  },
});
