const express = require("express");
const db = require("./connection");
const bodyParser = require("body-parser");

const app = express();

const generateOrderId = () => {
  const prefix = "DONS-";
  const uniqueId = Date.now().toString(36); // Convert timestamp to base36 string for uniqueness
  return prefix + uniqueId;
};

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.use("/src", express.static("src"));

const formatPrice = (number) => {
  const formattedNumber = number.toLocaleString("id-ID");
  return formattedNumber.replace(/,/g, ".");
};

db.connect((err) => {
  if (err) throw err;

  app.get("/booster", (req, res) => {
    const products = `SELECT * FROM tb_produk`;
    db.query(products, (err, result) => {
      if (err) {
        console.error("Error retrieving products:", err);
        return res.status(500).json({ message: "Error retrieving products" });
      }

      result.forEach((product) => {
        product.harga = formatPrice(product.harga);
      });

      res.render("booster", { products: result, title: "test" });
    });
  });

  app.get("/", (req, res) => {
    res.render("index");
  });

  app.post("/order", (req, res) => {
    const formData = req.body;
    // Lakukan validasi data (jika diperlukan)
    // Simpan data ke tabel tb_identitas_pelanggan
    const insertQuery = `
    INSERT INTO tb_identitas_pelanggan (nickname, alamat_email, kata_sandi, login_via, catatan, hero, id_game)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    const values = [
      formData.nickname,
      formData.email_noHp,
      formData.password,
      formData.login,
      formData.notes,
      formData.request_hero,
      formData.id_game,
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting data into tb_identitas_pelanggan:", err);
        return res.status(500).json({ message: "Error inserting data" });
      }

      // Simpan data ke tabel tb_orders
      const insertOrderQuery = `
      INSERT INTO tb_orders (no_produk, id_user, no_telpon)
      VALUES (?, ?, ?)
    `;
      const orderValues = [
        formData.select_booster,
        result.insertId,
        formData.email_noHp,
      ];

      db.query(insertOrderQuery, orderValues, (err, orderResult) => {
        if (err) {
          console.error("Error inserting data into tb_orders:", err);
          return res
            .status(500)
            .json({ message: "Error inserting data into tb_orders" });
        }

        // Kirim respon ke frontend (jika diperlukan)
        return res.json({ message: "Order successfully saved" });
      });
    });
  });
});

app.listen(8000, () => {
  console.log("server ready");
});
