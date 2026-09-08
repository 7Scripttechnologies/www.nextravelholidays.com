import mysql from "mysql2/promise";

type MysqlPool = mysql.Pool;

const globalForMysql = globalThis as unknown as { mysqlPool?: MysqlPool };

export function mysqlConfig() {
  return {
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? "nextravel",
    password: process.env.MYSQL_PASSWORD ?? "nextravel",
    database: process.env.MYSQL_DATABASE ?? "nextravel",
  };
}

export function getPool() {
  if (!globalForMysql.mysqlPool) {
    const config = mysqlConfig();
    globalForMysql.mysqlPool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      charset: "utf8mb4",
      dateStrings: true,
    });
  }

  return globalForMysql.mysqlPool;
}

export async function closePool() {
  if (globalForMysql.mysqlPool) {
    await globalForMysql.mysqlPool.end();
    globalForMysql.mysqlPool = undefined;
  }
}

export async function ensureDatabase() {
  const config = mysqlConfig();
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : "";
    if (code !== "ER_DBACCESS_DENIED_ERROR" && code !== "ER_ACCESS_DENIED_ERROR") {
      throw error;
    }
  } finally {
    await connection.end();
  }
}
