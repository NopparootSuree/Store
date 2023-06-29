const dbConfig = require('../config/db.config')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log("Connected Database success");
})
.catch((err) => {
    console.log("Failed to connect Database", err);
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.products = require('./productModel')(sequelize, DataTypes)
db.reviews = require('./reviewModel')(sequelize, DataTypes)
db.users = require('./userModel')(sequelize, DataTypes)

db.users.hasMany(db.reviews, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  
  db.products.hasMany(db.reviews, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
  });
  
  db.reviews.belongsTo(db.users, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    foreignKeyType: DataTypes.STRING
  });
  
  db.reviews.belongsTo(db.products, {
    foreignKey: 'product_id',
    targetKey: 'product_id',
    foreignKeyType: DataTypes.STRING
  });

db.sequelize.sync({ force: false })
.then(() => {
    console.log("Sync is Completed");
})
.catch((err) => {
    console.log("Failed is Sync", err);
})

module.exports = db