const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const keranjangModel = mongoose.Schema({
	idUser: {
		type: objectId,
	},
	idBarang: {
		type: objectId,
	},
	jumlahBeli: {
		type: Number,
	},
});

module.exports = mongoose.model("keranjang", keranjangModel);
