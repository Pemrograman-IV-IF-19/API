const transaksiModel = require("../model/transaksiModel");
const barangModel = require("../model/barangModel");
const keranjangModel = require("../model/keranjangModel");
const objectId = require("mongoose").Types.ObjectId;

exports.inputTransaksi = (data) =>
	new Promise(async (resolve, reject) => {
		// const { idUser, dataTransaksi } = data;
		// let detailTransaksi = [];
		// let grandTotal = 0;

		// try {
		// 	for (let i in dataTransaksi) {
		// 		await keranjangModel
		// 			.aggregate([
		// 				{ $match: { _id: objectId(i.idKeranjang) } },
		// 				{
		// 					$lookup: {
		// 						from: "barangs",
		// 						localField: "idBarang",
		// 						foreignField: "_id",
		// 						as: "barang",
		// 					},
		// 				},
		// 				{ $unwind: "$barang" },
		// 			])
		// 			.then(async (dataKeranjang) => {
		// 				if (dataKeranjang.length > 0) {
		// 					const { barang, jumlahBeli } = dataKeranjang[0];
		// 					const dataTransaksi = {
		// 						namaBarang: barang.nama,
		// 						hargaBarang: barang.harga,
		// 						jumlahBeli: jumlahBeli,
		// 						subTotal: Number(jumlahBeli * barang.harga),
		// 					};
		// 					grandTotal += dataTransaksi.subTotal;
		// 					detailTransaksi.push(dataTransaksi);
		// 					await barangModel.updateOne(
		// 						{ _id: objectId(barang._id) },
		// 						{ $inc: { stok: -jumlahBeli } },
		// 					);
		// 					await keranjangModel.deleteOne({
		// 						_id: objectId(i.idKeranjang),
		// 					});
		// 					console.log(`ok: ${i.idKeranjang}`);
		// 				} else {
		// 					console.log(`fail: ${i.idKeranjang}`);
		// 				}
		// 			});
		// 	}
		// } catch (err) {
		// 	reject({
		// 		status: false,
		// 		msg: "Terjadi Kesalahan pada saat transaksi",
		// 	});
		// }

		await transaksiModel
			.create(data)
			.then(async () => {
				const { detailTransaksi } = data;
				for (let i = 0; i < detailTransaksi.length; i++) {
					await barangModel.updateOne(
						{ _id: objectId(detailTransaksi[i].idBarang) },
						{ $inc: { stok: -Number(detailTransaksi[i].jumlahBeli) } },
					);
					await keranjangModel.deleteOne({
						_id: objectId(detailTransaksi[i]._id),
					});
				}
				resolve({
					status: true,
					msg: "Berhasil transaksi",
				});
			})
			.catch((err) => {
				console.log(err);
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.getAllTransaksi = () =>
	new Promise(async (resolve, reject) => {
		transaksiModel
			.aggregate([
				{
					$lookup: {
						from: "users",
						localField: "idUser",
						foreignField: "_id",
						as: "user",
					},
				},
				{ $unwind: "$user" },
			])
			.then((data) => {
				if (data.length > 0) {
					resolve({
						status: true,
						msg: "Berhasil memuat data transaksi",
						data: data,
					});
				} else {
					reject({
						status: false,
						msg: "Data transaksi kosong",
					});
				}
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.getTransaksiById = (idTransaksi) =>
	new Promise(async (resolve, reject) => {
		transaksiModel
			.aggregate([
				{ $match: { _id: objectId(idTransaksi) } },
				{
					$lookup: {
						from: "users",
						localField: "idUser",
						foreignField: "_id",
						as: "user",
					},
				},
				{ $unwind: "$user" },
			])
			.then((data) => {
				if (data.length > 0) {
					resolve({
						status: true,
						msg: "Berhasil memuat data transaksi",
						data: data[0],
					});
				} else {
					reject({
						status: false,
						msg: "Data transaksi kosong",
					});
				}
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.getTransaksiByIdUser = (id) =>
	new Promise(async (resolve, reject) => {
		transaksiModel
			.find({ idUser: objectId(id) })
			.then((data) => {
				if (data.length > 0) {
					resolve({
						status: true,
						msg: "Berhasil memuat data transaksi",
						data: data,
					});
				} else {
					reject({
						status: false,
						msg: "Data transaksi kosong",
					});
				}
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.hapusTransaksi = (idTransaksi) =>
	new Promise(async (resolve, reject) => {
		transaksiModel
			.deleteOne({ _id: objectId(idTransaksi) })
			.then(() => {
				resolve({
					status: true,
					msg: "Berhasil menghapus data transaksi",
				});
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});
