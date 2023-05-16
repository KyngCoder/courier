module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define("Login", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Login.associate = (models) => {
    Login.belongsTo(models.Users, {
      onDelete: "cascade",
      foreignKey: "userId",
    });
  };


  return Login;
};
