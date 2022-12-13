<?php 
/* JSON HEADER */
define("FROM_EMAIL", "poukaz.poptavka@kosmetika-daniela.cz");

/* DATA KEYS */
$post_keys = array("jmeno", "telefon", "email", "poznamkaSalon", "provedeni", "vyzvednuti", "hodnota", "hodnotaVlastni", "kodPoukazu", "obdarovana", "prani", "variabilniSymbol" );

$keys_labels = array("jmeno" => "Jméno objednavatele: ", "telefon" => "Telefon: ", "email" => "E-mail: ", "poznamkaSalon" => "Poznámka do salonu: ", "provedeni" => "Varianta poukazu: ", "vyzvednuti" => "Vyzvednutí: ", "hodnota" => "Hodnota poukazu v Kč: ", "hodnotaVlastni" => "Vlastní hodnota poukazu v Kč: ", "kodPoukazu" => "Kód poukazu: ", "obdarovana" => "Jméno obdarované: ", "prani" => "Přání k poukazu: ", "variabilniSymbol" => "Variabilní symbol: ");

$keys_exists = true;
$data = array();

/* CHECK IF WE HAVE DATA */
foreach($post_keys as $key){
	if(!isset($_POST[$key])){
		$keys_exists = false;
	} else {
		$data[$key] = strip_tags(htmlspecialchars($_POST[$key]));
	}
}

if($keys_exists){
	$content = "";
	$content .= "<h2>Poptávka poukazu</h2>";
	$content .= "<p>VYPLNĚNÉ ÚDAJE:</p><br><hr>";
	
	foreach($data as $key => $item){
		$content .=  "<b>" . $keys_labels[$key] . "</b><br>" . " " . $item . "<br><br>";
	}

	if($data["provedeni"] == "elektronická verze") {
		$content .=  "<b>" . "PLATEBNÍ ÚDAJE:<br>- - - - - - - - - - - - - - -<br>číslo účtu:</b> 288850775/0300<br><b>variabilní symbol:</b> " . $data["variabilniSymbol"] . "<br>" . "<b>Částka k zaplacení v Kč:</b> " . $data["hodnota"] . "<br>" . $data["hodnotaVlastni"] . "<br><br>";
	}
	else {
		$content .=  "<b>" . "Jak poukaz připravíme, budeme Vás kontaktovat." . "<br><br>";
	}
	
	$content .= "<br><br><hr>";
	$content .= "Žadatel / Žadatelka odesláním této poptávky souhlasil/a se zpracováním svých osobních údajů. Souhlas byl udělen dnem odeslání této žádosti.";
	
	
	$subject = 'Poptávka poukazu | www.kosmetika-daniela.cz';

	$headers = "From: " . FROM_EMAIL . "\r\n";
	$headers .= "Reply-To: ". "info@kosmetika-daniela.cz" . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";
	
	if(mail("jakubec10@gmail.com", $subject, $content, $headers)) { // následně vyměnit za e-mail do salonu
		echo "{\"result\":\"true\"}";
		
		mail($data["email"], $subject, $content, $headers);
	} else {
		echo "{\"result\":\"false\",\"reason\":\"Mail function failed\"}";
	}
	
} else {
	echo "{\"result\":\"false\",\"reason\":\"All data not sent\"}";
}