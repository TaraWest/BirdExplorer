import sequelize from "../database/client.js";
import { DataTypes, Model } from "sequelize";

class Bird extends Model {}

Bird.init(
  {
    species_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    com_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sci_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family_com_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "birds",
  }
);

export default Bird;
