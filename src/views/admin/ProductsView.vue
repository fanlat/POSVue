<script setup>
    import Link from '@/components/Link.vue';
    import Product from '@/components/Product.vue';
    import { useProductStore } from '@/stores/products'
    const products = useProductStore()
</script>
<template>
    <div>
        <Link
            to="new-product"
        >Nuevo Producto</Link>
        <h1 class="text-4xl font-black my-10">Productos</h1>
        <p
            v-if="products.noResult" 
            class="text-center text-gray-500"
        > No hay resultados
        </p>
        <ul
            v-else
            role="list"
            class="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
            <Product
                v-for="product in products.productsCollection"
                :key="product.id"
                :product="product"
            />
        </ul>
    </div>
</template>