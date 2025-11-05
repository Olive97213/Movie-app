import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { updateSearchCount } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

const search = () => {
  // Stocke la valeur tapée dans la barre de recherche
  const [searchQuery, setSearchQuery] = useState('');

  // Hook personnalisé pour appeler l’API
  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies, // recharge les données
    reset, // réinitialise les résultats
  } = useFetch(
    () =>
      fetchMovies({
        query: searchQuery, // envoie la vraie valeur de recherche
      }),
    false // false = ne pas fetch automatiquement au début
  );

  // Attendre 500ms avant de lancer la recherche (anti spam)
  // Déclenche la recherche
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
        if (movies?.lenght > 0 && movies?.[0])
          await updateSearchCount(searchQuery, movies[0]);
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Déclenche la mise à jour Appwrite UNIQUEMENT quand les films sont là
  useEffect(() => {
    if (searchQuery.trim() && movies && movies.length > 0) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      {/* Fond d'écran */}
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Liste des films affichée sous forme de grille */}
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        // Contenu affiché au-dessus de la liste (logo + barre de recherche + messages)
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Barre de recherche */}
            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {/* Loader pendant le chargement */}
            {loading && (
              <ActivityIndicator size="large" color="0000ff" className="my-3" />
            )}

            {/* Message d’erreur */}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {/* Titre seulement si on a des résultats */}
            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for{' '}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        // Message affiché quand aucun film trouvé
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default search;
