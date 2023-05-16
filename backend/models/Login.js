module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("Login", {
      
    
     
     
      userName:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      password:{
        type:DataTypes.STRING,
        allowNull:false,
      },
    
    });

    Login.associate = (models) => {
        Login.hasMany(models.Users, {
        onDelete: "cascade",
        foreignKey: "LoginId"
      })
    }
  
    

    return Login;
  };