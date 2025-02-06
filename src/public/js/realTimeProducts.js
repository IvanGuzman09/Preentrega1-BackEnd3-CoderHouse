const socket = io();

console.log("In Client");

const enviar = document.getElementById("submit");

const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const statusb = document.getElementById("status");
const stock = document.getElementById("stock");
const category = document.getElementById("category");

// Mostrar productos
socket.on("allProducts", productsList => {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";
    productsList.forEach(product => {
        addProductToDOM(productsContainer, product);
    });
});

// Agregar producto a la lista
socket.on("productAdded", product => {
    const products = document.getElementById("products");
    products.innerHTML += `<li class="product">
    <p class="productTitle">${product.title}</p> <button class="deletePB" id="deleteP${product.id}">Eliminar</button>
    </li>`;
    const newButton = document.getElementById(`deleteP${product.id}`);
    newButton.addEventListener("click", async event => deleteProduct(newButton, event));
});

// Eliminar producto de la lista
socket.on("productDeleted", pid => {
    const deletedProduct = document.getElementById(`deleteP${pid}`).parentElement;
    deletedProduct.remove();
});

/**
 * Agrega los productos al DOM
 * @param {Array} product - Array de productos
 */
const addProductToDOM = (productsContainer, product) => {
    const productItem = document.createElement('li');
    productItem.classList.add('product');
    productItem.innerHTML = `
    <p class="productTitle">${product.title}</p> 
    <button class="deletePB" id="deleteP${product.id}">Eliminar</button>
    `;
    productsContainer.appendChild(productItem);
    
    const newButton = document.getElementById(`deleteP${product._id}`);
    newButton.addEventListener("click", async event => deleteProduct(newButton, event));
}


// FIXME:
const addProduct = async event => {
    
    try {
        if (!title.value || !description.value || !code.value || !price.value || !statusb.value || !stock.value || !category.value) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        
        const newProduct = {
            title: title.value,
            description: description.value,
            code: code.value,
            price: price.value,
            status: (statusb.value === "available"),
            stock: stock.value,
            category: category.value,
        };
        
        event.preventDefault();
        
        const result = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });
        
        if (result.status === 200) {
            socket.emit("addProduct", newProduct);
        } else if (result.status === 400) {
            alert("Ya existe un producto con ese codigo")
            throw new Error("Ya existe un producto con ese codigo");
        }
        
        title.value = "";
        description.value = "";
        code.value = "";
        price.value = "";
        statusb.value = "";
        stock.value = "";
        category.value = "";
        
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al intentar añadir el producto");
    }
};

enviar.addEventListener("click", async event => addProduct(event));

const deleteButtons = document.getElementsByClassName("deletePB");

/**
 * Aplica la funcion de eliminar el elemento respectivo al presionar el boton
 * @param {Object} button - El boton al que se quiere aplicar la propiedad
 * @param {Object} event - Evento
*/
const deleteProduct = async (button, event) => {
    console.log("intento");
    try {
        event.preventDefault();
        const pid = button.id.replace("deleteP", "");
        const URL = "api/products/" + pid;
        const response = await fetch(URL, {
            method: "DELETE",
        });
        if (response.status === 200) {
            socket.emit("deleteProduct", pid);
        } else { 
            throw new Error("No se pudo eliminar el producto");
        }
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al intentar eliminar el producto");
    }
};

console.log(deleteButtons);

for (const button of deleteButtons) {
    button[1].addEventListener("click", async event => deleteProduct(button[1], event));
}
