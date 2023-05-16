module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    member_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parish: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pickup_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

 

  Users.associate = (models) => {
    Users.hasOne(models.Login, {
      onDelete: "cascade",
      foreignKey: "userId",
    });
  
    Users.hasMany(models.Packages, {
      onDelete: "cascade",
      foreignKey: "UserId",
    });
  };



  return Users;
};
