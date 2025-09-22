const db = require('../config/database');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  // Generic CRUD operations
  async findById(id) {
    try {
      const [rows] = await this.db.execute(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding ${this.tableName} by id: ${error.message}`);
    }
  }

  async findAll(limit = 50, offset = 0) {
    try {
      const [rows] = await this.db.execute(
        `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error finding all ${this.tableName}: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const [result] = await this.db.execute(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`,
        values
      );

      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating ${this.tableName}: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const updates = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(data), id];

      await this.db.execute(
        `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`,
        values
      );

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating ${this.tableName}: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const [result] = await this.db.execute(
        `DELETE FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting ${this.tableName}: ${error.message}`);
    }
  }

  // Helper method for custom queries
  async executeQuery(query, params = []) {
    try {
      const [rows] = await this.db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Database query error: ${error.message}`);
    }
  }
}

module.exports = BaseRepository;