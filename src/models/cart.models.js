import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: {
      type: [
        {
          id_prod: {
            type: Schema.Types.ObjectId,
            ref: "products",  // Asegúrate de que la referencia coincida con el nombre del modelo de producto
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      default: function () {
        return [];
      },
    },
  },
  { versionKey: false }
);

// Middleware para poblar el campo "id_prod" dentro de cada objeto en el array "products"
cartSchema.pre("find", function (next) {
  this.populate("products.id_prod");
  next();
});

export const cartModel = model("Cart", cartSchema);  // Cambié el nombre del modelo a "Cart"
