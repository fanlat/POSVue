<script setup>
      import { watch, reactive } from 'vue'
      import { useRoute, useRouter  } from 'vue-router'
      import {  doc  } from 'firebase/firestore'
      import { useFirestore, useDocument } from 'vuefire'
      import Link from '@/components/Link.vue';
      import { useProductStore } from '@/stores/products';
      import useImage from '@/composables/useImage'

      //consultar Firestore

      const route = useRoute() // obtenemos la ruta actual
      const router = useRouter() // obtenemos el router
      const db = useFirestore() // obtenemos la instancia de Firestore
      const docRef = doc(db, 'products', route.params.id) // creamos una referencia al documento de Firestore
      const product = useDocument(docRef) // obtenemos el documento de Firestore

      const { onFileChange,  url, isImageUploaded } = useImage()
      const products = useProductStore()


      const formData = reactive({
          name: '',
          category: '',
          price: '',
          availability: '',
          image: ''
      })

      watch(product,(product)=>{ // observamos el producto
        if(!product) { // si no hay producto
            router.push({name: 'products'}) // redirigimos a la vista de productos
        }
        Object.assign((formData), product) // asignamos los valores del producto al formData
      })

      const submitHandler = async data => { // data es el objeto que se envia al hacer submit
          const { image, ...values } = data // separamos la imagen del resto de los valores
          try {
              await products.updateProduct(docRef,{...data, url}) // llamamos a la funcion updateProduct del store actualizando el producto
              router.push({ name: 'products' }) // redirigimos a la vista de productos
          } catch (error) {
              console.log(error)
          }
      }

</script>

<template>
    <div class="mt-10">
        <Link
            to="products"
        >
            Volver
        </Link>
            <h1 class="text-4xl my-10 font-extrabold">Editar Producto</h1>

            <div class="flex justify-center bg-white shadow">
            <div class="mx-auto mt-10 p-10 w-full  2xl:w-2/4">
              
                <FormKit
                    type="form"
                    :value="formData"
                    submit-label="Guardar Cambios"
                    incomplete-message="No se pudo enviar, revisa los mensajes"
                    @submit="submitHandler"
                    :actions="false"
                >
                    <FormKit 
                        type="text"
                        label="Nombre"
                        name="name"
                        placeholder="Nombre de Producto"
                        validation="required"
                        v-model.trim="formData.name"
                        :validation-messages="{ required: 'El Nombre del Producto es Obligatorio' }"
                    />

                    <FormKit 
                        type="select"
                        label="Categoría"
                        name="category"
                        validation="required"
                        v-model.number="formData.category"
                        :validation-messages="{ required: 'La Categoría es Obligatoria' }"
                        :options="products.categoryOptions"
                    />

                    <FormKit
                        type="number"
                        label="Precio"
                        name="price"
                        placeholder="Precio de Producto"
                        step="1"
                        min="1"
                        v-model.number="formData.price"
                    />

                    <FormKit
                        type="number"
                        label="Disponibles"
                        name="availability"
                        placeholder="Productos Disponibles"
                        v-model.number="formData.availability"
                        step="1"
                        min="0"
                    />

                    <div v-if="isImageUploaded">
                        <p class="font-black">Imagen Nueva:</p>
                        <img    
                          :src="url"
                          alt="Nueva imagen Producto" 
                          class="w-52"
                        />  
                    </div>

                    <div v-else>
                        <p class="font-black">Imagen Actual:</p>
                        <img  
                          :src="formData.image"
                          :alt="'Imagen de' + formData.image" 
                          class="w-52"
                        />  
                    </div>
                    

                    <FormKit
                        type="file"
                        label="Cambiar Imagen"
                        name="image"
                        multiple="false"
                        accept=".jpg"
                        @change="onFileChange"
                    />


                    <FormKit
                        type="submit"
                    >Guardar Cambios</FormKit>

                </FormKit>
            </div>
        </div>
        </div>
</template>
