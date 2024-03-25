import { useState } from "react";
import { Text, View, ScrollView, Alert, Linking } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ProductCardProps, useCartStore } from "@/stores/car-stores";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Product } from "@/components/product";
import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";

const PHONE_NMUBER = "351"

export default function Cart() {
    const [address, setAddress] = useState('')
    const cartStore = useCartStore()
    const navigation = useNavigation()

    const total = formatCurrency(
        cartStore.products.reduce(
            ( total, product ) => total + product.price * product.quantity, 0
        )
    )

    function handleProductRemove(product: ProductCardProps) {
        Alert.alert('Remove', `Do you wish to delete ${product.title} from the order?`, [
            {
                text: 'Cancel',
            },
            {
                text: ' Remove',
                onPress: () => cartStore.remove(product.id),
            }
        ])
    }

    function handleOrder() {
        if (address.trim().length === 0) {
            return Alert.alert('Order', 'Insert your delivery information')
        }

        const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join('')

        const message = `
            \n🍴 NEW ORDER
            \n Deliver in: ${address}

            ${products}

            \n Total: ${total}
        `
        Linking.openURL(`http://api.whatsapp.com/send?phone=${PHONE_NMUBER}&text=${message}`)

        cartStore.clear()
        navigation.goBack()
    }
    
    return (
        <View className="flex-1 pt-8">
            <Header title="Your cart" />

            <KeyboardAwareScrollView>
                <ScrollView>
                    <View className="p-5 flex-1" >
                        { cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {cartStore.products.map((product) => (
                                        <Product 
                                            key={product.id}
                                            data={product}
                                            onPress={ () => handleProductRemove(product) }
                                        />
                                    ))
                                }
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center my-8">
                                Your cart is empty.
                            </Text>
                        )}

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">Total:</Text>

                            <Text className="text-lime-400 text-2xl font-heading">
                                { total }
                            </Text>

                        </View>

                        <Input 
                            placeholder="Add the address for the delivery" 
                            onChangeText={ setAddress }
                            blurOnSubmit
                            onSubmitEditing={ handleOrder }
                            returnKeyType="next"
                        />

                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View className="p-5  gap-5">
                <Button onPress={ handleOrder }>
                    <Button.Text>Send order</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>

                <LinkButton title="Return to menu" href="/" />
            </View>
        </View>
    )
}