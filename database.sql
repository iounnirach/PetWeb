DROP DATABASE IF EXISTS HOLD_MY_CAT;

CREATE DATABASE HOLD_MY_CAT;

CREATE TABLE HOLD_MY_CAT.user_profile(
	user_id 	INT 			AUTO_INCREMENT,
    name 		VARCHAR(50) 	NOT NULL,
    lastname 	VARCHAR(50) 	NOT NULL,
    mail 		VARCHAR(50) 	UNIQUE,
    tell 		INT 			NOT NULL,
    linkFB 		VARCHAR(100) 	NOT NULL,
    password 	VARCHAR(20) 	NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE HOLD_MY_CAT.hotel_profile (
	hotel_id 	INT 			AUTO_INCREMENT,
    user_id		INT 			NOT NULL,
    hotel_name	VARCHAR(100)	NOT NULL,
    cat_number 	INT 			NOT NULL,
    symptom 	VARCHAR(20) 	NOT NULL,
    address 	VARCHAR(100) 	NOT NULL,
    subdistrict VARCHAR(50) 	NOT NULL,
    district 	VARCHAR(50) 	NOT NULL,
    province 	VARCHAR(20) 	NOT NULL,
    postal_code INT 			NOT NULL,
    latitude 	FLOAT 			NOT NULL,
    longitude 	FLOAT 			NOT NULL,
    hotel_note 	VARCHAR(500),
    PRIMARY KEY (hotel_id),
    FOREIGN KEY (user_id) REFERENCES HOLD_MY_CAT.user_profile(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE HOLD_MY_CAT.booking_info(
	booking_id 	INT 			AUTO_INCREMENT,
    user_id		INT 			NOT NULL,
    hotel_id	INT 			NOT NULL,
    normal 		INT 			NOT NULL,
    sick 		INT 			NOT NULL,
    nights 		INT 			NOT NULL,
    how_sick 	VARCHAR(100),
    start_deal 	DATE 			NOT NULL,
    booking_note VARCHAR(500),
    normal_price INT 			NOT NULL,
    sick_price 	INT 			NOT NULL,
    status		VARCHAR(20) 	NOT NULL,
    PRIMARY KEY (booking_id),
    FOREIGN KEY (user_id) REFERENCES HOLD_MY_CAT.user_profile(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES HOLD_MY_CAT.hotel_profile(hotel_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE HOLD_MY_CAT.review(
	review_id 	INT 			AUTO_INCREMENT,
    user_id		INT 			NOT NULL,
    hotel_id 	INT				NOT NULL,
    score 		INT 			NOT NULL,
    review_note VARCHAR(500),
    PRIMARY KEY (review_id),
    FOREIGN KEY (user_id) REFERENCES HOLD_MY_CAT.user_profile(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES HOLD_MY_CAT.hotel_profile(hotel_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SELECT * FROM HOLD_MY_CAT.user_profile;
SELECT * FROM HOLD_MY_CAT.hotel_profile;
SELECT * FROM HOLD_MY_CAT.booking_info;
SELECT * FROM HOLD_MY_CAT.review;

SELECT * FROM HOLD_MY_CAT.user_profile WHERE mail = "iounnirach15@gmail.com";
hotel_profilehotel_profilebooking_info
-- home page -------------------------hotel_profile
SELECT 
hp.hotel_name,
AVG(re.score) AS avg_score,
hp.hotel_name,
hp.cat_number,
hp.symptom,
hp.subdistrict,
hp.district,
hp.province,
hp.postal_code,
hp.latitude,
hp.longitude,
hp.hotel_note
FROM HOLD_MY_CAT.user_profile as p
INNER JOIN HOLD_MY_CAT.hotel_profile as hp
ON p.user_id = hp.user_id
INNER JOIN HOLD_MY_CAT.review as re
ON p.user_id = re.user_id;

-- home page hotail detail ------------------------------
SELECT 
hp.hotel_name,
p.tell,
p.linkFB,
AVG(re.score) AS avg_score,
hp.cat_number,
hp.symptom,
hp.latitude,
hp.longitude
FROM HOLD_MY_CAT.user_profile as p
INNER JOIN HOLD_MY_CAT.hotel_profile as hp
ON p.user_id = hp.user_id
INNER JOIN HOLD_MY_CAT.review as re
ON p.user_id = re.user_id
WHERE re.hotel_id = 1;
-- home page hotail detail (review)
SELECT
CONCAT(p.name, " ", p.lastname) as review_name,
re.score,
re.review_note
FROM HOLD_MY_CAT.user_profile as p
INNER JOIN HOLD_MY_CAT.review as re
ON p.user_id = re.user_id
WHERE hotel_id = 1;

-- booking page ----------------------------------------
SELECT cat_number FROM HOLD_MY_CAT.hotel_profile WHERE hotel_id = 1;
INSERT INTO HOLD_MY_CAT.booking_info
(user_id, hotel_id, normal, sick, nights, how_sick, start_deal, booking_note, normal_price, sick_price, status) VALUES
(1, 1, 0, 0, 1, "", "2021-05-04", "", 200, 500, "active");

-- conclude booking page ----------------------------------------
SELECT normal, sick, nights, how_sick, start_deal, booking_note FROM HOLD_MY_CAT.booking_info WHERE booking_id = 1 AND user_id = 1;
DELETE FROM HOLD_MY_CAT.booking_info WHERE booking_id = 1 AND user_id = 1;

-- create hotel page ----------------------------------------
INSERT INTO HOLD_MY_CAT.hotel_profile
(user_id, hotel_name, cat_number, symptom, address, subdistrict, district, province, postal_code, latitude, longitude, hotel_note) VALUES
(1, "packpom", 2, "normal", "1/247 suparai village", "napang", "bangna", "bangkok", 11130, 112568.012985, 21536.024825, "");

-- create review page ----------------------------------------
INSERT INTO HOLD_MY_CAT.review
(user_id, hotel_id, score, review_note) VALUES
(1, 1, 5, "the best");

-- prepare data

INSERT INTO  HOLD_MY_CAT.user_profile 
(user_id, name, lastname, mail, tell, linkFB, password) VALUES 
(1, "Nuttakron", "Junior", "edit@gmail.com", 0900425876, "https://www.facebook.com/nuttakronjunior.nuttakron/", "nut25974vy"),
(2, "Tony", "Stark", "tonyStark@gmail.com", 0875468975, "https://www.facebook.com/tonystark.tony/", "tonystark252");


INSERT INTO HOLD_MY_CAT.hotel_profile
(hotel_id, user_id, hotel_name, cat_number, symptom, address, subdistrict, district, province, postal_code, latitude, longitude, hotel_note) VALUES
(1, 1, "packpom", 2, "normal", "1/247 suparai village", "napang", "bangna", "bangkok", 11130, 112568.012985, 21536.024825, ""),
(2, 2, "homochi", 3, "normal&sick", "25/9 suparai village", "napa", "bangntai", "bangkok", 11280, 118647.011568, 63536.024735, "no comment (030)");

INSERT INTO HOLD_MY_CAT.booking_info
(booking_id, user_id, hotel_id, normal, sick, nights, how_sick, start_deal, booking_note, normal_price, sick_price, status) VALUES
(1, 1, 1, 1, 0, 3, "", "2021-05-04", "3 time eat food", 200, 500, "active"),
(2, 1, 1, 2, 1, 1, "catsick", "2021-05-04", "2 medicine wit 1 cat", 200, 500, "cancel");

INSERT INTO HOLD_MY_CAT.review
(review_id, user_id, hotel_id, score, review_note) VALUES 
(1, 1, 1, 5, "the best"),
(2, 1, 1, 3, "normal hotel");

INSERT INTO HOLD_MY_CAT.booking_info
    (user_id, hotel_id, normal, sick, nights, how_sick, start_deal, booking_note, normal_price, sick_price, status) VALUES (2, 2, 1, 1, 4, "โรคเอดส์แมว", "2021-05-04","dascxsa" , 200, 500, "active");

SELECT tell  FROM user_profile WHERE user_id = 1 ;


-- INSERT INTO  HOLD_MY_CAT.user_profile 
-- (user_id, name, lastname, mail, tell, linkFB, password) VALUES 
-- (3, "poom", "praichum", "WTF@gmail.com", 0990145696, "https://www.facebook.com/Poom.prachunm/", "123123");
