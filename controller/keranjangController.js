const modelKeranjang = require("../model/keranjangModel");
const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

exports.inputKeranjang = (data) =>
	new Promise(async (resolve, reject) => {
		modelKeranjang
			.create(data)
			.then(() => {
				resolve({
					status: true,
					msg: "Berhasil Menambah Keranjang",
				});
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.getAllKeranjang = (idUser) =>
	new Promise(async (resolve, reject) => {
		modelKeranjang
			.aggregate([
				{ $match: { idUser: objectId(idUser) } },
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
					resolve({
						status: true,
						msg: "Berhasil Memuat Data",
						data: dataKeranjang,
					});
				} else {
					reject({
						status: false,
						msg: "Keranjang anda kosong",
					});
				}
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan Pada Server",
				});
			});
	});

exports.getKeranjangById = (oId) =>
	new Promise(async (resolve, reject) => {
		modelKeranjang
			.aggregate([
				{ $match: { _id: objectId(oId) } },
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
				if (dataKeranjang) {
					resolve({
						status: true,
						msg: "Berhasil Memuat Data",
						data: dataKeranjang,
					});
				} else {
					reject({
						status: false,
						msg: "Tidak Ada Barang",
					});
				}
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan Pada Server",
				});
			});
	});

exports.updateKeranjang = (id, data) =>
	new Promise(async (resolve, reject) => {
		modelKeranjang
			.updateOne({ _id: objectId(id) }, data)
			.then(() => {
				resolve({
					status: true,
					msg: "Berhasil Merubah data",
				});
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});

exports.deleteKeranjang = (id) =>
	new Promise(async (resolve, reject) => {
		modelKeranjang
			.deleteOne({ _id: objectId(id) })
			.then(() => {
				resolve({
					status: true,
					msg: "Berhasil Menghapus data",
				});
			})
			.catch((err) => {
				reject({
					status: false,
					msg: "Terjadi Kesalahan pada Server",
				});
			});
	});
