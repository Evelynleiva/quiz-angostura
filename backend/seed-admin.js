import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function crearAdmin() {
  let connection;
  
  try {
    // Conectar a MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'museo_app',
      password: process.env.DB_PASSWORD || 'MuseoQuiz2024!Secure',
      database: process.env.DB_NAME || 'museo_quiz'
    });

    console.log('✅ Conectado a MySQL');

    // Generar hash del password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔐 Password hasheado correctamente');
    console.log('Hash generado:', hashedPassword);

    // Limpiar tabla administradores
    await connection.query('DELETE FROM administradores');
    console.log('🗑️  Administradores anteriores eliminados');

    // Insertar nuevo admin
    const [result] = await connection.query(
      `INSERT INTO administradores (nombre, email, password, rol, activo, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      ['Administrador Museo', 'admin@museo.cl', hashedPassword, 'admin', 1]
    );

    console.log('\n✅ ¡Admin creado exitosamente!');
    console.log('================================');
    console.log('📧 Email: admin@museo.cl');
    console.log('🔑 Password: admin123');
    console.log('🆔 ID:', result.insertId);
    console.log('================================\n');

    // Verificar que se creó correctamente
    const [rows] = await connection.query(
      'SELECT id, nombre, email, rol, activo FROM administradores WHERE email = ?',
      ['admin@museo.cl']
    );

    console.log('✅ Verificación en BD:');
    console.table(rows);

    await connection.end();
    console.log('\n✅ Todo listo. Ahora prueba el login con:');
    console.log('   Email: admin@museo.cl');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

crearAdmin();