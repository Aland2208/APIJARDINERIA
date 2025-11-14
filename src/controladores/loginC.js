import { conmysql } from '../db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import crypto from 'crypto';

// ===============================
// 🔐 LOGIN
// ===============================
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en ambas tablas LOGIN
    const [loginCliente] = await conmysql.query(
      'SELECT *, "cliente" AS tipo FROM Login_Clientes WHERE username = ?',
      [username]
    );

    const [loginJardinero] = await conmysql.query(
      'SELECT *, "jardinero" AS tipo FROM Login_Jardineros WHERE username = ?',
      [username]
    );

    // Determinar tipo automáticamente
    let user = null;

    if (loginCliente.length > 0) user = loginCliente[0];
    if (loginJardinero.length > 0) user = loginJardinero[0];

    if (!user) {
      return res.status(404).json({ estado: 0, mensaje: "Usuario no encontrado" });
    }

    // Validar contraseña
    const hashIngresado = crypto.createHash("md5").update(password).digest("hex");
    if (hashIngresado !== user.password_hash) {
      return res.status(401).json({ estado: 0, mensaje: "Contraseña incorrecta" });
    }

    // Obtener tabla de datos según el tipo
    let tablaDatos = user.tipo === "cliente" ? "Clientes" : "Jardineros";
    let campoId = user.tipo === "cliente" ? "id_cliente" : "id_jardinero";

    const [info] = await conmysql.query(
      `SELECT * FROM ${tablaDatos} WHERE ${campoId} = ?`,
      [user[campoId]]
    );

    const datos = info[0];

    // Crear token
    const token = jwt.sign(
      {
        id: datos[campoId],
        tipo: user.tipo,
        nombre: datos.nombre_completo,
        email: datos.email
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      estado: 1,
      mensaje: "Login exitoso",
      tipo: user.tipo,
      token,
      usuario: datos
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ estado: 0, mensaje: "Internal server error" });
  }
};


// ===============================
// 🔎 VERIFICAR EMAIL Y USERNAME (UNIFICADO CLIENTES + JARDINEROS)
// ===============================
export const verificarUsuarioCorreo = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email && !username) {
      return res.status(400).json({ mensaje: "Debe enviar email o username" });
    }

    // -------- BUSCAR EMAIL --------
    const [emailExist] = await conmysql.query(
      `
      SELECT 'cliente' AS tipo, id_cliente AS id, nombre_completo, email
      FROM Clientes WHERE email = ?

      UNION

      SELECT 'jardinero' AS tipo, id_jardinero AS id, nombre_completo, email
      FROM Jardineros WHERE email = ?;
      `,
      [email, email]
    );

    // -------- BUSCAR USERNAME --------
    const [usernameExist] = await conmysql.query(
      `
      SELECT 'cliente' AS tipo, id_cliente AS id, username
      FROM Login_Clientes WHERE username = ?

      UNION

      SELECT 'jardinero' AS tipo, id_jardinero AS id, username
      FROM Login_Jardineros WHERE username = ?;
      `,
      [username, username]
    );

    return res.json({
      emailExiste: emailExist.length > 0 ? emailExist : null,
      usernameExiste: usernameExist.length > 0 ? usernameExist : null
    });

  } catch (error) {
    console.error("Error en verificarUsuarioCorreo:", error);
    return res.status(500).json({ mensaje: "Internal server error" });
  }
};
