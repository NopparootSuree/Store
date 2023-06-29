module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("products", {
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    }, {
    timestamps: true,
    indexes: [
        {
        unique: true,
        fields: ['name'],
        },
    ],
    })
    return Product
}