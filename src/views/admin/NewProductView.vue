<script setup>
    import {reactive} from 'vue' 
    import { useRouter } from 'vue-router';
    import Link from '@/components/Link.vue';
    import useImage from '@/composables/useImage';
    import { useProductStore } from '@/stores/products'

    const { url, onFileChange, isImageUploaded } = useImage();
    const products = useProductStore()
    const router = useRouter()
    const formData = reactive({
        name:'',
        category:'',
        price:'',
        availability:'',
        image:''

    })
    const submitHandler = async data =>{ // data es el objeto que se envia al hacer submit
        const {image, ...values } = data // separamos la imagen del resto de los valores
        
        try {
            await products.createProduct({ // llamamos a la funcion createProduct del store
                ...values, // pasamos los valores
                image: url.value // pasamos la url de la imagen
            })
            router.push({name: 'products'}) // redirigimos a la vista de productos
        } catch (error) {
            console.log(error)
        }
    }

</script>
<template>
    <div>
        <Link
            to="products"
        >Volver</Link>
        <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>
        <div class="flex justify-center bg-white shadow">
            <div class="mt-10 p-10 w-full 2xl:w-2/4">
                <FormKit
                    type="form"
                    submit-label="Agregar Producto"
                    incomplete-message="no se pudeo enviar. Por favor revisa los campos"
                    @submit="submitHandler"
                    value="formData"
                >
                    <FormKit 
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre del producto"
                        validation="required"
                        :validation-messages="{ required: 'El nombre del producto es obligatorio' }"
                        v-model.trim="formData.name" 
                    /> <!-- trim sirve para eliminar los espacios en blanco -->
                    <FormKit 
                        type="file"
                        label="Imagen Producto"
                        name="image"
                        validation="required"
                        :validation-messages="{ required: 'la iomagen del producto es obligatoria' }"
                        accept=".jpg"
                        @change="onFileChange"
                        v-model.trim="formData.image"
                    />
                    <dir v-if="isImageUploaded">
                        <p class="font-black">Imagen Producto:</p>
                        <img :src="url" alt="Nueva Imagen del producto" class="w-32"
                    </dir>
                    <FormKit 
                        type="select"
                        label="Categoria"
                        name="category"
                        validation="required"
                        :validation-messages="{ required: 'la categoría es obligatoria' }"
                        :options="products.categoryOptions"
                        v-model.number="formData.category"
                    />
                    <FormKit 
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio del producto"
                        validation="required"
                        :validation-messages="{ required: 'El precio del producto es obligatorio' }"
                        min="1"
                        v-model.number="formData.price"
                        />
                    <FormKit 
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Cantidad disponible"
                        validation="required"
                        :validation-messages="{ required: 'La cantidad es obligatorio' }"
                        min="1"
                        v-model.number="formData.availability"
                    />

                </FormKit>
            </div>
        </div>
    </div>
</template>