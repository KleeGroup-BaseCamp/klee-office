const getMap = (req, res) => {

	var options = {
		root: './data/maps/'
	};
	const mapName = req.params.name;
	console.log('call of service to get map ' + mapName);
	res.sendFile(mapName, options);
};

module.exports = {
	getMap
}