import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";

export const useCuponStore = defineStore('cupon',()=>{

    const cart = useCartStore() // Importamos el store del carrito
    const cuponIput = ref('') // Input del cupon
    const cuponValidationMessage = ref('') // Mensaje de validacion del cupon
    const discountPercentage = ref(0) // Porcentaje de descuento
    const discount = ref(0) // Descuento en dinero

    const VALID_CUPONS = [
        { name:'10DESCUENTO', discount:.10 },
        { name:'20DESCUENTO', discount:.20 },
        { name:'NEEDLES', discount:1 }
    ]

    watch(discountPercentage,()=>{
        discount.value = (cart.total * discountPercentage.value).toFixed(2)
    })

    function applyCupon(){
        if(VALID_CUPONS.some(cupon => cupon.name === cuponIput.value)){
            cuponValidationMessage.value = '...Aplicando cupon'
            setTimeout(()=>{
                discountPercentage.value = VALID_CUPONS.find(cupon => cupon.name === cuponIput.value).discount
                cuponValidationMessage.value = 'Cupon aplicado'
            },3000)
        }else{
            cuponValidationMessage.value = 'Cupon invalido'
        }

        setTimeout(()=>{
            cuponValidationMessage.value = ''
        },6000)
    }

    function $reset(){
        cuponIput.value = ''
        cuponValidationMessage.value = ''
        discountPercentage.value = 0
        discount.value = 0
    }

    const isValidCupon = computed(()=> discountPercentage.value > 0)
    
    return{
        cuponIput,
        discount,
        applyCupon,
        $reset,
        cuponValidationMessage,
        isValidCupon
    }
})