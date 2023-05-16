module.exports = (sequelize, DataTypes) => {
  const UniqueNumberCounter = sequelize.define("UniqueNumberCounter", {
    counter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  return UniqueNumberCounter;
};
