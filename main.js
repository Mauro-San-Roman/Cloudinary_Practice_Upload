
const CLOUD_NAME = "dbkqbazp7";
const PRESET = "present5C";

const imagen = document.getElementById('imagen');
const inputF = document.getElementById('fileInput');
const btnUpload = document.getElementById('btnUpload');

//VISTA PREVIA
inputF.addEventListener('change', () => {
    const archivo = inputF.files[0];
    if (archivo) {
        // Validación básica de tipo de archivo
        if (!archivo.type.startsWith('image/')) {
            alert("Por favor, selecciona solo archivos de imagen.");
            inputF.value = "";
            return;
        }
        const urlTemporal = URL.createObjectURL(archivo);
        imagen.src = urlTemporal;
        imagen.style.display = "block";
    }
});

const galeria = document.getElementById('galeria');
const sinImagenes = document.getElementById('sin-imagenes');

const subirImg = () => {
    const foto = inputF.files[0];
    if (!foto) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    btnUpload.disabled = true;
    btnUpload.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Subiendo...`;

    const formData = new FormData(); 
    formData.append("file", foto);
    formData.append("upload_preset", PRESET);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(async respuesta => {
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.error.message || "Error en la subida");
        }
        return respuesta.json();
    })
    .then(data => {

        if (sinImagenes) sinImagenes.style.display = 'none';

        const nuevaImagenCol = document.createElement('div');
        nuevaImagenCol.className = 'col-4 col-md-3';
        nuevaImagenCol.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${data.secure_url}" class="card-img-top rounded shadow-sm" style="object-fit: cover; height: 100px;" alt="Subida">
                <div class="card-body p-1 text-center">
                    <a href="${data.secure_url}" target="_blank" class="btn btn-sm btn-link p-0" style="font-size: 0.7rem;">Ver original</a>
                </div>
            </div>
        `;
        galeria.appendChild(nuevaImagenCol);

        imagen.src = "";
        imagen.style.display = "none";
        inputF.value = "";
        
        const placeholder = document.getElementById('placeholder-text');
        if(placeholder) placeholder.style.display = "block";

        alert("¡Imagen guardada en la galería!");
    })
    .catch(err => {
        alert("Fallo la subida: " + err.message);
    })
    .finally(() => {
        btnUpload.disabled = false;
        btnUpload.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-2"></i> Subir a Cloudinary`;
    });
};

btnUpload.addEventListener('click', subirImg);
