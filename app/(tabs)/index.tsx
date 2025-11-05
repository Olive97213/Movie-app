import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import TrendingCard from '@/components/TrendingCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { getTrendingMovies } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import { useRouter } from 'expo-router';

import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function Index() {
  // ✅ Permet de naviguer vers d'autres écrans via expo-router
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // ✅ On appelle "useFetch" en lui passant une fonction fetchMovies
  // Ici, query: '' signifie qu'on récupère des films sans filtre particulier
  const {
    data: movies, // les données récupérées (liste de films)
    loading: moviesLoading, // true quand la requête est en cours
    error: moviesError, // contient une erreur si la requête échoue
  } = useFetch(() =>
    fetchMovies({
      query: '', // paramètre de recherche
    })
  );

  return (
    <View className="flex-1 bg-primary">
      {/* ✅ Image d’arrière-plan */}
      <Image source={images.bg} className="absolute w-full z-0" />

      {/* ✅ ScrollView permet de scroller la page si le contenu dépasse */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 10 }}
      >
        {/* ✅ Logo centré */}
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {/* ✅ 3 cas possibles :
              1️⃣ En cours de chargement → on montre un loader
              2️⃣ Une erreur est détectée → affichage du message d’erreur
              3️⃣ Sinon → on affiche le contenu normal
        */}
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {/* ✅ Barre de recherche : si on clique, on va à la page /search */}
            <SearchBar
              onPress={() => router.push('/search')}
              placeholder="Search for a movie"
            />
            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
              </View>
            )}
            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                className="mb-4 mt-3"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
              />
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: 'flex-start',
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
