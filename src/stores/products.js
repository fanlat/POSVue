import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const useProductStore = defineStore('products',()=>{

    const db = useFirestore()
    const storage = useFirebaseStorage()

    const selectedCategory = ref(1) // Categoría seleccionada

    const categories = [
        {id:1, name: 'sudaderas'},
        {id:2, name: 'Tenis'},
        {id:3, name: 'lentes'},
    ]
    const q = query(
        collection(db, 'products'), // Referencia a la colección de productos
        //where('category', '==', 1), // Filtrar por categoría
        //limit(1), // Limitar la cantidad de documentos
        //orderBy('name', 'asc') // Ordenar por nombre de producto
    )
    const productsCollection = useCollection(q)
    async function createProduct(product){
        await addDoc(collection(db, 'products'), product) // Agregar un producto a la base de datos
    } 

    async function updateProduct(docRef, product) {
        const { image, url, ...values} = product
        if(image.length) {
            await updateDoc(docRef, {
                ...values,
                image: url.value
            })
        } else {
            await updateDoc(docRef, values)
        }
    }

    async function deleteProduct(id){
        if(confirm('¿eiminar este producto?')){
            // Eliminar un producto de la base de datos
            const docRef = doc(db, 'products', id) // Referencia al documento
            const docSnap = await getDoc(docRef) // Obtener el documento
            const {image} = docSnap.data() // Obtener la imagen del producto
            const imageRef = storageRef(storage, image) // Referencia a la imagen
            await Promise.all([
                deleteDoc(docRef), // Eliminar el documento
                deleteObject(imageRef) // Eliminar la imagen
            ])
        }
    }

    const categoryOptions = computed(()=>{
        const options = [
            {label: 'Selecciona una categoria', value: '', attrs:{disabled:true}},
            ...categories.map(category=>({
                label: category.name,
                value: category.id
            }))
        ]
        return options
    })

    const noResult = computed(()=>productsCollection.value.length === 0)


    const filterProducts = computed(()=>{
        return productsCollection.value
        .filter(product => product.category === selectedCategory.value)
        .filter(product => product.availability > 0)
    })

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        productsCollection,
        categories,
        selectedCategory,
        categoryOptions,
        noResult,
        filterProducts
    }
})