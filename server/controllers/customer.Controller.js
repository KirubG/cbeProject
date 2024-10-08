import Customer from "../models/customer.model.js";

const getCustomer = async (req, res) => {
  try {
    if (req.query.q != "" && req.query.q !== undefined) {
      let query = req.query.q;
      const customers = await Customer.find({
        $or: [
          { phoneNumber: { $regex: new RegExp(query, "i") } },
          { customerEmail: { $regex: new RegExp(query, "i") } },
        ],
      });

      return res.json(customers);
    }
    // const customers = await Customer.find({});
    return res.json([]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Server error");
  }
};

const registreCustomer = async (req, res) => {
  try {
    let {
      firstName,
      middleName,
      lastName,
      businessName,
      customerEmail,
      phoneNumber,
      address,
    } = req.body;

    let fullName = firstName + " " + middleName + " " + lastName;

    const newCustomer = await Customer.create({
      firstName,
      middleName,
      lastName,
      fullName,
      businessName,
      customerEmail,
      phoneNumber,
      address,
      customerFile: { fileName: req.file.originalname, file: req.file.path },
    });

    return res.status(201).json("Customer registerd successfully");
  } catch (error) {
    console.log(error);

    return res.status(500).json("Server error");
  }
};

export { registreCustomer, getCustomer };
