// in the controller functions we simply write the function that we want to run when a 
// request hits a particular route in the routes folder

exports.getAllProducts = (req, res) => {
    res.status(200).json({message: "This route is working fine!"})
};
//