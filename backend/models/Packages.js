module.exports = (sequelize, DataTypes) => {
  const Packages = sequelize.define('Packages', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    airwayBillNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  Packages.associate = (models) => {
    Packages.belongsTo(models.Users, {
      foreignKey: 'member_no',
      targetKey: 'member_no',
      allowNull: false,
    });
  };

  return Packages;
};
