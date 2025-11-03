// ✅ Configuration centralisée pour appeler l’API TMDB (TheMovieDB)
export const TMDB_CONFIG = {
  // URL de base de l’API
  BASE_URL: 'https://api.themoviedb.org/3',

  // ✅ Clé d’API récupérée depuis les variables d’environnement Expo
  // On évite de la stocker en clair dans le code pour plus de sécurité
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,

  // ✅ En-têtes envoyés à chaque requête
  headers: {
    accept: 'application/json', // on demande du JSON
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`, // Authentification sécurisée via token Bearer
  },
};

// ✅ Fonction qui appelle l’API TMDB pour récupérer des films
// Elle prend un objet contenant `query` (le texte recherché)
export const fetchMovies = async ({ query }: { query: string }) => {
  // ✅ On prépare l’URL de l’API selon si l’utilisateur cherche un film ou non

  // 🔹 Si query contient du texte ⇒ alors on fait une recherche
  // encodeURIComponent permet d’éviter les bugs si le texte contient des espaces ou caractères spéciaux
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : // 🔹 Sinon ⇒ on prend les films les plus populaires
      `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  // ✅ Appel HTTP à l’API
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers, // headers définis plus haut
  });

  // ✅ Gestion des erreurs HTTP
  if (!response.ok) {
    // Si la requête échoue (exemple : mauvaise clé API, réseau down...)
    throw new Error(`Failed to fetch movies | Status: ${response.status}`);
  }

  // ✅ On convertit la réponse (JSON → objet JS)
  const data = await response.json();

  // ✅ On retourne uniquement la liste de films
  return data.results;
};
