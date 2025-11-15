import { conmysql } from '../db.js';

export const darLike = async (req, res) => {
  try {
    const { id_login_cliente, id_galeria } = req.body;

    if (!id_login_cliente || !id_galeria) {
      return res.status(400).json({ mensaje: "Faltan datos requeridos" });
    }

    // Insertar like (UNIQUE evita duplicados)
    await conmysql.query(
      `INSERT INTO Me_Gustas (id_login_cliente, id_galeria) VALUES (?, ?)`,
      [id_login_cliente, id_galeria]
    );

    res.json({
      estado: 1,
      mensaje: "Like agregado correctamente"
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "El usuario ya dio like a esta foto" });
    }

    console.error("Error en darLike:", error);
    res.status(500).json({ mensaje: "Internal server error" });
  }
};


export const quitarLike = async (req, res) => {
  try {
    const { id_login_cliente, id_galeria } = req.body;

    const [result] = await conmysql.query(
      `DELETE FROM Me_Gustas 
       WHERE id_login_cliente = ? AND id_galeria = ?`,
      [id_login_cliente, id_galeria]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No existía un like para eliminar" });
    }

    res.json({ estado: 1, mensaje: "Like eliminado correctamente" });

  } catch (error) {
    console.error("Error en quitarLike:", error);
    res.status(500).json({ mensaje: "Internal server error" });
  }
};


export const contarLikes = async (req, res) => {
  try {
    const { id_galeria } = req.params;

    const [rows] = await conmysql.query(
      `SELECT COUNT(*) AS likes 
       FROM Me_Gustas 
       WHERE id_galeria = ?`,
      [id_galeria]
    );

    res.json({ id_galeria, likes: rows[0].likes });

  } catch (error) {
    console.error("Error en contarLikes:", error);
    res.status(500).json({ mensaje: "Internal server error" });
  }
};


export const verificarLike = async (req, res) => {
  try {
    const { id_login_cliente, id_galeria } = req.body;

    const [rows] = await conmysql.query(
      `SELECT 1 
       FROM Me_Gustas 
       WHERE id_login_cliente = ? AND id_galeria = ?`,
      [id_login_cliente, id_galeria]
    );

    res.json({
      liked: rows.length > 0
    });

  } catch (error) {
    console.error("Error en verificarLike:", error);
    res.status(500).json({ mensaje: "Internal server error" });
  }
};
