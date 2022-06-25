const transaksiModel = require("../model/transaksiModel");
const barangModel = require("../model/barangModel");
const keranjangModel = require("../model/keranjangModel");
const objectId = require("mongoose").Types.ObjectId;

exports.inputTransaksi = (data) =>
	new Promise(async (resolve, reject) => {
		const { idKeranjang } = data;
		keranjangModel
			.aggregate([
				{ $match: { _id: objectId(idKeranjang) } },
				{
					$lookup: {
						from: "users",
						localField: "idUser",
						foreignField: "_id",
						as: "user",
					},
				},
				{
					$lookup: {
						from: "barangs",
						localField: "idBarang",
						foreignField: "_id",
						as: "barang",
					},
				},
				{ $unwind: "$user" },
				{ $unwind: "$barang" },
			])
			.then((dataKeranjang) => {
				if (dataKeranjang.length > 0) {
					const { user, barang, jumlahBeli } = dataKeranjang[0];
					const dataTransaksi = {
						idUser: user._id,
						gambarBarang: barang.gambar,
						namaBarang: barang.nama,
						hargaBarang: barang.harga,
						jumlahBeli: jumlahBeli,
						totalHarga: jumlahBeli * barang.harga,
					};

					transaksiModel
						.create(dataTransaksi)
						.then(async () => {
							await barangModel.updateOne(
								{ _id: objectId(barang._id) },
								{ $inc: { stok: -jumlahBeli } },
							);
							await keranjangModel.deleteOne({ _id: objectId(idKeranjang) });
							resolve({
								status: true,
								msg: "Berhasil transaksi",
							});
						})
						.catch((err) => {
							reject({
								status: false,
								msg: "Terjadi Kesalahan pada Server",
							});
						});
				} else {
					reject({
						status: false,
						msg: "Data keranjang tidak ditemukan",
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
