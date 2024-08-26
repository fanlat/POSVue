import { generateClasses } from "@formkit/themes"; // importamos la función que genera las clases de tailwindcss
const config = {
    config:{
        classes: generateClasses({
            global:{
                label:'block mb-1 font-bold text-lg',
                message:'text-red-500 mb-5',
                wrapper:'space-y-2 mb-3',
                input:'w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
            },
            file:{
               noFile:'block my-2',
               fileItem:'hidden'
            },
            submit:{
                input:'$reset bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full uppercase disabled:opacity-50 disabled:cursor-not-allowed'
            }
            
        }), // generamos las clases de tailwindcss
    }
}

export default config;