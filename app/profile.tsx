import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { AuthContext } from "@/context/AuthContext";

// Typage pour les données
interface Matiere {
  nom: string;
  niveau: {
    nom: string;
    filiere: {
      nom: string;
    };
  };
}

interface Enseignant {
  matieres: Matiere[];
}

interface Etudiant {
  filiere?: {
    nom: string;
  };
  niveau?: {
    nom: string;
  };
}

interface Personne {
  prenom: string;
  nom: string;
  date_naissance: string;
  sexe: "M" | "F";
  tel: string;
  role: "enseignant" | "etudiant" | "delegue";
  enseignant?: Enseignant;
  etudiant?: Etudiant;
}

interface User {
  email: string;
  provider?: string;
  personne: Personne;
}

interface AuthContextType {
  user: User | null; // Allow null to handle unauthenticated state
}

export default function ProfileScreen() {
  const authContext = useContext(AuthContext);

  // Handle case where context is undefined
  if (!authContext) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erreur : Contexte d'authentification non disponible
        </Text>
      </View>
    );
  }

  const { user } = authContext;
  console.log(user);

  // Handle case where user is null or undefined
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b7bec" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  const fullName = `${user.personne.prenom} ${user.personne.nom}`;
  const email = user.email;
  const dateNaissance = user.personne.date_naissance;
  const sexe = user.personne.sexe === "M" ? "Masculin" : "Féminin";
  const tel = user.personne.tel;
  const provider = user.provider;

  // Check if a social provider exists
  const hasProvider =
    provider &&
    ["google", "facebook", "github"].includes(provider.toLowerCase());
  const providerText = hasProvider
    ? `Connecté via ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
    : "Aucun réseau social connecté";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <Image
          style={styles.coverImage}
          source={{ uri: "https://picsum.photos/500/500?random=211" }}
        />
        <View style={styles.profileContainer}>
          {/* Profile Image */}
          <View style={styles.profileImageView}>
            <Image
              style={styles.profileImage}
              source={{
                uri: "https://randomuser.me/api/portraits/men/46.jpg",
              }}
            />
          </View>
          {/* Profile Details */}
          <View style={styles.nameAndBioView}>
            <Text style={styles.userFullName}>{fullName}</Text>
            <Text style={styles.userBio}>
              {user.personne.role.charAt(0).toUpperCase() +
                user.personne.role.slice(1)}
            </Text>
          </View>
          {/* Personal Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="mail" size={20} color="#4b7bec" />
                <Text style={styles.infoText}>Email: {email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#4b7bec" />
                <Text style={styles.infoText}>Téléphone: {tel}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="calendar" size={20} color="#4b7bec" />
                <Text style={styles.infoText}>
                  Date de naissance: {dateNaissance}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="user" size={20} color="#4b7bec" />
                <Text style={styles.infoText}>Sexe: {sexe}</Text>
              </View>
            </View>
          </View>
          {/* Academic Info */}
          <View style={styles.infoSection}>
            {user.personne.role === "enseignant" ? (
              <>
                <Text style={styles.sectionTitle}>Matières enseignées</Text>
                <View style={styles.matieresContainer}>
                  {user.personne.enseignant?.matieres.length > 0 ? (
                    user.personne.enseignant.matieres.map(
                      (matiere: Matiere, index: number) => (
                        <View style={styles.matiereCard} key={index}>
                          <View style={styles.matiereIcon}>
                            <Icon name="book" size={20} color="#4b7bec" />
                          </View>
                          <View style={styles.matiereDetails}>
                            <Text style={styles.matiereName}>
                              {matiere.nom}
                            </Text>
                            <Text style={styles.matiereSubText}>
                              Niveau: {matiere.niveau.nom}
                            </Text>
                            <Text style={styles.matiereSubText}>
                              Filière: {matiere.niveau.filiere.nom}
                            </Text>
                          </View>
                        </View>
                      )
                    )
                  ) : (
                    <Text style={styles.noMatieresText}>
                      Aucune matière assignée
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>
                  Informations académiques
                </Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Icon name="book" size={20} color="#4b7bec" />
                    <Text style={styles.infoText}>
                      Filière: {user.personne.etudiant?.filiere?.nom || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Icon name="award" size={20} color="#4b7bec" />
                    <Text style={styles.infoText}>
                      Niveau: {user.personne.etudiant?.niveau?.nom || "N/A"}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          {/* Social Media Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Réseaux Sociaux</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="link" size={20} color="#4b7bec" />
                <Text style={styles.infoText}>{providerText}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => {
                console.log(
                  hasProvider
                    ? "Changer le provider"
                    : "Connecter un réseau social"
                );
              }}
            >
              <Text style={styles.socialButtonText}>
                {hasProvider
                  ? "Changer le réseau social"
                  : "Connecter un réseau social"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  coverImage: {
    height: 220,
    width: "100%",
    resizeMode: "cover",
  },
  profileContainer: {
    marginTop: -60,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileImageView: {
    alignItems: "center",
    marginTop: -50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameAndBioView: {
    alignItems: "center",
    marginTop: 16,
  },
  userFullName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
  },
  userBio: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  infoSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  matieresContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
  },
  matiereCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  matiereIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6edff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  matiereDetails: {
    flex: 1,
  },
  matiereName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  matiereSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  noMatieresText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingVertical: 12,
  },
  socialButton: {
    backgroundColor: "#4b7bec",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
