const loginViaInp = document.getElementById("loginVia");
const product = document.getElementById("product");
const harga = document.getElementById("harga");
const radioButtons = document.querySelectorAll('input[name="select-booster"]');
const notes = document.getElementById("notes");
let formData = {};

// Mengambil value pada pilihan paket
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("change", updateSelectedProduct);
});

// Track setiap perubahan pada option login via
loginViaInp.addEventListener("change", function () {
  const selectedValue = loginViaInp.value;

  const selectedLogin = selectedValue !== "default" ? selectedValue : "";
  document.querySelector('.modal-value[data-field="LoginVia"]').textContent =
    selectedLogin;

  formData.login = selectedLogin;
});

// Default value pilihan paket
let selectedProduct = null;

// Fungsi mengupdate value paket setelah user memilih
function updateSelectedProduct() {
  selectedProduct = document.querySelector(
    'input[name="select-booster"]:checked'
  );

  // Memastikan data sudah di update di DOM pilih produk
  if (selectedProduct) {
    // id hanya sebagai opsi jika mau di refactor
    const selectedProductId = selectedProduct.id;

    // mengambil isi dari isi elemen html
    const selectedProductName =
      selectedProduct.nextElementSibling.querySelector("label").innerHTML;
    const selectedProductPrice =
      selectedProduct.nextElementSibling.querySelector("p").innerHTML;

    // Memasukkan data ke inner html pada id yang di target
    product.innerHTML = selectedProductName;
    harga.innerHTML = selectedProductPrice;
  } else {
    selectedProduct = null;
  }
}

function openModal() {
  // Ketika pop up muncul input value akan diambil
  const emailInp = document.getElementById("email-noHp").value;
  const reqHeroInp = document.getElementById("request-hero").value;
  const userIdInp = document.getElementById("user-id").value;
  const passwordInp = document.getElementById("password").value;

  // Setelah input value di ambil, lalu data value di passing ke data-field yang di targetkan
  document.querySelector('.modal-value[data-field="EmailNoHp"]').textContent =
    emailInp;
  document.querySelector('.modal-value[data-field="RequestHero"]').textContent =
    reqHeroInp;
  document.querySelector('.modal-value[data-field="UserId"]').textContent =
    userIdInp;
  document.querySelector('.modal-value[data-field="Password"]').textContent =
    passwordInp;

  // manipulasi css dengan mengubah default modal menjadi visible
  var modal = document.getElementById("myModal");
  modal.style.visibility = "visible";
}

function closeModal() {
  // manipulasi css dengan mengubah menjadi default
  var modal = document.getElementById("myModal");
  modal.style.visibility = "hidden";
}

// Fungsi yang langsung mengarah ke WhatsApp
function handleSubmit() {
  const emailInp = document.getElementById("email-noHp").value;
  const reqHeroInp = document.getElementById("request-hero").value;
  const userIdInp = document.getElementById("user-id").value;
  const nicknameInp = document.getElementById("nickname").value;
  const passwordInp = document.getElementById("password").value;
  const notesVal = notes.value;
  const loginViaInp = document.getElementById("loginVia");
  const selectedValue = loginViaInp.value;
  const selectedLogin = selectedValue !== "default" ? selectedValue : "";
  const paketProduk = document.querySelector(
      'input[name="select-booster"]:checked'
    ).value,
    formData = {
      email_noHp: emailInp,
      request_hero: reqHeroInp,
      id_game: userIdInp,
      nickname: nicknameInp,
      password: passwordInp,
      notes: notesVal,
      login: selectedLogin,
      select_booster: document.querySelector(
        'input[name="select-booster"]:checked'
      ).id,
    };

  fetch("/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server, if needed
      console.log("Server response:", data);

      // Isi no telp / Ubah disini
      const noTelp = `6285156790085`;

      // Pesan yang akan otomatis terisi di clipboard text whatsapp
      const message =
        `Email/No. Handphone: ${emailInp}%0A` +
        `Request Hero: ${reqHeroInp}%0A` +
        `User ID: ${userIdInp}%0A` +
        `Nickname: ${nicknameInp}%0A` +
        `Password: ${passwordInp}%0A` +
        `Paket ${paketProduk}%0A`;

      window.open(
        `https://api.whatsapp.com/send?phone=${noTelp}&text=${message}`
      );
      closeModal();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
