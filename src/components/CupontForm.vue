<script setup>
    import { useCuponStore } from '@/stores/cupons';

    const store = useCuponStore();
</script>
<template>
    <p class="mt-5 font-bold border-t border-gray-200">¿Tienes un Cupón?</p>
    <div class="flex">
        <input 
            type="text"
            placeholder="Ingresa tu cupón"
            class="p-2 bg-white border-gray-300 w-full disabled:opacity-30"
            v-model="store.cuponIput"
            :disabled="store.isValidCupon"
        />
        <button
            type="button"
            class="p-3 bg-green-400 font-bold disabled:opacity-30"
            @click="store.applyCupon"
            :disabled="store.isValidCupon"
        >
            Aplicar
        </button>
    </div>

    <p v-if="store.cuponValidationMessage" class="py-2 text-center text-sm font-extrabold">{{ store.cuponValidationMessage }}</p>
</template>