// track the searches made by a user
import { Client, Databases, ID, Query } from 'appwrite';

// ✅ On force les variables d'environnement en string
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID as string;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string;

// ✅ CORRECTION : mettre tout sur la même chaîne sans point-virgule entre
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const database = new Databases(client);

// ✅ Déclare le type Movie si tu veux éviter une erreur TS
type Movie = {
  id: number;
  title: string;
  poster_path?: string;
};

// ✅ Fonction pour mettre à jour l'historique de recherche
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
