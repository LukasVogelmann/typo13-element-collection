CREATE TABLE tt_content (
	-- Container-Base --
	container_width varchar(11) DEFAULT '' NOT NULL,
	margin_top varchar(8) DEFAULT '' NOT NULL,
	margin_bottom varchar(8) DEFAULT '' NOT NULL,
	columns_mobile_behaviour varchar(11) DEFAULT '' NOT NULL,
	container_background varchar(32) DEFAULT '' NOT NULL,
	container_padding_x varchar(11) DEFAULT '' NOT NULL,
	container_padding_y varchar(11) DEFAULT '' NOT NULL,

	-- Container: > One-Column --
	columns_layout varchar(11) DEFAULT '' NOT NULL,
);
