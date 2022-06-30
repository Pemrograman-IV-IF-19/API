const router = require("express").Router();
const controllerTransaksi = require("../controller/transaksiController");

router.post("/input", (req, res) => {
	controllerTransaksi
		.inputTransaksi(req.body)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.get("/getAllTransaksi", (req, res) => {
	controllerTransaksi
		.getAllTransaksi()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.get("/getTransaksiById/:idTransaksi", (req, res) => {
	controllerTransaksi
		.getTransaksiById(req.params.idTransaksi)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.get("/getTransaksiByIdUser/:idUser", (req, res) => {
	controllerTransaksi
		.getTransaksiByIdUser(req.params.idUser)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

router.delete("/hapusTransaksi/:idTransaksi", (req, res) => {
	controllerTransaksi
		.hapusTransaksi(req.params.idTransaksi)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
