import { ref, computed } from "vue";
import { uid } from "uid";
import { useFirebaseStorage } from "vuefire";
import { ref as storageRef, uploadBytesResumable,  getDownloadURL } from "firebase/storage";

export default function useImage(){
    const url = ref('');
    const storage = useFirebaseStorage()
    const onFileChange = e =>{
        const file = e.target.files[0]; //obtiene el archivo
        const filename = uid() + '.jpg'; //nombre del archivo
        const sRef = storageRef(storage, '/products/' + filename); //referencia al archivo

        //sube el archivo
        const uploadTask = uploadBytesResumable(sRef, file);

        uploadTask.on('state_changed',
            () => {},
            (error)=>{console.error(error)},
            ()=>{
                //la imagen ya se subio
                getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    url.value=downloadURL
                })
            }
        )
    }

    const isImageUploaded = computed(() =>{ 
        return url.value ? url.value : null
    });
    
    return{
        url,
        onFileChange,
        isImageUploaded
    }
}