CREATE TABLE IF NOT EXISTS `locality_image` (
  `image_id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `image_name` varchar(100),
  `image_location` varchar(400),
  `locality_id` int(11),
  `user_id` int(11),
  `status` varchar(50) COMMENT '(uploaded, accepted, rejected, payment_pending, payment_successful, payment_unsuccessful)',
  `geocode_lat` varchar(50),
  `geocode_lng` varchar(50),
  `image_file_size_in_mb` double,
  `image_width_px` int(11),
  `image_height_px` int(11),
  category varchar(50),
  city varchar(100)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE user_details(
	user_id INT(10) PRIMARY KEY auto_increment,
	firstname VARCHAR(300) ,
	lastname VARCHAR(300) ,
	email VARCHAR(200) ,
	password VARCHAR(200) ,
	contact VARCHAR(10),
	link VARCHAR(500) ,
	status VARCHAR(500),
	role VARCHAR(500) ,
	city VARCHAR(300)
);

CREATE TABLE locality  (
	locality_id INT(10) PRIMARY KEY auto_increment,
	locality_name VARCHAR(300),
	locality_city VARCHAR(300) ,
	status VARCHAR(200) ,
	geocode_polygon_json VARCHAR(2000)
);

CREATE TABLE user_selected_locality(
	id INT(10) PRIMARY KEY auto_increment,
	user_id VARCHAR(300) NOT NULL,
	locality_id VARCHAR(300) NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	status VARCHAR(200) NOT NULL
);


CREATE TABLE city (
	id INT(10) PRIMARY KEY auto_increment,
	city VARCHAR(300)
);