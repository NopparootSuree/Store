module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("reviews", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['id'],
      },
    ],
  })

  return Review
}