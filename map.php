<!DOCTYPE html>
<html lang="de-DE">
	<head>
		<meta charset="UTF-8" />
		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
		<script type="text/javascript" src="js/marker.js"></script>
	</head>

	<?php

	require_once 'podioConfig.php';
	/* podioConfig.php:
	define("CLIENT_ID", "xxx");
	define("CLIENT_SECRET", "xxx");
	define("APP_ID", "xxx");
	define("APP_TOKEN", "xxx");
*/
	require_once 'podio/PodioAPI.php';
	
	ini_set('display_errors', '1');

	Podio::setup(CLIENT_ID, CLIENT_SECRET);

	Podio::authenticate('app', array('app_id' => APP_ID, 'app_token' => APP_TOKEN));
	

	// Get Lager cat field
	$items = PodioItem::filter(APP_ID, array('limit' => 500));
?>

	<script>
		var leads =<?php echo $items['body']; ?>;
	</script>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="js/jquery.ui.map.full.min.js"></script>
	<script type="text/javascript" src="js/map.js"></script>

	<style type="text/css">
		html {
			height: 100%
		}
		body {
			height: 100%;
			margin: 0;
			padding: 0
		}
		#map_canvas {
			height: 100%
		}
	</style>

	<body onload="initialize()">
		<div id="map_canvas"></div>
		<div id="radios" filter="tags" class="item gradient rounded shadow" style="background:#fff; margin:5px;padding:5px 5px 5px 10px;"></div>
		<div id="radios2" filter="typ" class="item gradient rounded shadow" style="background:#fff; margin:5px;padding:5px 5px 5px 10px;"></div>
	</body>
</html>