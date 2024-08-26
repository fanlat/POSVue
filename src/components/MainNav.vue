<script setup>
    import { useProductStore } from '@/stores/products';
    import Link from './Link.vue';
    import Logo from './Logo.vue';

    const products = useProductStore();
</script>

<template>
    <header class="px-10 py-5 bg-gray-700 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between absolute top-0 w-full z-10">
        <Logo />
        <div
            class="flex gap-5 text-white"
        >
            <h2 class="text-lg font-extrabold"> Filtros:</h2>
            <div
                class="flex gap-2 items-center"
                v-for="category in products.categories"
                :key="category.id"
            >
                <input 
                    type="radio" 
                    name="category" 
                    :value="category.id" 
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    :checked="products.selectedCategory === category.id"
                    @change="products.selectedCategory = +$event.target.value" 
                >
                <!-- el $event.target.value es el valor del input -->
                <label for="" class="text-gray-100">{{category.name}}</label>
            </div>
        </div>
        <nav>
            <Link
                to="sales"
            >Administrador</Link>
        </nav>
    </header>
</template>