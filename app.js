//declaring variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const catItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//cart 
let cart = [];
//buttons
let buttonsDOM = [];

//const productsFromAli = fetch().then().catch();

//getting  the products class
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();

      let products = data.items;
      products = products.map(item => {
        const {
          title,
          price
        } = item.fields;
        const {
          id
        } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          price,
          id,
          image
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products class
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product, index) => {
      result += `
            <!-- single product -->
                <article class="product">
                    <div class="img-container">
                        <img src=${product.image} alt="product1" class="product-img" />
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fa fa-cart-plus"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </article>
                <!-- End single product -->
            `
    });

    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true
      }
      button.addEventListener('click', event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //get products from products
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1
        };
        //Add products to cart
        cart = [...cart, cartItem];
        //Save cart in local Storage
        Storage.saveCart(cart);
        //Set cart values
        this.setCartValues(cart);
        //Display cart items
        //show the cart
      });

    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
}

//Local Storage Class
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(Products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

//Event listener for kicking things off
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products.getProducts().then(products => {
    //console.log(products);
    ui.displayProducts(products)
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
  });
});