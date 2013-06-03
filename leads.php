<!DOCTYPE html>
<html lang="de-DE">
<head>
<meta charset="UTF-8" />
 

</head><body>
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

$items = PodioItem::filter(APP_ID, array('limit' => 500));
?>
<table>
	
	<?php
	foreach ($items['items'] as $key => $lead) {
		if($lead->field('zip-codepost-code') && $lead->field('street-address') && $lead->field('city')) {
			$address = $lead->field('street-address')->humanized_value() 
			. ", " 
			. $lead->field('zip-codepost-code')->humanized_value() 
			. " " 
			. $lead->field('city')->humanized_value();
			
			if($lead->field('country')) {
				$address = $address . ", " . $lead->field('country')->humanized_value();
			}
			
		} else {
			$address = false;
		}
					
		if( !$address) {
			continue;
		}	
		$url = "http://maps.google.com/maps/api/geocode/json?address=" . urlencode($address) . "&sensor=false";

		
		$geocode=file_get_contents($url);
		
		$output = json_decode($geocode);
		
		if(count($output->results) > 0) {
			PodioItem::update($lead->item_id, array('fields' => array(
			  "latlon" => $output->results[0]->geometry->location->lat . "," . $output->results[0]->geometry->location->lng
			)), array('silent'=>1));
}
		
		 //$lead->fields['latlon']  =  new PodioTextItemField('latlon');
		 //$lead->field('latlon') =  new PodioTextItemField('latlon');
		
		//$lead->field('latlon')->set_value($output->results[0]->geometry->location->lat . "," . $output->results[0]->geometry->location->lng)->save();
		
		?>
		<tr><td><?=$lead -> field('company-or-organisation') -> humanized_value() ?></td>
			<td></td>
			  <td><?php echo $address; ?></td>
			  </tr>
		<?php

		}
	?>
</table>
</body>
</html>