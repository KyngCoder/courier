const { Op } = require("sequelize");

const { Users, Packages } = require("../models");
const generateUniqueAirwayNo = require("../util/airwayNumber");

const uniqueAirwayNo = generateUniqueAirwayNo();

const createPackage = async (req, res) => {
  try {
    const {
      member_no,
      fullName,
      description,
      deliveryStatus,
      status,
      cost,
    } = req.body;

    // Find the user by member_no
    const user = await Users.findOne({ where: { member_no } });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(cost);

    // Create a new package associated with the user
    const package = await Packages.create({
      member_no,
      fullName,
      airwayBillNo:uniqueAirwayNo,
      description,
      deliveryStatus,
      status,
      cost,
    });

    return res.status(200).json(package);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the package" });
  }
};

const myPackage = async (req, res) => {
  const { member_no } = req.params;
  console.log(member_no);

  try {
    // Find the user based on the member_no
    const user = await Users.findOne({ where: { member_no } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the packages associated with the user
    const packages = await Packages.findAll({ where: { member_no } });

    return res.status(200).json({ packages });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving user packages" });
  }
};

const updatePackageStatus = async (req, res) => {
  const { packageId } = req.params;
  const { status } = req.body;

  try {
    // Find the package by its ID
    const package = await Packages.findByPk(packageId);

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Update the package status
    package.status = status;
    await package.save();

    return res
      .status(200)
      .json({ message: "Package status updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating package status" });
  }
};

const updatePackageDeliveryStatus = async (req, res) => {
  const { packageId } = req.params;
  const { deliveryStatus } = req.body;

  console.log(packageId, deliveryStatus);

  try {
    // Find the package by its ID
    const package = await Packages.findByPk(packageId);

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Update the package delivery status
    package.deliveryStatus = deliveryStatus;
    await package.save();

    return res
      .status(200)
      .json({ message: "Package delivery status updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "An error occurred while updating package delivery status",
      });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { search, status } = req.query;
    console.log("search", search);

    let packages;

    if (search) {
      // Search packages by name, member_no, or airwayBillNo
      packages = await searchPackages(search);
    } else {
      // Retrieve all packages
      packages = await Packages.findAll();
    }

    if (status) {
      // Filter packages by status
      packages = filterPackagesByStatus(packages, status);
    }

    return res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching packages" });
  }
};

const searchPackages = async (searchTerm) => {
  const searchOptions = {
    where: {
      [Op.or]: [
        { fullName: { [Op.like]: `%${searchTerm}%` } },
        { member_no: { [Op.like]: `%${searchTerm}%` } },
        { airwayBillNo: { [Op.like]: `%${searchTerm}%` } },
      ],
    },
  };

  return await Packages.findAll(searchOptions);
};

const filterPackagesByStatus = (packages, status) => {
  return packages.filter((pkg) => pkg.status === status);
};

module.exports = {
  createPackage,
  myPackage,
  updatePackageStatus,
  updatePackageDeliveryStatus,
  getAllPackages,
};
