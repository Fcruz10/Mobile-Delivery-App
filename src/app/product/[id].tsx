import { Image, ScrollView, Text, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import { Redirect } from "expo-router";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { useCartStore } from "@/stores/car-stores";

import { PRODUCTS } from "@/utils/data/products";
import { formatCurrency } from "@/utils/functions/format-currency";

import { Button } from "@/components/button";
import { LinkButton } from "@/components/link-button";

export default function Product() {
    const cardStore = useCartStore()
    const navigation = useNavigation()
    const { id } = useLocalSearchParams()

    const product = PRODUCTS.find((item) => item.id === id)

    function handleAddToCart() {
        if(product) {
            cardStore.add(product!)   
            navigation.goBack()
        }
    }

    if(!product) {
        return <Redirect href='/' />
    }

    return (
        <View className="flex-1">
            <Image 
                source={ product.cover }
                className="w-full h-52"
                resizeMode="cover"
            />

            <View className="p-5 mt-8 flex-1">
                <Text className="text-white text-xl font-heading" >{ product.title }</Text>
                
                <Text className="text-lime-400 text-2xl font-heading my-2">
                    { formatCurrency(product.price) }
                </Text>

                <Text className="text-slate-400 font-body text-base leading-6 mb-4">
                    { product.description }
                </Text>

                <ScrollView>
                    { product.ingredients.map((ingredient) => (
                        <Text 
                            key={ingredient}
                            className="text-stone-400 font-body text-base leading-6"
                        >
                            {"\u2022"} {ingredient}
                        </Text>
                    ))}
                </ScrollView>
            </View>
            <View className="p-5 pb-8 gap-5">
                <Button onPress={ handleAddToCart }>
                    <Button.Icon>
                        <Feather name="plus-circle" size={20} />
                    </Button.Icon>

                    <Button.Text>Add to the order</Button.Text>
                </Button>
                
                <LinkButton title="Return to menu" href="/" />
            </View>
        </View>
    )
}