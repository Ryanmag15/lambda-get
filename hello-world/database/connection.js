class PgConnection {
    constructor(url) {
        console.log('url');
        console.log(url);
      this.client = new Client(url);
    }
  
    async query(sql, params = []) {
      await this.client.connect();
      const result = await this.client.query(sql, params);
      await this.client.end();
      return result.rows;
    }
  }
  
  module.exports = { PgConnection };
  