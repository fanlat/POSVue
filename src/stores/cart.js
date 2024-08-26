import { ref, computed, watchEffect } from "vue";
import { useCuponStore } from "./cupons";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore"; // runTransaction para transacciones
import { useFirestore } from "vuefire";
import { defineStore } from "pinia";
import { getCurrentDate } from "@/helpers";


export const useCartStore = defineStore('cart', ()=>{

    const cupon = useCuponStore() // Importamos el store del cupon
    const db = useFirestore() // Importamos la instancia de firestore
    const items = ref([])
    const subtotal = ref(0)
    const taxes = ref(0)
    const total = ref(0)

    const MAX_PRODUCTS = 5
    const TAX_RATE = .10
    
    // Primer metodo con watch
    // watch(items, () =>{
    //     subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0 )// calculate subtotal
    //     taxes.value = subtotal.value * TAX_RATE // Calculate taxes
    //     total.value = subtotal.value + taxes.value // Calculate Total
    // },{
    //     deep:true // watch nested properties
    // })

    // con watchEffect es mas corto
    watchEffect(()=>{
        subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0 )// calculate subtotal
        taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2)) // Calculate taxes con toFixed para redondear y con number para convertir a numero
        total.value = Number(((subtotal.value + taxes.value) - cupon.discount).toFixed(2)) // Calculate Total
    })
    
    function addItem(item){
        const index =  isItemInCart(item.id)
        if(index >= 0){
            if(isProductAvalible(item, index)){ // check if product is avalible
                alert('has alcanzado el limite') // show alert
                return
            }
            items.value[index].quantity++ // increment quantity
        }else{
            items.value.push({...item, quantity: 1, id: item.id})
        }
    }

    function updateQuantity(id, quantity){
        items.value = items.value.map( item => item.id === id ? {...item, quantity} : item ) // update quantity    
    }

    function removeItem(id){
        items.value = items.value.filter( item => item.id !== id) // remove item
    }  
    
    async function checkout(){
        try{
            await addDoc(collection(db,'sales'),{
                
                items: items.value.map(item=>{ // map items 
                    const{availability,category,...data} = item // destructuring sacamos availability y category
                    return data // return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                discount: cupon.discount,
                total: total.value,
                date: getCurrentDate()
            })
            //sustraer la cantidad de lo disponible
            items.value.forEach(async(item)=>{
                const productRef = doc(db, 'products', item.id) // get product reference
                await runTransaction(db,async(transaction)=>{
                    const currentProduct = await transaction.get(productRef) // get product data
                    const availability = currentProduct.data().availability - item.quantity // calculate new availability
                    transaction.update(productRef, {availability}) // update availability
                })
            })

            //reiniciar el state
            $reset()
            cupon.$reset()
        }catch(e){
            console.error(e)
        }
    }

    function $reset(){
            items.value = []
            subtotal.value = 0
            taxes.value = 0
            total.value = 0
    }

    const isItemInCart = id => items.value.findIndex( item => item.id === id) // find index of item
    const isProductAvalible = (item, index) => {
        return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAX_PRODUCTS
    }

    const isEmpty = computed(()=>items.value.length === 0)
    

    const chekProductAvailability = computed(()=>{
        return (product) => product.availability < 5 ? product.availability : MAX_PRODUCTS
    })

    return{
        items,
        subtotal,
        taxes,
        total,
        addItem,
        updateQuantity,
        removeItem,
        checkout,
        isEmpty,
        chekProductAvailability
    }
})