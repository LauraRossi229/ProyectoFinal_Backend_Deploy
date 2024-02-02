import { productModel } from "../models/products.models.js";

export const getProducts = async (req, res) => {
  const { limit, page, filter, sort } = req.query;

  const pag = page ? page : 1;
  const lim = limit ? limit : 100;
  const ord = sort == "asc" ? 1 : -1;

  try {
    const prods = await productModel.paginate(
      { filter: filter },
      { limit: lim, page: pag, sort: { price: ord } }
    );

    if (prods) {
      return res.status(200).send(prods);
    }

    res.status(404).send({ error: "Productos no encontrados" });
  } catch (error) {
    res.status(500).send({ error: `Error en consultar productos ${error}` });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findById(id);

    if (prod) {
      return res.status(200).send(prod);
    }

    res.status(404).send({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).send({ error: `Error en consultar producto ${error}` });
  }
};

export const postProduct = async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;

  try {
    const prod = await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
    });

    if (prod) {
      return res.status(201).send(prod);
    }

    res.status(400).send({ error: `Error en crear producto` });
  } catch (error) {
    if (error.code == 11000) {
      //error code es la llave duplicada
      return res
        .status(404)
        .send({ error: "Producto ya creado con llave duplicada" });
    }
    res.status(500).send({ error: `Error en consultar producto ${error}` });
  }
};



export const putProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, code, price, stock, category } = req.body;
  const { user } = req;

  try {
    const prod = await productModel.findById(id);

    if (!prod) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    // Verificar permisos: un usuario premium solo puede modificar sus propios productos
    if (user.rol === 'premium' && prod.owner !== user.email) {
      return res.status(403).send({ error: "No tienes permisos para modificar este producto" });
    }

    // Actualizar el producto
    const updatedProduct = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      code,
      price,
      stock,
      category,
    }, { new: true });

    return res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send({ error: `Error en actualizar el producto ${error}` });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  try {
    const prod = await productModel.findById(id);

    if (!prod) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    // Verificar permisos: un usuario premium solo puede borrar sus propios productos
    if (user.rol === 'premium' && prod.owner !== user.email) {
      return res.status(403).send({ error: "No tienes permisos para borrar este producto" });
    }

    // Borrar el producto
    const deletedProduct = await productModel.findByIdAndDelete(id);

    return res.status(200).send(deletedProduct);
  } catch (error) {
    res.status(500).send({ error: `Error en eliminar producto ${error}` });
  }
};