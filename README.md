# 📸 PhotoApp Justin Imbaquingo
## Gestión de Fotos con Ubicación Integrada


---

# Pasos integrados:

## Usamos la plantilla de la aplicación de fotos y la vamos adaptando poco a poco con ayuda del repositorio proporcionado por el Ingeniero.

---

<img width="1299" height="706" alt="image" src="https://github.com/user-attachments/assets/4540858f-829c-4bca-867a-3af02f2f7c43" />
<img width="1407" height="722" alt="image" src="https://github.com/user-attachments/assets/609b1fe0-7e54-4fcd-90d4-9a3551fd4030" />

---

## Primero, modificamos los íconos que mostrarán las diferentes secciones de nuestro proyecto.

---

<img width="479" height="96" alt="image" src="https://github.com/user-attachments/assets/1626ab33-627e-45ae-b541-ead222be7eac" />

---

## Luego comenzamos con el código. Para esto, debemos tener instalados @capacitor/filesystem y @capacitor/geolocation.

---

<img width="887" height="38" alt="image" src="https://github.com/user-attachments/assets/53d426bf-ea99-4cad-a527-f34c7219cff2" />

---

## Con esto listo, vamos a modificar nuestra página de inicio, que será la encargada de mostrar información relevante de nuestra aplicación.

---

<img width="656" height="177" alt="image" src="https://github.com/user-attachments/assets/35505bd1-e366-475d-8924-bb67592a270e" />
<img width="1844" height="919" alt="image" src="https://github.com/user-attachments/assets/488130b0-723e-4546-881e-d0e671aaed8c" />
<img width="1909" height="840" alt="image" src="https://github.com/user-attachments/assets/095de3d5-5a37-4b5e-8a6e-c78f4f331c43" />

---

## Ahora vamos a pasar a la seccion de Photo, Esta página permite tomar fotos, mostrar su previsualización, registrar ubicación automática y guardarla opcionalmente en un archivo TXT.

---

<img width="1473" height="838" alt="image" src="https://github.com/user-attachments/assets/350d5611-48ff-4cdf-86b5-ade8d8d4adbd" />
<img width="621" height="903" alt="image" src="https://github.com/user-attachments/assets/b4430077-528a-411d-935c-009c6015255a" />

---

## Esta clase permite tomar fotos desde la cámara, obtener la ubicación automática del usuario y mostrar una previsualización. Luego, guarda la imagen junto con la información de ubicación y un enlace a Google Maps usando PhotoService. También limpia los campos y permite navegar a la galería tras guardar la foto.

---

<img width="1673" height="944" alt="image" src="https://github.com/user-attachments/assets/a03dae69-1f30-4b9b-82bb-798cffdbf814" />

---

## Esta página muestra la galería de fotos guardadas, incluyendo imagen, descripción, fecha y ubicación. Permite ver la ubicación en Google Maps y eliminar fotos de forma interactiva.

---

<img width="1537" height="818" alt="image" src="https://github.com/user-attachments/assets/f3107b14-02bc-432d-ab9b-28c759142193" />
<img width="945" height="899" alt="image" src="https://github.com/user-attachments/assets/a0fd6cca-7191-43da-a99d-abcee548fa4f" />

---

## Esta clase gestiona la pestaña de registro de gastos con fotos. Permite tomar fotos desde la cámara, mostrar una previsualización y completar un formulario con descripción, monto y pagador. Los datos se guardan mediante PhotoService, que también permite importar gastos desde un archivo .txt y eliminar fotos existentes. La clase sincroniza la galería con cambios en tiempo real y limpia los campos del formulario después de cada registro, asegurando una experiencia práctica y organizada.

---

<img width="1846" height="933" alt="image" src="https://github.com/user-attachments/assets/0c339ba3-40cc-492d-a2bd-5aa7b31a04c5" />


