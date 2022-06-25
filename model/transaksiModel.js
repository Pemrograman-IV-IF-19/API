const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const transaksiModel = mongoose.Schema({
	idUser: {
		type: objectId,
	},
	gambarBarang: {
		type: String,
	},
	namaBarang: {
		type: String,
	},
	hargaBarang: {
		type: Number,
	},
	jumlahBeli: {
		type: Number,
	},
	totalHarga: {
		type: Number,
	},
});

module.exports = mongoose.model("transaksi", transaksiModel);
